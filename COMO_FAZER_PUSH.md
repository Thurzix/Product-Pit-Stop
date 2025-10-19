# 🔐 Como Fazer Push para o GitHub

## ⚠️ Problema de Autenticação

Você verá este erro ao tentar push:
```
remote: Invalid username or token. Password authentication is not supported for Git operations.
fatal: Authentication failed
```

---

## ✅ SOLUÇÃO 1: Personal Access Token (Recomendado)

### Passo 1: Criar Token no GitHub
1. Acesse: https://github.com/settings/tokens
2. Clique em **"Generate new token"** → **"Generate new token (classic)"**
3. Configure:
   - **Note:** "Product Pit Stop - Dev Access"
   - **Expiration:** 90 days (ou custom)
   - **Scopes:** Marque:
     - ✅ `repo` (Full control of private repositories)
     - ✅ `workflow` (Update GitHub Action workflows)
     - ✅ `write:packages` (Upload packages)
4. Clique em **"Generate token"**
5. **⚠️ COPIE O TOKEN AGORA** (só aparece uma vez!)

### Passo 2: Usar o Token no Push
```bash
# Fazer push usando o token como senha
git push -u origin develop

# Quando pedir credenciais:
Username: Thurzix
Password: [COLE SEU TOKEN AQUI]
```

### Passo 3: Salvar Credenciais (Opcional)
```bash
# Para não precisar digitar sempre
git config --global credential.helper store

# Próximo push salvará as credenciais
git push -u origin develop
```

---

## ✅ SOLUÇÃO 2: SSH Keys (Mais Seguro)

### Passo 1: Gerar SSH Key
```bash
# No PowerShell
ssh-keygen -t ed25519 -C "seu-email@example.com"

# Pressione Enter para aceitar local padrão
# Crie uma senha (ou deixe vazio)
```

### Passo 2: Adicionar ao SSH Agent
```bash
# Iniciar ssh-agent
Start-Service ssh-agent

# Adicionar chave
ssh-add C:\Users\arthu\.ssh\id_ed25519
```

### Passo 3: Adicionar no GitHub
```bash
# Copiar chave pública
Get-Content C:\Users\arthu\.ssh\id_ed25519.pub | Set-Clipboard
```

1. Acesse: https://github.com/settings/keys
2. Clique em **"New SSH key"**
3. **Title:** "PC Arthur - Product Pit Stop"
4. **Key:** Cole a chave copiada
5. Clique em **"Add SSH key"**

### Passo 4: Mudar Remote para SSH
```bash
# Verificar remote atual
git remote -v

# Mudar para SSH
git remote set-url origin git@github.com:Thurzix/Product-Pit-Stop.git

# Verificar mudança
git remote -v
```

### Passo 5: Fazer Push
```bash
git push -u origin develop
```

---

## ✅ SOLUÇÃO 3: GitHub CLI (Mais Fácil)

### Passo 1: Instalar GitHub CLI
```bash
# Com winget
winget install --id GitHub.cli

# Ou baixar: https://cli.github.com/
```

### Passo 2: Autenticar
```bash
gh auth login

# Seguir instruções:
# - GitHub.com
# - HTTPS
# - Login via browser
```

### Passo 3: Fazer Push
```bash
git push -u origin develop
```

---

## 🚀 APÓS AUTENTICAÇÃO BEM-SUCEDIDA

Você verá:
```bash
Enumerating objects: 10, done.
Counting objects: 100% (10/10), done.
Delta compression using up to 8 threads
Compressing objects: 100% (8/8), done.
Writing objects: 100% (9/9), 15.23 KiB | 7.61 MiB/s, done.
Total 9 (delta 1), reused 0 (delta 0), pack-reused 0
remote: Resolving deltas: 100% (1/1), done.
To https://github.com/Thurzix/Product-Pit-Stop.git
 * [new branch]      develop -> develop
Branch 'develop' set up to track remote branch 'develop' from 'origin'.
```

✅ **Sucesso!** Branch develop está no GitHub!

---

## 📍 PRÓXIMOS PASSOS APÓS PUSH

### 1. Verificar no GitHub
- Acesse: https://github.com/Thurzix/Product-Pit-Stop
- Você deve ver a branch `develop` no dropdown de branches

### 2. Configurar Proteção da Main
- Seguir: `docs/CONFIGURAR_PROTECAO_BRANCH.md`
- Settings → Branches → Add rule para `main`

### 3. Verificar GitHub Actions
- Ir em **Actions** tab
- Ver workflows rodando automaticamente

### 4. Configurar Secrets para Deploy
- Settings → Secrets and variables → Actions
- Adicionar:
  - `VERCEL_TOKEN`
  - `VERCEL_ORG_ID`
  - `VERCEL_PROJECT_ID`

---

## 🆘 TROUBLESHOOTING

### Erro: "Permission denied (publickey)"
```bash
# Verificar SSH agent
Get-Service ssh-agent

# Adicionar chave novamente
ssh-add C:\Users\arthu\.ssh\id_ed25519
```

### Erro: "fatal: Authentication failed"
- Token expirado? Gere um novo
- Token tem permissões corretas? Verifique scopes
- Usuário correto? Verifique `git config user.name`

### Erro: "remote: Invalid username or password"
- Use token, não senha da conta
- Token deve ter scope `repo`

---

## 📝 COMANDOS RÁPIDOS

```bash
# Ver status
git status

# Ver branches
git branch -a

# Ver remote
git remote -v

# Refazer push (se necessário)
git push -u origin develop --force  # ⚠️ Cuidado com --force
```

---

## ✅ CHECKLIST

Após fazer push com sucesso:
- [ ] Branch develop aparece no GitHub
- [ ] Arquivos estão todos lá
- [ ] GitHub Actions começou a rodar
- [ ] Configurar proteção da main
- [ ] Configurar secrets do Vercel
- [ ] Testar criar uma feature branch

---

**Escolha a solução que preferir e siga os passos!**  
**Recomendação:** Use **Solução 1 (Token)** para rapidez.

Boa sorte! 🚀