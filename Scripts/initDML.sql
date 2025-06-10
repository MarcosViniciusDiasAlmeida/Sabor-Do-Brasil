USE init;


INSERT INTO `init`.`usuario` (`id`, `nome`, `email`, `nickname`, `senha`, `foto`, `createdAt`, `updatedAt`) VALUES
(1, 'usuario01', 'usuario01@usuario.com', 'usuario_01', '123456', 'imagens/foto_usuario/usuario_01.jpg', '2023-06-22 09:13:55', '2023-06-22 09:14:55'),
(2, 'usuario02', 'usuario02@usuario.com', 'usuario_02', '654321', 'imagens/foto_usuario/usuario_02.jpg', '2023-02-22 09:13:55', '2023-02-22 09:13:58'),
(3, 'usuario03', 'usuario03@usuario.com', 'usuario_03', '987654', 'imagens/foto_usuario/usuario_03.jpg', '2023-08-22 09:13:55', '2023-08-22 09:15:55');


INSERT INTO `init`.`empresa` (`id`, `nome`, `logo`, `createdAt`, `updatedAt`) VALUES
(1, 'Sabor do Brasil', 'logo_sabor_do_brasil.png', '2023-11-23 10:49:17', '2021-02-22 09:13:55');

INSERT INTO `init`.`publicacao` (`id`, `foto`, `titulo_prato`, `local`, `cidade`, `empresa_id`, `id_usuarioss`, `createdAt`, `updatedAt`) VALUES
(1, 'publicacao01.png', 'Titulo do Prato 01', 'Local 01', 'Maceio-AL', 1, 1, '2023-02-22 09:15:55', '2023-09-22 09:18:55'),
(2, 'publicacao02.png', 'Titulo do Prato 02', 'Local 02', 'Minas Gerais-MG', 1, 2, '2023-02-22 09:10:55', '2023-02-22 09:16:55'),
(3, 'publicacao03.png', 'Titulo do Prato 03', 'Local 03', 'Rio de Janerio-RJ', 1, 1, '2023-05-22 09:13:55', '2023-02-22 09:15:55');

