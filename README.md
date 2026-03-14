# System Auth

## Descrição
Projeto voltado para o processo de login e validação de usários usando a biblioteca better-auth

## Tecnologias usadas
- NextJS
- React
- TypeScript
- TailwindCss
- Better-Auth
- Prisma
- PostgreSQL
- Zod
- Resend

## Funções do site
- Salvar usuários no banco de dados PostgreSQL
- Validar e-mail e senha inseridos
- Garantir que o campo de e-mail e senha estão no padrão correto
- Certificar que os campos obrigatorios estão prenchidos antes de enviar os dados
- Validar se o email no login já está cadastrado 
- Limite de tentatias de logar
- Proteguer tela de perfil de usuário não cadastrados
- Função de redefinir senha
- Enviar email automatico com o link para redefinir a senha
- Login com redes sociais
- Função de deslogar do site

## Processo
Esse projeto nasceu da recente utilização que eu tive com a biblioteca better-auth. A idea era pode fazer um sistema de login a autenticação para que eu pudesse usa-lo em projetos futuros que querem esse tipo de sistema. 

Pelo fato do foco desse projeto ser na utilização da better-auth para autenticação eu fiz um desing de telas mais simples, focando mais no backend da aplicação. A utilização do prisma e do PostgreSQL se deram pelo fato do better-auth funcionar bem com essas duas tecnologia que estive estudando, além de ser uma recomendação da propria documentação

Durante o desenvolvimento, eu busquei aplicar quase todas as funcionalidades descritas na documentação, como: Rate Limit, recuperação de senha, enviar link para o email salvo no banco de dados para resetar a senha e poder fazer login com redes sociais. Para enviar o link pelo email, eu usei o Resend, pois ele permite cadastra um email e salvar o emails enviados pela funcionalidade forgot-password. Para o login com redes sociais eu escolhi o Google e o Github, pois ambos são muito usados em login de outras aplicações.

## Telas do site
<div align="center">
  <img src="https://github.com/miguelAngeloSantana/System-Auth/blob/main/screenshots/TelaLogin.png" />
  <img src="https://github.com/miguelAngeloSantana/System-Auth/blob/main/screenshots/TelaRegistro.png" />
  <img src="https://github.com/miguelAngeloSantana/System-Auth/blob/main/screenshots/TelaEsqueceuSenha.png" />
  <img src="https://github.com/miguelAngeloSantana/System-Auth/blob/main/screenshots/TelaResetarSenha.png" />
  <img src="https://github.com/miguelAngeloSantana/System-Auth/blob/main/screenshots/TelaPerfil.png" />
</div>