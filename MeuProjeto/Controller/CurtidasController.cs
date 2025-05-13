using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MySql.Data.MySqlClient;
using System;

[ApiController]
[Route("api/[controller]")]
public class CurtidasController : ControllerBase
{
    private readonly IConfiguration _config;
    public CurtidasController(IConfiguration config) { _config = config; }

    [HttpPost("like")]
    public IActionResult Like([FromBody] CurtidaRequest req)
    {
        using (var conn = new MySqlConnection(_config.GetConnectionString("DefaultConnection")))
        {
            conn.Open();
            // Insere ou atualiza a curtida
            var cmd = conn.CreateCommand();
            cmd.CommandText = @"INSERT INTO curtidas (id_usuario, id_publicacao, curtidas)
                                VALUES (@id_usuario, @id_publicacao, 'Like')
                                ON DUPLICATE KEY UPDATE curtidas='Like'";
            cmd.Parameters.AddWithValue("@id_usuario", req.IdUsuario);
            cmd.Parameters.AddWithValue("@id_publicacao", req.IdPublicacao);
            cmd.ExecuteNonQuery();
        }
        return Ok();
    }

    [HttpGet("total-likes/{idUsuario}")]
    public IActionResult TotalLikes(int idUsuario)
    {
        int total = 0;
        using (var conn = new MySqlConnection(_config.GetConnectionString("DefaultConnection")))
        {
            conn.Open();
            var cmd = conn.CreateCommand();
            cmd.CommandText = "SELECT COUNT(*) FROM curtidas WHERE id_usuario = @id AND curtidas = 'Like'";
            cmd.Parameters.AddWithValue("@id", idUsuario);
            total = Convert.ToInt32(cmd.ExecuteScalar());
        }
        return Ok(new { total });
    }
}

public class CurtidaRequest
{
    public int IdUsuario { get; set; }
    public int IdPublicacao { get; set; }
}