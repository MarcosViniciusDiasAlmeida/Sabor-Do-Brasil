using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using System.Collections.Generic;

[ApiController]
[Route("api/[controller]")]
public class PublicacaoController : ControllerBase
{
    private readonly IConfiguration _config;
    public PublicacaoController(IConfiguration config) { _config = config; }

    [HttpGet]
    public IActionResult Get()
    {
        var lista = new List<object>();
        using (var conn = new MySqlConnection(_config.GetConnectionString("DefaultConnection")))
        {
            conn.Open();
            var cmd = conn.CreateCommand();
            cmd.CommandText = @"
  SELECT p.id, p.nome_prato, p.foto, p.local, p.`cidade-estado`, p.id_usuario, u.nome AS nome_usuario
  FROM publicacao p
  JOIN usuario u ON u.id = p.id_usuario
";
            using (var reader = cmd.ExecuteReader())
            {
                while (reader.Read())
                {
                    lista.Add(new {
                        id = reader["id"],
                        nome_prato = reader["nome_prato"],
                        foto = reader["foto"],
                        local = reader["local"],
                        cidade_estado = reader["cidade-estado"],
                        id_usuario = reader["id_usuario"],
                        nome_usuario = reader["nome_usuario"]
                    });
                }
            }
        }
        return Ok(lista);
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] NovaPublicacaoModel model)
    {
        using var conn = new MySqlConnection(_config.GetConnectionString("DefaultConnection"));
        await conn.OpenAsync();
        var cmd = conn.CreateCommand();
        cmd.CommandText = "INSERT INTO publicacao (id_empresa, id_usuario, nome_prato, foto, local, `cidade-estado`) VALUES (@id_empresa, @id_usuario, @nome_prato, @foto, @local, @cidade_estado)";
        cmd.Parameters.AddWithValue("@id_empresa", 1); // Supondo empresa fixa
        cmd.Parameters.AddWithValue("@id_usuario", model.IdUsuario);
        cmd.Parameters.AddWithValue("@nome_prato", model.NomePrato);
        cmd.Parameters.AddWithValue("@foto", model.Foto);
        cmd.Parameters.AddWithValue("@local", model.Local);
        cmd.Parameters.AddWithValue("@cidade_estado", model.CidadeEstado);
        await cmd.ExecuteNonQueryAsync();
        var id = cmd.LastInsertedId;
        return Ok(new { id, model.NomePrato, model.Foto, model.Local, model.CidadeEstado });
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(long id, [FromQuery] long idUsuario)
    {
        using var conn = new MySqlConnection(_config.GetConnectionString("DefaultConnection"));
        conn.Open();
        // Verifica se a publicação pertence ao usuário
        var checkCmd = conn.CreateCommand();
        checkCmd.CommandText = "SELECT COUNT(*) FROM publicacao WHERE id = @id AND id_usuario = @idUsuario";
        checkCmd.Parameters.AddWithValue("@id", id);
        checkCmd.Parameters.AddWithValue("@idUsuario", idUsuario);
        var count = Convert.ToInt32(checkCmd.ExecuteScalar());
        if (count == 0)
            return Forbid();
        // Exclui a publicação
        var delCmd = conn.CreateCommand();
        delCmd.CommandText = "DELETE FROM publicacao WHERE id = @id";
        delCmd.Parameters.AddWithValue("@id", id);
        delCmd.ExecuteNonQuery();
        return NoContent();
    }
}

public class NovaPublicacaoModel
{
    public long IdUsuario { get; set; }
    public string NomePrato { get; set; } = string.Empty;
    public string Foto { get; set; } = string.Empty;
    public string Local { get; set; } = string.Empty;
    public string CidadeEstado { get; set; } = string.Empty;
}