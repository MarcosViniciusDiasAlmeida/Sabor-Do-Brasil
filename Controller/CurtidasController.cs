using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;

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
            // Verifica se já existe e se é 'Like'
            var cmd = conn.CreateCommand();
            cmd.CommandText = @"SELECT curtidas FROM curtidas WHERE id_usuario = @id_usuario AND id_publicacao = @id_publicacao";
            cmd.Parameters.AddWithValue("@id_usuario", req.IdUsuario);
            cmd.Parameters.AddWithValue("@id_publicacao", req.IdPublicacao);
            var result = cmd.ExecuteScalar();
            if (result != null && result.ToString() == "Like")
            {
                // Remove o like
                cmd = conn.CreateCommand();
                cmd.CommandText = @"DELETE FROM curtidas WHERE id_usuario = @id_usuario AND id_publicacao = @id_publicacao";
                cmd.Parameters.AddWithValue("@id_usuario", req.IdUsuario);
                cmd.Parameters.AddWithValue("@id_publicacao", req.IdPublicacao);
                cmd.ExecuteNonQuery();
            }
            else
            {
                // Insere ou atualiza para Like
                cmd = conn.CreateCommand();
                cmd.CommandText = @"INSERT INTO curtidas (id_usuario, id_publicacao, curtidas)
                                    VALUES (@id_usuario, @id_publicacao, 'Like')
                                    ON DUPLICATE KEY UPDATE curtidas='Like'";
                cmd.Parameters.AddWithValue("@id_usuario", req.IdUsuario);
                cmd.Parameters.AddWithValue("@id_publicacao", req.IdPublicacao);
                cmd.ExecuteNonQuery();
            }
        }
        return Ok();
    }

    [HttpPost("deslike")]
    public IActionResult Deslike([FromBody] CurtidaRequest req)
    {
        using (var conn = new MySqlConnection(_config.GetConnectionString("DefaultConnection")))
        {
            conn.Open();
            // Verifica se já existe e se é 'Deslike'
            var cmd = conn.CreateCommand();
            cmd.CommandText = @"SELECT curtidas FROM curtidas WHERE id_usuario = @id_usuario AND id_publicacao = @id_publicacao";
            cmd.Parameters.AddWithValue("@id_usuario", req.IdUsuario);
            cmd.Parameters.AddWithValue("@id_publicacao", req.IdPublicacao);
            var result = cmd.ExecuteScalar();
            if (result != null && result.ToString() == "Deslike")
            {
                // Remove o deslike
                cmd = conn.CreateCommand();
                cmd.CommandText = @"DELETE FROM curtidas WHERE id_usuario = @id_usuario AND id_publicacao = @id_publicacao";
                cmd.Parameters.AddWithValue("@id_usuario", req.IdUsuario);
                cmd.Parameters.AddWithValue("@id_publicacao", req.IdPublicacao);
                cmd.ExecuteNonQuery();
            }
            else
            {
                // Insere ou atualiza para Deslike
                cmd = conn.CreateCommand();
                cmd.CommandText = @"INSERT INTO curtidas (id_usuario, id_publicacao, curtidas)
                                    VALUES (@id_usuario, @id_publicacao, 'Deslike')
                                    ON DUPLICATE KEY UPDATE curtidas='Deslike'";
                cmd.Parameters.AddWithValue("@id_usuario", req.IdUsuario);
                cmd.Parameters.AddWithValue("@id_publicacao", req.IdPublicacao);
                cmd.ExecuteNonQuery();
            }
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

    [HttpGet("total-dislikes/{idUsuario}")]
    public IActionResult TotalDislikes(int idUsuario)
    {
        int total = 0;
        using (var conn = new MySqlConnection(_config.GetConnectionString("DefaultConnection")))
        {
            conn.Open();
            var cmd = conn.CreateCommand();
            cmd.CommandText = "SELECT COUNT(*) FROM curtidas WHERE id_usuario = @id AND curtidas = 'Deslike'";
            cmd.Parameters.AddWithValue("@id", idUsuario);
            total = Convert.ToInt32(cmd.ExecuteScalar());
        }
        return Ok(new { total });
    }

    // Retorna todas as publicações que o usuário curtiu
    [HttpGet("minhas-curtidas/{idUsuario}")]
    public IActionResult MinhasCurtidas(int idUsuario)
    {
        var ids = new List<int>();
        using (var conn = new MySqlConnection(_config.GetConnectionString("DefaultConnection")))
        {
            conn.Open();
            var cmd = conn.CreateCommand();
            cmd.CommandText = "SELECT id_publicacao FROM curtidas WHERE id_usuario = @id AND curtidas = 'Like'";
            cmd.Parameters.AddWithValue("@id", idUsuario);
            using (var reader = cmd.ExecuteReader())
            {
                while (reader.Read())
                    ids.Add(Convert.ToInt32(reader["id_publicacao"]));
            }
        }
        return Ok(ids);
    }

    // Retorna todas as publicações que o usuário descurtiu (Deslike)
    [HttpGet("minhas-descurtidas/{idUsuario}")]
    public IActionResult MinhasDescurtidas(int idUsuario)
    {
        var ids = new List<int>();
        using (var conn = new MySqlConnection(_config.GetConnectionString("DefaultConnection")))
        {
            conn.Open();
            var cmd = conn.CreateCommand();
            cmd.CommandText = "SELECT id_publicacao FROM curtidas WHERE id_usuario = @id AND curtidas = 'Deslike'";
            cmd.Parameters.AddWithValue("@id", idUsuario);
            using (var reader = cmd.ExecuteReader())
            {
                while (reader.Read())
                    ids.Add(Convert.ToInt32(reader["id_publicacao"]));
            }
        }
        return Ok(ids);
    }

    // Retorna a contagem de likes e dislikes de uma publicação
    [HttpGet("contagem/{idPublicacao}")]
    public IActionResult Contagem(int idPublicacao)
    {
        int likes = 0, dislikes = 0;
        using (var conn = new MySqlConnection(_config.GetConnectionString("DefaultConnection")))
        {
            conn.Open();
            var cmd = conn.CreateCommand();
            cmd.CommandText = @"SELECT curtidas, COUNT(*) as total FROM curtidas WHERE id_publicacao = @id GROUP BY curtidas";
            cmd.Parameters.AddWithValue("@id", idPublicacao);
            using (var reader = cmd.ExecuteReader())
            {
                while (reader.Read())
                {
                    if (reader["curtidas"].ToString() == "Like")
                        likes = Convert.ToInt32(reader["total"]);
                    else if (reader["curtidas"].ToString() == "Deslike")
                        dislikes = Convert.ToInt32(reader["total"]);
                }
            }
        }
        return Ok(new { likes, dislikes });
    }
}

public class CurtidaRequest
{
    public int IdUsuario { get; set; }
    public int IdPublicacao { get; set; }
}