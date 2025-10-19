# 🚀 Guia de Deploy - Product Pit Stop

## 📋 Índice
- [Arquitetura de Deploy](#arquitetura-de-deploy)
- [Ambientes](#ambientes)
- [Configuração Inicial](#configuração-inicial)
- [Deploy Manual](#deploy-manual)
- [Deploy Automático](#deploy-automático)
- [Troubleshooting](#troubleshooting)

---

## 🏗️ Arquitetura de Deploy

```
┌─────────────────────────────────────────────┐
│          GITHUB REPOSITORY                   │
│  ┌─────────┐           ┌──────────┐        │
│  │  main   │           │ develop  │        │
│  └────┬────┘           └────┬─────┘        │
└───────┼──────────────────────┼──────────────┘
        │                      │
        │ (push/merge)         │ (push/merge)
        ▼                      ▼
┌───────────────┐      ┌───────────────┐
│   PRODUCTION  │      │    STAGING    │
│               │      │               │
│  Frontend:    │      │  Frontend:    │
│  Vercel       │      │  Vercel       │
│               │      │               │
│  Backend:     │      │  Backend:     │
│  Railway      │      │  Railway      │
│               │      │               │
│  Database:    │      │  Database:    │
│  Railway      │      │  Railway      │
│  MySQL        │      │  MySQL        │
└───────────────┘      └───────────────┘
```

---

## 🌍 Ambientes

### **1. Produção (main)**
| Serviço | Plataforma | URL |
|---------|-----------|-----|
| Frontend | Vercel | `https://product-pit-stop.vercel.app` |
| Backend API | Railway | `https://api.product-pit-stop.railway.app` |
| Database | Railway | Acesso interno |

**Características:**
- ✅ Código estável e testado
- ✅ Deploy automático via GitHub Actions
- ✅ Monitoramento ativo
- ✅ Backup automático do banco

### **2. Staging (develop)**
| Serviço | Plataforma | URL |
|---------|-----------|-----|
| Frontend | Vercel | `https://staging-product-pit-stop.vercel.app` |
| Backend API | Railway | `https://staging-api.product-pit-stop.railway.app` |
| Database | Railway | Acesso interno (separado) |

**Características:**
- 🧪 Ambiente de testes
- 🔄 Deploy automático a cada push
- 📊 Dados de teste
- 🚀 Preview de novas features

---

## ⚙️ Configuração Inicial

### **1. Pré-requisitos**
- [ ] Conta no GitHub
- [ ] Conta no Vercel (https://vercel.com)
- [ ] Conta no Railway (https://railway.app)
- [ ] Node.js 18+ instalado
- [ ] Git configurado

### **2. Configurar Vercel (Frontend)**

#### 2.1. Importar Projeto
1. Acesse https://vercel.com/new
2. Conecte com GitHub
3. Selecione o repositório `Thurzix/Product-Pit-Stop`
4. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `project`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

#### 2.2. Configurar Ambientes

**Para Produção (main):**
```bash
# Variáveis de Ambiente no Vercel
VITE_API_URL=https://api.product-pit-stop.railway.app
VITE_APP_NAME=Product Pit Stop
VITE_ENV=production
```

**Para Staging (develop):**
```bash
# Variáveis de Ambiente no Vercel
VITE_API_URL=https://staging-api.product-pit-stop.railway.app
VITE_APP_NAME=Product Pit Stop - Staging
VITE_ENV=staging
```

#### 2.3. Configurar Git Branches
1. Vá em **Settings** → **Git**
2. **Production Branch:** `main`
3. Adicione **Branch:** `develop` (para staging)
4. Salvar

#### 2.4. Obter Secrets para GitHub Actions
```bash
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Link do projeto
cd project
vercel link

# Obter tokens
vercel whoami
# Copie o Organization ID e Project ID
```

Adicione ao GitHub:
- **Settings** → **Secrets and variables** → **Actions**
- `VERCEL_TOKEN`: Token da Vercel
- `VERCEL_ORG_ID`: ID da organização
- `VERCEL_PROJECT_ID`: ID do projeto

### **3. Configurar Railway (Backend + Database)**

#### 3.1. Criar Projeto
1. Acesse https://railway.app/new
2. **New Project** → **Deploy from GitHub repo**
3. Selecione `Thurzix/Product-Pit-Stop`
4. Configure:
   - **Root Directory:** `backend`
   - **Start Command:** `node server-new.js`

#### 3.2. Adicionar MySQL Database
1. No projeto Railway, clique em **+ New**
2. Selecione **Database** → **Add MySQL**
3. Aguarde provisionamento
4. Copie as credenciais

#### 3.3. Configurar Variáveis de Ambiente

**Produção:**
```bash
# No Railway, adicione estas variáveis:
DB_HOST=containers-us-west-xxx.railway.app
DB_USER=root
DB_PASSWORD=xxxxxxxxxxxxx
DB_NAME=railway
DB_PORT=3306

JWT_SECRET=produto_pit_stop_jwt_secret_production_2025
JWT_EXPIRE=24h

PORT=3001
NODE_ENV=production

BCRYPT_ROUNDS=12

# Cloudinary (se configurado)
CLOUDINARY_CLOUD_NAME=seu_cloud_name
CLOUDINARY_API_KEY=seu_api_key
CLOUDINARY_API_SECRET=seu_api_secret
```

#### 3.4. Executar Schema do Banco
```bash
# Conectar ao MySQL do Railway
mysql -h containers-us-west-xxx.railway.app \
      -u root \
      -p \
      railway

# Executar schema
mysql> source backend/config/schema.sql;
mysql> exit;
```

#### 3.5. Configurar Domínios
1. No Railway, vá em **Settings** → **Domains**
2. **Generate Domain** ou adicione domínio customizado
3. Copie a URL gerada

#### 3.6. Repetir para Staging
- Crie **outro projeto** no Railway para staging
- Use branch `develop`
- Configure variáveis de ambiente diferentes
- Use banco de dados separado

---

## 🚀 Deploy Manual

### **Frontend (Vercel)**
```bash
# 1. Instalar Vercel CLI
npm install -g vercel

# 2. Login
vercel login

# 3. Deploy para staging
cd project
vercel

# 4. Deploy para produção
vercel --prod
```

### **Backend (Railway)**
```bash
# 1. Instalar Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Link projeto
railway link

# 4. Deploy
railway up
```

---

## 🤖 Deploy Automático

### **Fluxo Automático Configurado:**

#### **1. Push para `develop`:**
```bash
git checkout develop
git add .
git commit -m "feat: nova funcionalidade"
git push origin develop
```

**O que acontece:**
1. ✅ GitHub Actions executa CI (lint, build, test)
2. ✅ Se passar, deploy automático para staging
3. ✅ Vercel: staging-product-pit-stop.vercel.app
4. ✅ Railway: staging-api.product-pit-stop.railway.app

#### **2. Merge para `main` (via PR):**
```bash
# Criar PR: develop → main
# Após aprovação e merge:
```

**O que acontece:**
1. ✅ GitHub Actions executa CI completo
2. ✅ Testes de segurança
3. ✅ Build de produção
4. ✅ Deploy automático para produção
5. ✅ Vercel: product-pit-stop.vercel.app
6. ✅ Railway: api.product-pit-stop.railway.app

---

## 🔧 Configurar Branch Protection (GitHub)

### **Proteger branch `main`:**

1. **Settings** → **Branches** → **Add rule**
2. **Branch name pattern:** `main`
3. Configurar:
   - ✅ **Require a pull request before merging**
     - ✅ Require approvals: 1
     - ✅ Dismiss stale reviews
   - ✅ **Require status checks to pass**
     - ✅ Require branches to be up to date
     - Adicionar checks: `build`, `test`, `lint`
   - ✅ **Require conversation resolution**
   - ✅ **Do not allow bypassing** (importante!)
   - ❌ **Allow force pushes** (desabilitado)
   - ❌ **Allow deletions** (desabilitado)

4. **Save changes**

### **Resultado:**
- ❌ **Push direto BLOQUEADO** na main
- ✅ Apenas merge via Pull Request
- ✅ Requer aprovação de código
- ✅ CI deve passar antes de merge

---

## 🐛 Troubleshooting

### **Problema: Build falha no Vercel**
```bash
# Verificar logs
vercel logs

# Testar build localmente
cd project
npm run build

# Verificar variáveis de ambiente
vercel env ls
```

### **Problema: Backend não conecta ao banco**
```bash
# Verificar credenciais
railway variables

# Testar conexão
mysql -h HOST -u USER -p DATABASE

# Ver logs do backend
railway logs
```

### **Problema: Deploy automático não funciona**
```bash
# Verificar GitHub Actions
# Repository → Actions → Ver logs

# Verificar secrets
# Repository → Settings → Secrets

# Re-executar workflow
# Actions → Select workflow → Re-run jobs
```

### **Problema: CORS errors**
```javascript
// Adicionar no backend (server-new.js)
app.use(cors({
  origin: [
    'https://product-pit-stop.vercel.app',
    'https://staging-product-pit-stop.vercel.app',
    'http://localhost:5173'
  ],
  credentials: true
}));
```

---

## 📊 Monitoramento

### **Vercel:**
- Dashboard: https://vercel.com/dashboard
- Analytics: Veja métricas de performance
- Logs: Acesse logs em tempo real

### **Railway:**
- Dashboard: https://railway.app/dashboard
- Metrics: CPU, RAM, Network
- Logs: Logs do backend em tempo real

### **GitHub Actions:**
- Workflows: Veja status de CI/CD
- Notifications: Configure alertas

---

## 📝 Checklist de Deploy

### **Antes de fazer merge para main:**
- [ ] Testes passando em staging
- [ ] Code review aprovado
- [ ] Variáveis de ambiente configuradas
- [ ] Banco de dados atualizado (migrations)
- [ ] Documentação atualizada
- [ ] Sem console.logs de debug
- [ ] Build passa sem warnings

### **Após deploy em produção:**
- [ ] Verificar URLs estão acessíveis
- [ ] Testar fluxos principais
- [ ] Verificar logs (sem erros)
- [ ] Monitorar primeiras horas
- [ ] Avisar equipe sobre deploy

---

## 🆘 Suporte

- **Vercel Docs:** https://vercel.com/docs
- **Railway Docs:** https://docs.railway.app
- **GitHub Actions:** https://docs.github.com/actions

---

**Última atualização:** Outubro 2025  
**Mantido por:** @Thurzix