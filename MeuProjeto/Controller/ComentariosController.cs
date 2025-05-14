using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;

[ApiController]
[Route("api/[controller]")]
public class ComentariosController : ControllerBase
{
    private readonly IConfiguration _config;
    public ComentariosController(IConfiguration config) { _config = config; }

    [HttpGet("{idPublicacao}")]
    public IActionResult Get(int idPublicacao)
    {
        var lista = new List<object>();
        using (var conn = new MySqlConnection(_config.GetConnectionString("DefaultConnection")))
        {
            conn.Open();
            var cmd = conn.CreateCommand();
            cmd.CommandText = @"SELECT c.descricao, c.foto_perfil, u.nome AS nome_usuario
                                FROM comentarios c
                                JOIN usuario u ON u.id = c.id_usuarios
                                WHERE c.id_publicacao = @id
                                ORDER BY c.data_comentario ASC";
            cmd.Parameters.AddWithValue("@id", idPublicacao);
            using (var reader = cmd.ExecuteReader())
            {
                while (reader.Read())
                {
                    lista.Add(new {
                        descricao = reader["descricao"],
                        foto_perfil = reader["foto_perfil"],
                        nome_usuario = reader["nome_usuario"]
                    });
                }
            }
        }
        return Ok(lista);
    }

    [HttpPost]
    public IActionResult Post([FromBody] NovoComentario req)
    {
        using (var conn = new MySqlConnection(_config.GetConnectionString("DefaultConnection")))
        {
            conn.Open();
            var cmd = conn.CreateCommand();
            cmd.CommandText = @"INSERT INTO comentarios (id_usuarios, id_publicacao, foto_perfil, descricao)
                                VALUES (@id_usuario, @id_publicacao, @foto, @descricao)";
            cmd.Parameters.AddWithValue("@id_usuario", req.idUsuario);
            cmd.Parameters.AddWithValue("@id_publicacao", req.idPublicacao);
            cmd.Parameters.AddWithValue("@foto", req.fotoPerfil ?? "imagens/logo/logo_sabor_do_brasil.png");
            cmd.Parameters.AddWithValue("@descricao", req.descricao);
            cmd.ExecuteNonQuery();
        }
        return Ok();
    }
}

public class NovoComentario
{
    public int idUsuario { get; set; }
    public int idPublicacao { get; set; }
    public string descricao { get; set; }
    public string fotoPerfil { get; set; }
}