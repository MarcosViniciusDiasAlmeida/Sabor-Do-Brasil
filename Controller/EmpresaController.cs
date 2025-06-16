using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;

[ApiController]
[Route("api/empresa")]
public class EmpresaController : ControllerBase
{
    private readonly IConfiguration _config;
    public EmpresaController(IConfiguration config) { _config = config; }

    [HttpGet("{id}")]
    public IActionResult Get(int id)
    {
        using (var conn = new MySqlConnection(_config.GetConnectionString("DefaultConnection")))
        {
            conn.Open();
            var cmd = conn.CreateCommand();
            cmd.CommandText = @"SELECT id, nome, logo, curtidas, deslikes FROM empresa_com_interacoes WHERE id = @id";
            cmd.Parameters.AddWithValue("@id", id);
            using (var reader = cmd.ExecuteReader())
            {
                if (reader.Read())
                {
                    return Ok(new
                    {
                        id = reader["id"],
                        nome = reader["nome"],
                        logo = reader["logo"],
                        curtidas = reader["curtidas"],
                        deslikes = reader["deslikes"]
                    });
                }
            }
        }
        return NotFound();
    }
}
