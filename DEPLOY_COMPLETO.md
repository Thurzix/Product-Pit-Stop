# 🚀 Guia de Deploy Completo - Product Pit Stop

## ✅ O que já está pronto:

### Frontend (Vercel):
- ✅ Conectado ao repositório GitHub
- ✅ Configurado com framework Vite
- ✅ Variável de ambiente `VITE_API_URL` configurada no código

### Backend (Local):
- ✅ Supabase configurado e funcionando
- ✅ Server rodando na porta 3001
- ✅ CORS configurado para aceitar Vercel

---

## 🎯 Próximos Passos:

### 1️⃣ **TESTAR LOCALMENTE** (Agora!)

Execute os dois servidores ao mesmo tempo:

```powershell
# Terminal 1 - Backend
cd c:\Users\arthu\OneDrive\Documentos\Product-Pit-Stop\backend
node server-new.js

# Terminal 2 - Frontend
cd c:\Users\arthu\OneDrive\Documentos\Product-Pit-Stop\project
npm run dev
```

✅ Acesse: `http://localhost:5173` e teste se consegue fazer login, ver produtos, etc.

---

### 2️⃣ **FAZER DEPLOY DO BACKEND**

Escolha uma das opções:

#### **Opção A: Railway** (Recomendado - Mais fácil)

1. Acesse: https://railway.app
2. Faça login com GitHub
3. Clique em **"New Project" → "Deploy from GitHub repo"**
4. Selecione: `Thurzix/Product-Pit-Stop`
5. Configure:
   - **Root Directory**: `backend`
   - **Start Command**: `node server-new.js`

6. Adicione as variáveis de ambiente:
   ```
   NODE_ENV=production
   PORT=3001
   SUPABASE_URL=https://xaaxihzrpulwzgkyesmk.supabase.co
   SUPABASE_ANON_KEY=eyJhbGci...TDR6c
   SUPABASE_SERVICE_KEY=eyJhbGci...mkno
   JWT_SECRET=produto_pit_stop_jwt_secret_super_seguro_2024_desenvolvimento
   JWT_EXPIRE=24h
   BCRYPT_ROUNDS=10
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   FRONTEND_URL=https://product-pit-stop.vercel.app
   ```

7. Copie a URL gerada (exemplo: `https://product-pit-stop-production.up.railway.app`)

#### **Opção B: Render**

1. Acesse: https://render.com
2. Faça login com GitHub
3. Clique em **"New" → "Web Service"**
4. Conecte: `Thurzix/Product-Pit-Stop`
5. Configure:
   - **Name**: product-pit-stop-backend
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server-new.js`
   - **Plan**: Free

6. Adicione as mesmas variáveis de ambiente acima

---

### 3️⃣ **CONFIGURAR VERCEL COM BACKEND DEPLOYADO**

Depois que o backend estiver no ar:

1. Acesse: https://vercel.com/dashboard
2. Vá no seu projeto **Product-Pit-Stop**
3. Clique em **Settings → Environment Variables**
4. Adicione:
   ```
   VITE_API_URL = https://sua-url-do-railway.up.railway.app
   ```

5. Faça um novo deploy:
   - Vá em **Deployments**
   - Clique nos 3 pontinhos do último deploy
   - **Redeploy** (para usar a nova variável)

---

## 🧪 Testando a Integração Completa:

1. ✅ Backend rodando (Railway/Render)
2. ✅ Frontend rodando (Vercel)
3. ✅ Teste:
   - Acesse a URL do Vercel
   - Faça cadastro de novo usuário
   - Faça login
   - Veja se carrega produtos

---

## 🔧 Comandos Úteis:

### Rodar tudo localmente:
```powershell
# Backend
cd backend
node server-new.js

# Frontend (outro terminal)
cd project
npm run dev
```

### Ver logs do backend no Railway:
- Dashboard → Seu projeto → View Logs

### Ver logs do frontend no Vercel:
- Dashboard → Deployments → Clique no deploy → View Function Logs

---

## ⚠️ Troubleshooting:

### Frontend não conecta no backend:
1. Verifique se `VITE_API_URL` está configurada no Vercel
2. Verifique se o backend está no ar (acesse a URL do Railway)
3. Veja o console do navegador (F12) para erros de CORS

### Backend dá erro 500:
1. Veja os logs no Railway/Render
2. Confirme que todas as variáveis de ambiente foram adicionadas
3. Teste a conexão com Supabase

### CORS Error:
- Adicione a URL do Vercel na variável `FRONTEND_URL` do backend no Railway

---

## 📚 Referências:

- **Railway**: https://docs.railway.app
- **Render**: https://render.com/docs
- **Vercel**: https://vercel.com/docs
- **Supabase**: https://supabase.com/docs

---

## ✨ Resumo do que configuramos:

✅ Frontend usa `import.meta.env.VITE_API_URL` para saber onde está o backend  
✅ Backend usa `process.env.FRONTEND_URL` no CORS para aceitar requisições do Vercel  
✅ Supabase conectado com todas as credenciais  
✅ Estrutura pronta para desenvolvimento E produção  

**Próximo passo**: Fazer deploy do backend! 🚀
