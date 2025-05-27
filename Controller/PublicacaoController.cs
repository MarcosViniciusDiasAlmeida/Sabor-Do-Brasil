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
}