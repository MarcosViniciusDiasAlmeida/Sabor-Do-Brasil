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
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      if (response.ok) {
        window.location.href = "/usuario_logado.html"; // Redirecionar para a página SPA
      } else {
        loginError.classList.remove("d-none");
        loginForm.email.classList.add("is-invalid");
        loginForm.password.classList.add("is-invalid");
      }
    });
  });