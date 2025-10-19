# 🛍️ Product Pit Stop

> *"O preguiçoso deseja e nada consegue, mas os desejos do diligente são amplamente satisfeitos" (Provérbios 13:4)*

**Plataforma de Video Commerce** - Uma rede social inovadora que mistura vídeos curtos (estilo TikTok/Instagram Reels) com marketplace, permitindo aos usuários descobrir, interagir e comprar produtos através de vídeos envolventes.

[![Deploy Status](https://img.shields.io/badge/deploy-live-success)](https://product-pit-stop.vercel.app)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node Version](https://img.shields.io/badge/node-22.16.0-brightgreen)](https://nodejs.org)

🌐 **[Ver Demo ao Vivo](https://product-pit-stop.vercel.app)**

---

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Como Usar](#como-usar)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Deploy](#deploy)
- [Equipe](#equipe)

---

## 🎯 Sobre o Projeto

**Product Pit Stop** é uma plataforma completa de video commerce que revoluciona a forma como produtos são descobertos e comprados online. Combinando elementos de redes sociais com e-commerce, oferecemos uma experiência única e envolvente.

### **Diferenciais:**
- 📱 **Feed Interativo**: Vídeos curtos de produtos em scroll infinito
- 🛒 **Compra Rápida**: Sistema de carrinho e checkout integrado
- 💬 **Comunicação Direta**: Mensagens entre compradores e vendedores
- 👨‍� **Painel de Vendedores**: Dashboard completo para gestão de produtos
- ⭐ **Engajamento**: Curtidas, comentários e compartilhamentos

**Público-alvo:** Vendedores que desejam promover produtos de forma visual e compradores que preferem descobrir produtos através de vídeos interativos.

---

## ✨ Funcionalidades

### 👤 **Autenticação e Perfil**
- ✅ Cadastro e login com JWT
- ✅ Perfil personalizável
- ✅ Histórico de pedidos
- ✅ Gerenciamento de conta

### 🎥 **Feed de Vídeos**
- ✅ Scroll infinito de produtos
- ✅ Vídeos curtos e envolventes
- ✅ Curtidas e comentários
- ✅ Compartilhamento social
- ✅ Busca avançada

### 🛒 **Sistema de Compras**
- ✅ Carrinho de compras completo
- ✅ Checkout rápido e seguro
- ✅ Múltiplas formas de pagamento
- ✅ Cálculo automático de totais
- ✅ Confirmação de pedidos

### 💬 **Mensagens**
- ✅ Chat entre usuários
- ✅ Histórico de conversas
- ✅ Interface intuitiva
- ✅ Notificações em tempo real

### 👨‍💼 **Painel do Vendedor**
- ✅ Dashboard de gestão
- ✅ Adicionar/editar produtos
- ✅ Upload de vídeos e imagens
- ✅ Controle de estoque
- ✅ Análise de produtos

---

## 🚀 Tecnologias

### **Backend**
- **Node.js 22.16.0** - Runtime JavaScript
- **Express.js** - Framework web minimalista
- **PostgreSQL (Supabase)** - Banco de dados relacional
- **JWT** - Autenticação segura
- **Bcrypt** - Hash de senhas
- **Helmet & CORS** - Segurança da API

### **Frontend**
- **React 18+** - Biblioteca UI moderna
- **TypeScript** - Tipagem estática
- **Vite** - Build tool ultra-rápido
- **TailwindCSS** - Framework CSS utilitário
- **Framer Motion** - Animações fluidas
- **Axios** - Cliente HTTP

### **Infraestrutura**
- **Vercel** - Deploy do frontend
- **Render** - Hospedagem do backend
- **Supabase** - Banco de dados PostgreSQL
- **Git & GitHub** - Controle de versão

---

## 🏁 Como Usar

### **Acesso Rápido**
1. Acesse: **[https://product-pit-stop.vercel.app](https://product-pit-stop.vercel.app)**
2. Crie sua conta ou faça login
3. Explore os produtos no feed
4. Adicione ao carrinho e finalize a compra!

### **Para Vendedores**
1. Faça login na plataforma
2. Clique em "Tornar-se Vendedor"
3. Acesse o Dashboard do Vendedor
4. Adicione seus produtos com vídeos
5. Gerencie suas vendas e estoque

### **Instalação Local (Desenvolvimento)**

#### **Pré-requisitos**
- Node.js 18 ou superior
- NPM ou Yarn
- Git

#### **1. Clone o repositório**
```bash
git clone https://github.com/Thurzix/Product-Pit-Stop.git
cd Product-Pit-Stop
```

#### **2. Backend**
```bash
cd backend
npm install

# Configure .env com suas credenciais Supabase
# SUPABASE_URL=sua_url
# SUPABASE_KEY=sua_chave
# JWT_SECRET=seu_secret

npm start
# Backend rodando em http://localhost:3001
```

#### **3. Frontend**
```bash
cd project
npm install

# Configure .env
# VITE_API_URL=http://localhost:3001

npm run dev
# Frontend rodando em http://localhost:5173
```

---

## 📁 Estrutura do Projeto

```
Product-Pit-Stop/
├── backend/                    # API Node.js + Express
│   ├── config/                # Configurações
│   │   └── database.js       # Conexão Supabase
│   ├── models/               # Models do banco
│   │   └── users.js
│   ├── routes/               # Rotas da API
│   │   ├── userRoutes.js    # Autenticação
│   │   └── productRoutes.js # Produtos
│   ├── server.js            # Servidor principal
│   └── package.json
│
├── project/                   # Frontend React
│   ├── src/
│   │   ├── components/       # Componentes React
│   │   │   ├── VideoFeed.tsx      # Feed principal
│   │   │   ├── CartPage.tsx       # Carrinho
│   │   │   ├── CheckoutPage.tsx   # Checkout
│   │   │   ├── SellerDashboard.tsx # Painel vendedor
│   │   │   └── ...
│   │   ├── contexts/         # Context API
│   │   │   └── AuthContext.tsx # Autenticação
│   │   ├── services/         # Serviços
│   │   │   ├── api.ts            # Cliente HTTP
│   │   │   └── cartService.ts    # Lógica do carrinho
│   │   ├── types/            # TypeScript types
│   │   ├── data/             # Dados de demonstração
│   │   ├── App.tsx           # App principal
│   │   └── main.tsx          # Entry point
│   ├── vite.config.ts        # Config Vite
│   ├── tailwind.config.js    # Config Tailwind
│   └── package.json
│
├── .github/                   # GitHub configs
├── .gitignore
├── CONTRIBUTING.md           # Guia de contribuição
├── README.md                 # Este arquivo
└── LICENSE
```

---

## 🌐 Deploy

### **Ambientes de Produção**

| Serviço | Plataforma | URL |
|---------|-----------|-----|
| **Frontend** | Vercel | [product-pit-stop.vercel.app](https://product-pit-stop.vercel.app) |
| **Backend** | Render | product-pit-stop-backend.onrender.com |
| **Banco de Dados** | Supabase | PostgreSQL gerenciado |

### **CI/CD**
- **Vercel**: Deploy automático a cada push na branch `main`
- **Render**: Deploy automático conectado ao GitHub
- **Supabase**: Banco de dados com backups automáticos

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

### **Padrões de Commit**
- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Documentação
- `style:` Formatação
- `refactor:` Refatoração
- `test:` Testes

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

---

## 👨‍💻 Equipe

### **Desenvolvedor Principal**
**Arthur Henrique Pasqualini da Silva** ([@Thurzix](https://github.com/Thurzix))
- Arquitetura e desenvolvimento full-stack
- Deploy e infraestrutura
- Gestão do projeto

### **Contribuidores**
- **Leandro de Moraes** ([@FULL-calvo](https://github.com/FULL-calvo)) - Desenvolvimento e testes
- **Rickson Madureira** ([@Shad00wman](https://github.com/Shad00wman)) - Desenvolvimento e suporte

Desenvolvido como projeto de conclusão de curso, demonstrando habilidades em desenvolvimento full-stack, arquitetura de sistemas e deploy em produção.

---

## 🙏 Agradecimentos

- Comunidade React e Node.js
- Supabase pelo excelente serviço de banco de dados
- Vercel e Render pela infraestrutura de hospedagem
- Todos que contribuíram e testaram a plataforma

---

## 📞 Suporte

- **Issues**: [GitHub Issues](https://github.com/Thurzix/Product-Pit-Stop/issues)
- **Documentação**: Este README e código-fonte comentado

---

<div align="center">

**⭐ Se este projeto te inspirou, deixe uma estrela!**

*Made with ❤️ and ☕ by [Thurzix](https://github.com/Thurzix)*

**[� Acessar Plataforma](https://product-pit-stop.vercel.app)**

</div>