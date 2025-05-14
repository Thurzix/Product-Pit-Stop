"O preguiçoso deseja e nada consegue, mas os desejos do diligente são amplamente satisfeitos" (Provérbios 13:4)
# 📦 Projeto TCC - ALR

Este projeto é uma plataforma web que mistura rede social com marketplace.  
Usuários podem ver vídeos curtos ("reels") de produtos e, se estiverem logados, podem curtir, comentar, comprar e interagir com outros usuários.

## 🚀 Tecnologias utilizadas

- Node.js
- Express
- MySQL
- mysql2
- dotenv
- (e futuramente: HTML, CSS, JavaScript no frontend)

## ⚙️ Como rodar o projeto

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/projeto-tcc-alr.git
Instale as dependências:

bash
Copiar
Editar
npm install
Configure seu arquivo .env:

env
Copiar
Editar
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=seu_banco
Inicie o servidor:

bash
Copiar
Editar
node backend/server.js
Teste a API no Postman:

bash
Copiar
Editar
GET http://localhost:3000/usuarios