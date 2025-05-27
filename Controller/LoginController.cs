using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Data.SqlClient;

[ApiController]
[Route("api/[controller]")]
public class LoginController : ControllerBase
{
    [HttpPost]
    public IActionResult Post([FromBody] LoginRequest login)
    {
        // Exemplo simples, troque pelo acesso real ao banco!
        if (login.Email == "ana@example.com" && login.Senha == "senha123")
        {
            return Ok(new {
                nome = "Ana Souza",
                foto = "imagens/foto_usuario/usuario_01.jpg"
            });
        }
        return Unauthorized();
    }
}

public class LoginRequest
{
    public string Email { get; set; }
    public string Senha { get; set; }
}