USE init;

-- Inserir usuários
INSERT INTO `init`.`usuario` (`nome`, `email`, `senha`, `foto`) VALUES
('Ana Souza', 'ana@example.com', 'senha123', 'imagens/foto_usuario/usuario_01.jpg'),
('Carlos Lima', 'carlos@example.com', '123456', 'imagens/foto_usuario/usuario_02.jpg');

-- Inserir empresas
INSERT INTO `init`.`empresa` (`id`, `nome`) VALUES
(1, 'Sabor do Brasil'),
(2, 'Delícias Caseiras');

-- Inserir publicações
INSERT INTO `init`.`publicacao` (`id`, `id_empresa`, `id_usuarioss`, `nome_prato`, `foto`, `local`, `cidade-estado`) VALUES
(1, 1, 1, 'Feijoada', 'feijoada.jpg', 'Restaurante Central', 'São Paulo-SP'),
(2, 2, 2, 'Moqueca Baiana', 'moqueca.jpg', 'Praia do Forte', 'Salvador-BA');

-- Inserir curtida
INSERT INTO `init`.`curtidas` (`id_usuario`, `id_publicacao`, `curtidas`) VALUES
(2, 1, 'Like');

-- Inserir comentário
INSERT INTO `init`.`comentarios` (`id_usuarios`, `id_publicacaoo`, `foto_perfil`, `descricao`) VALUES
(1, 2, 'ana.jpg', 'Essa moqueca parece deliciosa!');