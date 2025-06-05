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
                id = reader["id"],
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

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterModel model)
    {
        using var conn = new MySqlConnection(_config.GetConnectionString("DefaultConnection"));
        await conn.OpenAsync();

        // Verifica se já existe usuário com o mesmo email
        var checkCmd = conn.CreateCommand();
        checkCmd.CommandText = "SELECT COUNT(*) FROM usuario WHERE email = @email";
        checkCmd.Parameters.AddWithValue("@email", model.Email);
        var existsObj = await checkCmd.ExecuteScalarAsync();
        var exists = (existsObj != null && existsObj != DBNull.Value) ? Convert.ToInt64(existsObj) : 0;
        if (exists > 0)
        {
            return Conflict(new { message = "E-mail já cadastrado." });
        }

        var cmd = conn.CreateCommand();
        cmd.CommandText = "INSERT INTO usuario (nome, email, senha, foto) VALUES (@nome, @email, @senha, @foto)";
        cmd.Parameters.AddWithValue("@nome", model.Nome);
        cmd.Parameters.AddWithValue("@email", model.Email);
        cmd.Parameters.AddWithValue("@senha", model.Senha);
        cmd.Parameters.AddWithValue("@foto", model.Foto);
        await cmd.ExecuteNonQueryAsync();

        // Retorna o usuário cadastrado
        var id = cmd.LastInsertedId;
        return Ok(new { id, nome = model.Nome, foto = model.Foto });
    }
}

public class LoginModel
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class RegisterModel
{
    public string Nome { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Senha { get; set; } = string.Empty;
    public string Foto { get; set; } = string.Empty;
}