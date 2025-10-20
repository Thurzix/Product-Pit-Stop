# 🚀 Como Iniciar o Servidor Backend

## Método 1: Arquivo Batch (Mais Fácil)

1. Navegue até a pasta `backend`
2. Clique duas vezes em `start-server.bat`

## Método 2: Terminal Manual

1. Abra um terminal no VS Code (Ctrl + Shift + `)
2. Execute os comandos:

```powershell
cd backend
node server-new.js
```

## Método 3: NPM

```powershell
cd backend
npm start
```

## ✅ Como saber se funcionou?

Você verá estas mensagens:

```
✅ Conexão com Supabase estabelecida com sucesso!
🚀 Servidor Product Pit Stop rodando na porta 3001
🌍 Ambiente: development
🔗 Health check: http://localhost:3001/health
```

## ❌ Problemas Comuns

### Erro: "address already in use"

Significa que já existe um servidor rodando na porta 3001.

**Solução:**

```powershell
# Ver qual processo está usando a porta
netstat -ano | findstr :3001

# Parar o processo (substitua XXXX pelo PID mostrado)
taskkill /PID XXXX /F
```

### Erro: "JWT_SECRET must have a value"

Significa que falta configurar a variável de ambiente.

**Solução:**
Verifique se o arquivo `.env` existe e contém:

```
JWT_SECRET=product-pit-stop-super-secret-key-change-this-in-production-2025
JWT_EXPIRE=24h
```

## 🔧 Verificar se está funcionando

Abra seu navegador em: http://localhost:3001/health

Deve mostrar:

```json
{
  "success": true,
  "message": "Product Pit Stop API está funcionando!"
}
```
