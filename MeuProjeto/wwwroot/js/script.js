document.addEventListener("DOMContentLoaded", () => {
  const loginButton = document.getElementById("loginButton");
  const loginForm = document.getElementById("loginForm");
  const loginError = document.getElementById("loginError");

  // Exibir modal ao clicar no botão "Entrar"
  document.querySelector(".btn-warning").addEventListener("click", () => {
    const loginModal = new bootstrap.Modal(document.getElementById("loginModal"));
    loginModal.show();
  });

  // Validar credenciais ao clicar no botão "Entrar" no modal
  loginButton.addEventListener("click", async () => {
    const email = loginForm.email.value;
    const password = loginForm.password.value;

    // Simulação de validação no banco de dados
    // const response = await fetch("/api/login", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ email, password }),
    // });

    document.getElementById('loginButton').addEventListener('click', async function () {
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      const response = await fetch('/api/account/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        // Login bem-sucedido
        window.location.reload();
      } else {
        // Exibe mensagem de erro
        document.getElementById('loginError').classList.remove('d-none');
      }
    });

    if (response.ok) {
      window.location.href = "/usuario_logado.html"; // Redirecionar para a página SPA
    } else {
      loginError.classList.remove("d-none");
      loginForm.email.classList.add("is-invalid");
      loginForm.password.classList.add("is-invalid");
    }
  });

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
