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
});