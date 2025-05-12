using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MySql.Data.MySqlClient;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class AccountController : ControllerBase
{
    private readonly IConfiguration _config;

    public AccountController(IConfiguration config)
    {
        _config = config;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginModel model)
    {
        using var conn = new MySqlConnection(_config.GetConnectionString("DefaultConnection"));
        await conn.OpenAsync();

        var cmd = conn.CreateCommand();
        cmd.CommandText = "SELECT * FROM usuario WHERE email = @email AND senha = @senha";
        cmd.Parameters.AddWithValue("@email", model.Email);
        cmd.Parameters.AddWithValue("@senha", model.Password);

        using var reader = await cmd.ExecuteReaderAsync();
        if (await reader.ReadAsync())
        {
            // Login bem-sucedido
            return Ok(new {
                nome = reader["nome"].ToString(),
                foto = reader["foto"].ToString()
            });
        }
        else
        {
            // Usuário ou senha incorretos
            return Unauthorized();
        }
    }
}

public class LoginModel
{
    public string Email { get; set; }
    public string Password { get; set; }
}