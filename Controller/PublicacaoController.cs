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
            cmd.CommandText = "SELECT id, nome_prato, foto, local, `cidade-estado` FROM publicacao";
            using (var reader = cmd.ExecuteReader())
            {
                while (reader.Read())
                {
                    lista.Add(new {
                        id = reader["id"],
                        nome_prato = reader["nome_prato"],
                        foto = reader["foto"],
                        local = reader["local"],
                        cidade_estado = reader["cidade-estado"]
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
}

public class NovaPublicacaoModel
{
    public long IdUsuario { get; set; }
    public string NomePrato { get; set; } = string.Empty;
    public string Foto { get; set; } = string.Empty;
    public string Local { get; set; } = string.Empty;
    public string CidadeEstado { get; set; } = string.Empty;
}