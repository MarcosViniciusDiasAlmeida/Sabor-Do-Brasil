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
            cmd.CommandText = "SELECT id, titulo_prato, foto, local, cidade, estado, empresa_id, id_usuarioss, createdAt, updatedAt FROM publicacao";
            using (var reader = cmd.ExecuteReader())
            {
                while (reader.Read())
                {
                    lista.Add(new
                    {
                        id = reader["id"],
                        titulo_prato = reader["titulo_prato"],
                        foto = reader["foto"],
                        local = reader["local"],
                        cidade = reader["cidade"],
                        estado = reader["estado"],
                        empresa_id = reader["empresa_id"],
                        id_usuarioss = reader["id_usuarioss"],
                        createdAt = reader["createdAt"],
                        updatedAt = reader["updatedAt"]
                    });
                }
            }
        }
        return Ok(lista);
    }
}