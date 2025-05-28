# Sabor do Brasil

Sabor do Brasil é uma atividade desenvolvida como parte de uma avaliação do SAEP (Sistema de Avaliação da Educação Profissional). O objetivo do projeto é proporcionar uma experiência prática e educativa, permitindo que os alunos apliquem seus conhecimentos e habilidades em um contexto profissional. A atividade busca avaliar competências essenciais, como criatividade, habilidade técnica e capacidade de pesquisa, além de estimular o desenvolvimento de soluções inovadoras e eficientes.

## Funcionalidades Principais

- **Login de Usuários:**  
  O acesso é feito apenas por login. Não há cadastro de novos usuários.  
  **Usuário de teste:**  
  - **E-mail:** ana@example.com  
  - **Senha:** senha123
  Ou 
  - **E-mail:** carlos@example.com
  - **Senha:** 123456


- **Perfil do Usuário:**  
  Exibe o nome, foto e a quantidade de likes/dislikes recebidos pelo usuário ou pela empresa, dependendo do estado de login.

- **Publicações de Pratos:**  
  Lista de pratos típicos brasileiros, cada um com imagem, nome, localidade e cidade/estado.

- **Likes e Dislikes:**  
  Usuários logados podem curtir ou descurtir publicações. O sistema atualiza dinamicamente os contadores de cada publicação e do perfil.

- **Comentários:**  
  Usuários podem comentar nas publicações, editar ou excluir seus próprios comentários. A contagem de comentários é atualizada em tempo real.

- **Login Modal:**  
  Modal de login com validação de campos e feedback visual para erros de autenticação.

- **Logout:**  
  Ao sair, o perfil volta a exibir os dados da empresa e os contadores são zerados para o usuário.

- **Visualização da Empresa:**  
  Quando não há usuário logado, o perfil exibe informações e estatísticas da empresa Sabor do Brasil.

- **Atualização Dinâmica:**  
  Os dados de likes, dislikes e comentários são atualizados automaticamente sem recarregar a página.

## Tecnologias Utilizadas

- **Front-end:** HTML5, CSS3, Bootstrap, JavaScript
- **Back-end:** ASP.NET Core
- **Banco de Dados:** MySQL
- **Outros:** Entity Framework, API RESTful

## Como Usar

1. **Execute o banco de dados:**  
   Rode o script SQL que está na pasta `script` do projeto para criar e popular o banco de dados.

2. **Acesse a plataforma:**  
   Abra o site no navegador.

3. **Login:**  
   Clique em "Entrar" e utilize o usuário de teste informado acima.

4. **Interaja com as publicações:**  
   Curta, descurta e comente nos pratos apresentados.

5. **Gerencie seu perfil:**  
   Veja sua foto, nome e estatísticas de interação.

## Estrutura do Projeto

- `/wwwroot/index.html` — Página principal da aplicação.
- `/wwwroot/js/script.js` — Lógica de interação, autenticação, likes/dislikes e comentários.
- `/Controller/AccountController.cs` — Lida com autenticação de usuários.
- `/Data/ApplicationDbContext.cs` — Contexto do banco de dados.
- `/wwwroot/imagens/` — Imagens dos pratos, usuários e logos.
- `/script/` — Scripts SQL para criação e popular o banco de dados.

## Contribuição

Sinta-se à vontade para sugerir melhorias ou correções. Basta fazer um fork do repositório, criar uma branch e enviar um pull request.

---

Sabor do Brasil — Descubra, compartilhe e celebre a culinária brasileira!

