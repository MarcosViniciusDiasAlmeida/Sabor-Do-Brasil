USE init;

-- Inserir usuários
INSERT INTO `init`.`usuario` (`nome`, `email`, `senha`, `foto`) VALUES
('Ana Souza', 'ana@example.com', 'senha123', 'imagens/foto_usuario/usuario_01.jpg'),
('Carlos Lima', 'carlos@example.com', '123456', 'imagens/foto_usuario/usuario_02.jpg');

-- Inserir empresas
INSERT INTO `init`.`empresa` (`id`, `nome`) VALUES
(1, 'Sabor do Brasil'),
(2, 'Delícias Caseiras'),
(3, 'Dona Graça');

-- Inserir publicações
INSERT INTO `init`.`publicacao` (`id`, `id_empresa`, `id_usuarioss`, `nome_prato`, `foto`, `local`, `cidade-estado`) VALUES
(1, 1, 1, 'Feijoada', 'imagens/publicacao/publicacao01.png', 'Restaurante Central', 'São Paulo-SP'),
(2, 2, 2, 'Moqueca Baiana', 'imagens/publicacao/publicacao02.png', 'Praia do Forte', 'Salvador-BA'),
(3, 3, 1, 'Baião de Dois', 'imagens/publicacao/publicacao03.png', 'Restaurante do Sertão', 'Fortaleza-CE');
