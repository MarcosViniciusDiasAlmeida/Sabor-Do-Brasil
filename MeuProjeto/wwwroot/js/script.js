document.addEventListener("DOMContentLoaded", () => {
  const loginButton = document.getElementById("loginButton");
  const loginForm = document.getElementById("loginForm");
  const loginError = document.getElementById("loginError");

  if (loginButton) {
    // Validar credenciais ao clicar no botão "Entrar" no modal
    loginButton.addEventListener("click", async () => {
      const email = loginForm.email.value;
      const password = loginForm.password.value;

      // Chamada real à API de login
      const response = await fetch("/api/account/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const user = await response.json();
        document.getElementById('userName').textContent = user.nome;
        document.getElementById('userPhoto').src = user.foto;
        // Fecha o modal
        var modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
        modal.hide();
        loginError.classList.add('d-none');
      } else {
        loginError.classList.remove('d-none');
        loginForm.email.classList.add("is-invalid");
        loginForm.password.classList.add("is-invalid");
      }
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