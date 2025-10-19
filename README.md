# 🛍️ Product Pit Stop

> *"O preguiçoso deseja e nada consegue, mas os desejos do diligente são amplamente satisfeitos" (Provérbios 13:4)*

**Plataforma de Video Commerce** - Uma rede social que mistura vídeos curtos (reels) com marketplace, permitindo aos usuários descobrir, interagir e comprar produtos através de vídeos.

[![Deploy Status](https://img.shields.io/badge/deploy-active-success)](https://github.com/Thurzix/Product-Pit-Stop)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org)

---

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Começando](#começando)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Deploy](#deploy)
- [Contribuindo](#contribuindo)
- [Licença](#licença)

---

## 🎯 Sobre o Projeto

**Product Pit Stop** é uma plataforma inovadora de video commerce que combina:
- 📱 Feed de vídeos curtos (estilo TikTok/Reels)
- 🛒 Marketplace integrado
- 💬 Sistema de mensagens entre usuários
- 👥 Perfis de vendedores e compradores
- ⭐ Sistema de avaliações e comentários

**Público-alvo:** Vendedores que desejam promover produtos através de vídeos e compradores que preferem descobrir produtos de forma visual e interativa.

---

## ✨ Funcionalidades

### 👤 **Usuários**
- ✅ Cadastro e autenticação com JWT
- ✅ Perfil customizável
- ✅ Sistema de follow/unfollow
- ✅ Histórico de compras
- ✅ Lista de favoritos

### 🎥 **Feed de Vídeos**
- ✅ Scroll infinito de produtos
- ✅ Vídeos curtos de demonstração
- ✅ Curtidas, comentários e compartilhamentos
- ✅ Filtros por categoria
- ✅ Busca avançada

### 🛒 **Marketplace**
- ✅ Carrinho de compras funcional
- ✅ Sistema de checkout
- ✅ Cálculo automático de totais
- ✅ Gerenciamento de estoque
- ✅ Histórico de pedidos

### 💬 **Mensagens**
- ✅ Chat direto entre usuários
- ✅ Conversas organizadas
- ✅ Notificações de mensagens
- ✅ Histórico de conversas

### 👨‍💼 **Vendedores**
- ✅ Dashboard de vendas
- ✅ Upload de produtos com vídeos
- ✅ Gerenciamento de estoque
- ✅ Estatísticas de visualizações
- ✅ Análise de engajamento

---

## 🚀 Tecnologias

### **Backend**
- **Node.js** 18+ - Runtime JavaScript
- **Express.js** - Framework web
- **MySQL** - Banco de dados relacional
- **JWT** - Autenticação
- **Bcrypt** - Hash de senhas
- **Helmet** - Segurança
- **CORS** - Cross-Origin Resource Sharing
- **Joi** - Validação de dados

### **Frontend**
- **React** 18+ - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool
- **TailwindCSS** - Framework CSS
- **Framer Motion** - Animações
- **Axios** - HTTP client
- **React Router** - Roteamento

### **DevOps & Deploy**
- **Vercel** - Deploy do frontend
- **Railway** - Backend e banco de dados
- **GitHub Actions** - CI/CD
- **Git Flow** - Gestão de branches

### **Ferramentas**
- **Cloudinary** - Upload de vídeos/imagens
- **Postman** - Testes de API
- **VS Code** - IDE

---

## 🏁 Começando

### **Pré-requisitos**
- Node.js 18 ou superior
- MySQL 8.0 ou superior
- Git
- NPM ou Yarn

### **1. Clone o repositório**
```bash
git clone https://github.com/Thurzix/Product-Pit-Stop.git
cd Product-Pit-Stop
```

### **2. Configure o Backend**
```bash
cd backend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite .env com suas credenciais

# Executar schema do banco
mysql -u root -p < config/schema.sql

# Iniciar servidor
npm start
```

O backend estará rodando em: `http://localhost:3001`

### **3. Configure o Frontend**
```bash
cd project

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite .env com a URL da API

# Iniciar desenvolvimento
npm run dev
```

O frontend estará rodando em: `http://localhost:5173`

### **4. Acessar a aplicação**
Abra seu navegador em `http://localhost:5173`

**Credenciais de teste:**
- Email: `demo@pitstop.com`
- Senha: `123456`

---

## 📁 Estrutura do Projeto

```
Product-Pit-Stop/
├── backend/                    # Backend Node.js + Express
│   ├── config/                # Configurações (DB, etc)
│   │   ├── database.js       # Conexão MySQL
│   │   └── schema.sql        # Schema do banco
│   ├── models/               # Models do banco
│   │   ├── User.js
│   │   └── Product.js
│   ├── routes/               # Rotas da API
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── cartRoutes.js
│   │   └── messageRoutes.js
│   ├── services/             # Serviços externos
│   │   └── uploadService.js  # Cloudinary
│   ├── middleware/           # Middlewares
│   ├── .env                  # Variáveis de ambiente
│   ├── server-new.js         # Servidor principal
│   └── package.json
│
├── project/                   # Frontend React + TypeScript
│   ├── src/
│   │   ├── components/       # Componentes React
│   │   │   ├── VideoFeed.tsx
│   │   │   ├── CartPage.tsx
│   │   │   ├── Header.tsx
│   │   │   └── ...
│   │   ├── contexts/         # Context API
│   │   │   └── AuthContext.tsx
│   │   ├── services/         # Serviços
│   │   │   └── api.ts        # Cliente HTTP
│   │   ├── types/            # TypeScript types
│   │   ├── App.tsx           # App principal
│   │   └── main.tsx          # Entry point
│   ├── public/               # Assets estáticos
│   ├── .env                  # Variáveis de ambiente
│   ├── vite.config.ts        # Config Vite
│   ├── tailwind.config.js    # Config Tailwind
│   └── package.json
│
├── .github/                   # GitHub configs
│   ├── workflows/            # GitHub Actions
│   │   ├── ci.yml           # CI Pipeline
│   │   └── deploy.yml       # Deploy automático
│   └── PULL_REQUEST_TEMPLATE.md
│
├── docs/                      # Documentação
│   └── CONFIGURAR_PROTECAO_BRANCH.md
│
├── .gitignore
├── CONTRIBUTING.md           # Guia de contribuição
├── DEPLOY.md                 # Guia de deploy
├── README.md                 # Este arquivo
└── LICENSE
```

---

## 🌐 Deploy

### **Ambientes**

| Ambiente | Branch | Frontend | Backend |
|----------|--------|----------|---------|
| **Produção** | `main` | [Vercel](https://product-pit-stop.vercel.app) | [Railway](https://api.product-pit-stop.railway.app) |
| **Staging** | `develop` | [Vercel](https://staging-product-pit-stop.vercel.app) | [Railway](https://staging-api.railway.app) |

### **Deploy Automático**
- Push em `develop` → Deploy automático no staging
- Merge em `main` → Deploy automático na produção

📖 **Guia completo:** [DEPLOY.md](DEPLOY.md)

---

## 🤝 Contribuindo

Adoramos contribuições! Siga estes passos:

1. **Fork** o projeto
2. Crie uma **branch de feature** (`git checkout -b feature/MinhaFeature`)
3. **Commit** suas mudanças (`git commit -m 'feat: adiciona MinhaFeature'`)
4. **Push** para a branch (`git push origin feature/MinhaFeature`)
5. Abra um **Pull Request**

📖 **Guia completo:** [CONTRIBUTING.md](CONTRIBUTING.md)

### **Padrões de Commit**
Usamos [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Documentação
- `style:` Formatação
- `refactor:` Refatoração
- `test:` Testes

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👨‍💻 Autor

**Arthur** ([@Thurzix](https://github.com/Thurzix))

---

## 🙏 Agradecimentos

- Equipe de desenvolvimento
- Supervisores do projeto
- Comunidade open source

---

## 📞 Suporte

- **Issues:** [GitHub Issues](https://github.com/Thurzix/Product-Pit-Stop/issues)
- **Email:** suporte@pitstop.com

---

<div align="center">

**⭐ Se este projeto te ajudou, deixe uma estrela!**

Made with ❤️ by [Thurzix](https://github.com/Thurzix)

</div>
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