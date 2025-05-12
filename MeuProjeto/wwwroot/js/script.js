document.addEventListener("DOMContentLoaded", () => {
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

      likeBtn.addEventListener("click", function () {
        let likeCount = parseInt(likeCountSpan.textContent) || 0;
        let dislikeCount = parseInt(dislikeCountSpan.textContent) || 0;

        if (likeBtn.classList.contains("liked")) {
          likeBtn.classList.remove("liked");
          likeCount--;
        } else {
          likeBtn.classList.add("liked");
          likeCount++;
          if (dislikeBtn.classList.contains("liked")) {
            dislikeBtn.classList.remove("liked");
            dislikeCount--;
          }
        }
        likeCountSpan.textContent = likeCount;
        dislikeCountSpan.textContent = dislikeCount;
      });

      dislikeBtn.addEventListener("click", function () {
        let likeCount = parseInt(likeCountSpan.textContent) || 0;
        let dislikeCount = parseInt(dislikeCountSpan.textContent) || 0;

        if (dislikeBtn.classList.contains("liked")) {
          dislikeBtn.classList.remove("liked");
          dislikeCount--;
        } else {
          dislikeBtn.classList.add("liked");
          dislikeCount++;
          if (likeBtn.classList.contains("liked")) {
            likeBtn.classList.remove("liked");
            likeCount--;
          }
        }
        likeCountSpan.textContent = likeCount;
        dislikeCountSpan.textContent = dislikeCount;
      });
    }
  }
});