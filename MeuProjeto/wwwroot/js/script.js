document.addEventListener("DOMContentLoaded", async () => {
  const loginButton = document.getElementById("loginButton"); // botão fora do modal (abre o modal)
  const loginSubmit = document.getElementById("loginSubmit"); // botão dentro do modal (envia o login)
  const logoutButton = document.getElementById("logoutButton");
  const loginForm = document.getElementById("loginForm");
  const loginError = document.getElementById("loginError");

  // Função para mostrar dados do usuário logado
  function mostrarUsuario(user) {
    document.getElementById('userName').textContent = user.nome;
    document.getElementById('userPhoto').src = user.foto;
    loginButton.classList.add("d-none");
    logoutButton.classList.remove("d-none");
  }

  // Função para esconder dados do usuário logado
  function esconderUsuario() {
    document.getElementById('userName').textContent = "Sabor do Brasil";
    document.getElementById('userPhoto').src = "imagens/logo/logo_sabor_do_brasil.png";
    loginButton.classList.remove("d-none");
    logoutButton.classList.add("d-none");
  }

  // Verifica se já existe usuário logado no localStorage
  const usuarioSalvo = localStorage.getItem("usuarioLogado");
  if (usuarioSalvo) {
    mostrarUsuario(JSON.parse(usuarioSalvo));
  } else {
    esconderUsuario();
  }

  if (loginButton) {
    // Validar credenciais ao clicar no botão "Entrar" no modal
    loginButton.addEventListener("click", async () => {
      const email = loginForm.email.value.trim();
      const password = loginForm.password.value.trim();

      // Se não preencheu, não faz nada (nem mostra erro, nem borda)
      if (!email || !password) {
        loginError.classList.add('d-none');
        // Remova as linhas abaixo se existirem:
        // loginForm.email.classList.add("is-invalid");
        // loginForm.password.classList.add("is-invalid");
        return;
      }

      // Chamada real à API de login
      const response = await fetch("/api/account/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const user = await response.json();
        localStorage.setItem("usuarioLogado", JSON.stringify(user));
        mostrarUsuario(user);
        var modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
        modal.hide();
        loginError.classList.add('d-none');
        // Remova as linhas abaixo se existirem:
        // loginForm.email.classList.remove("is-invalid");
        // loginForm.password.classList.remove("is-invalid");
      } else {
        loginError.textContent = "Usuário ou senha incorreto";
        loginError.classList.remove('d-none');
        // Remova as linhas abaixo se existirem:
        // loginForm.email.classList.add("is-invalid");
        // loginForm.password.classList.add("is-invalid");
      }
    });
  }

  if (loginSubmit) {
    loginSubmit.addEventListener("click", async () => {
      const email = loginForm.email.value.trim();
      const password = loginForm.password.value.trim();

      if (!email || !password) {
        loginError.classList.add('d-none');
        return;
      }

      const response = await fetch("/api/account/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const user = await response.json();
        localStorage.setItem("usuarioLogado", JSON.stringify(user));
        mostrarUsuario(user);
        var modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
        modal.hide();
        loginError.classList.add('d-none');
      } else {
        loginError.textContent = "Usuário ou senha incorreto";
        loginError.classList.remove('d-none');
      }
    });
  }

  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      localStorage.removeItem("usuarioLogado");
      esconderUsuario();
    });
  }

  const publicacoesContainer = document.querySelector('.publicacoes .p-3');
  if (!publicacoesContainer) return;

  // Busca as publicações do backend
  const resp = await fetch('/api/publicacao');
  if (!resp.ok) return;
  const publicacoes = await resp.json();

  publicacoesContainer.innerHTML = ""; // Limpa o conteúdo

  publicacoes.forEach(pub => {
    publicacoesContainer.innerHTML += `
      <div class="card publicacao-card mb-2" style="width: 320px; min-height: 220px; margin: 0 auto; border: 1.5px solid #C2BEBE;">
        <img src="${pub.foto}" class="card-img-top" alt="${pub.nome_prato}" style="height: 180px; object-fit: cover;">
        <div class="card-body p-2">
          <h6 class="card-title mb-1" style="font-size: 1rem;">${pub.nome_prato}</h6>
          <div class="d-flex justify-content-between small">
            <span style="font-size: 0.9rem;">${pub.local}</span>
            <span style="font-size: 0.9rem;">${pub.cidade_estado}</span>
          </div>
          <div class="d-flex justify-content-between mt-2">
            <div>
              <button id="like-btn-${pub.id}" class="btn p-0 border-0 bg-transparent like-btn">
                <i class="bi bi-hand-thumbs-up"></i> <span class="like-count">0</span>
              </button>
              <button id="dislike-btn-${pub.id}" class="btn p-0 border-0 bg-transparent dislike-btn ms-2">
                <i class="bi bi-hand-thumbs-down"></i> <span class="dislike-count">0</span>
              </button>
            </div>
            <span style="font-size: 0.95rem;">
              <i class="bi bi-chat-dots"></i> 0
            </span>
          </div>
        </div>
      </div>
    `;
  });

  // Aqui você pode chamar sua função para ativar os eventos de like/dislike nos botões criados

  for (let i = 1; i <= 3; i++) {
    const likeBtn = document.getElementById(`like-btn-${i}`);
    const dislikeBtn = document.getElementById(`dislike-btn-${i}`);

    if (likeBtn && dislikeBtn) {
      const likeCountSpan = likeBtn.querySelector('.like-count');
      const dislikeCountSpan = dislikeBtn.querySelector('.dislike-count');

      likeBtn.addEventListener("click", async function () {
        const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
        if (!usuario || !usuario.id) return;
        const idPublicacao = i;

        await fetch("/api/curtidas/like", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idUsuario: usuario.id, idPublicacao }),
        });

        await atualizarEstadoCurtidas(idPublicacao, likeBtn, dislikeBtn, likeCountSpan, dislikeCountSpan, usuario.id);
        await atualizarLikesDislikesPerfil(usuario.id);
      });

      dislikeBtn.addEventListener("click", async function () {
        const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
        if (!usuario || !usuario.id) return;
        const idPublicacao = i;

        await fetch("/api/curtidas/deslike", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idUsuario: usuario.id, idPublicacao }),
        });

        await atualizarEstadoCurtidas(idPublicacao, likeBtn, dislikeBtn, likeCountSpan, dislikeCountSpan, usuario.id);
        await atualizarLikesDislikesPerfil(usuario.id);
      });
    }
  }

  // Atualiza o estado visual dos botões e as contagens do card
  async function atualizarEstadoCurtidas(idPublicacao, likeBtn, dislikeBtn, likeCountSpan, dislikeCountSpan, idUsuario) {
    // Busca contagem atualizada do card
    const resp = await fetch(`/api/curtidas/contagem/${idPublicacao}`);
    if (resp.ok) {
      const data = await resp.json();
      likeCountSpan.textContent = data.likes;
      dislikeCountSpan.textContent = data.dislikes;
    }

    // Marca visualmente o botão correto
    const respMinhas = await fetch(`/api/curtidas/minhas-curtidas/${idUsuario}`);
    if (respMinhas.ok) {
      const idsCurtidas = await respMinhas.json();
      if (idsCurtidas.includes(idPublicacao)) {
        likeBtn.classList.add("liked");
        dislikeBtn.classList.remove("liked");
      } else {
        const respDeslikes = await fetch(`/api/curtidas/minhas-descurtidas/${idUsuario}`);
        if (respDeslikes.ok) {
          const idsDescurtidas = await respDeslikes.json();
          if (idsDescurtidas.includes(idPublicacao)) {
            dislikeBtn.classList.add("liked");
            likeBtn.classList.remove("liked");
          } else {
            likeBtn.classList.remove("liked");
            dislikeBtn.classList.remove("liked");
          }
        }
      }
    }
  }

  // Atualiza total de likes e dislikes do perfil
  async function atualizarLikesDislikesPerfil(idUsuario) {
    // Likes
    const respLikes = await fetch(`/api/curtidas/total-likes/${idUsuario}`);
    if (respLikes.ok) {
      const data = await respLikes.json();
      document.querySelector('.perfil .likes .col-6:nth-child(1) span').textContent = data.total;
    }
    // Dislikes
    const respDislikes = await fetch(`/api/curtidas/total-dislikes/${idUsuario}`);
    if (respDislikes.ok) {
      const data = await respDislikes.json();
      document.querySelector('.perfil .likes .col-6:nth-child(2) span').textContent = data.total;
    }
  }

  // Ao carregar a página/logar, chame:
  const usuario = JSON.parse(localStorage.getItem("usuarioLogado") || "null");
  if (usuario && usuario.id) {
    atualizarLikesDislikesPerfil(usuario.id);
    for (let i = 1; i <= 3; i++) {
      const likeBtn = document.getElementById(`like-btn-${i}`);
      const dislikeBtn = document.getElementById(`dislike-btn-${i}`);
      const likeCountSpan = likeBtn?.querySelector('.like-count');
      const dislikeCountSpan = dislikeBtn?.querySelector('.dislike-count');
      if (likeBtn && dislikeBtn && likeCountSpan && dislikeCountSpan) {
        atualizarEstadoCurtidas(i, likeBtn, dislikeBtn, likeCountSpan, dislikeCountSpan, usuario.id);
      }
    }
  }

  document.querySelectorAll('.comentario-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const idPub = this.getAttribute('data-id');
      const comentariosContainer = document.getElementById('comentarios-container');
      const publicacoesDiv = document.querySelector('.publicacoes .p-3');

      // Se já está aberto para esse id, fecha e mostra todas as publicações
      if (comentariosContainer.dataset.open == idPub) {
        comentariosContainer.classList.add('d-none');
        comentariosContainer.innerHTML = '';
        publicacoesDiv.classList.remove('d-none');
        comentariosContainer.dataset.open = '';
        return;
      }

      // Esconde as publicações
      publicacoesDiv.classList.add('d-none');
      comentariosContainer.classList.remove('d-none');
      comentariosContainer.dataset.open = idPub;

      // Busca comentários do backend
      const resp =  fetch(`/api/comentarios/${idPub}`);
      const comentarios = resp.ok ? await resp.json() : [];

      // Monta o HTML dos comentários
      let html = `
        <div class="card mb-2" style="width: 100%; border: 1.5px solid #C2BEBE;">
          <div class="card-body">
            <h6 class="mb-3">Comentários</h6>
            <div id="lista-comentarios">
              ${comentarios.map(c => `
                <div class="mb-2">
                  <img src="${c.foto_perfil}" alt="perfil" style="width:32px;height:32px;border-radius:50%;margin-right:8px;">
                  <strong>${c.nome_usuario}</strong>: ${c.descricao}
                </div>
              `).join('')}
            </div>
            <div class="mt-3">
              <textarea id="novoComentario" class="form-control mb-2" rows="2" placeholder="Escreva seu comentário..."></textarea>
              <button id="btnComentar" class="btn btn-warning text-white">Comentar</button>
              <button id="btnVoltar" class="btn btn-outline-secondary ms-2">Voltar</button>
            </div>
          </div>
        </div>
      `;
      comentariosContainer.innerHTML = html;

      // Evento de comentar
      document.getElementById('btnComentar').onclick = async () => {
        const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
        const texto = document.getElementById('novoComentario').value.trim();
        if (!usuario || !texto) return;
        await fetch('/api/comentarios', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            idUsuario: usuario.id,
            idPublicacao: idPub,
            descricao: texto
          })
        });
        // Recarrega comentários
        btn.click();
      };

      // Evento de voltar
      document.getElementById('btnVoltar').onclick = () => {
        comentariosContainer.classList.add('d-none');
        comentariosContainer.innerHTML = '';
        publicacoesDiv.classList.remove('d-none');
        comentariosContainer.dataset.open = '';
      };
    });
  });
});