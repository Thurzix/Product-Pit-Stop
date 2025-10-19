# 🔒 Guia: Configurar Proteção da Branch Main no GitHub

## ⚠️ IMPORTANTE
Este guia deve ser seguido **MANUALMENTE** no GitHub, pois a proteção de branches não pode ser configurada via código.

---

## 📋 Passo a Passo

### **1. Acessar Configurações do Repositório**
1. Acesse: https://github.com/Thurzix/Product-Pit-Stop
2. Clique em **Settings** (aba no topo)
3. No menu lateral, clique em **Branches**

### **2. Adicionar Regra de Proteção**
1. Clique em **Add branch protection rule** (ou **Add rule**)
2. Em **Branch name pattern**, digite: `main`

### **3. Configurar Regras de Proteção**

#### ✅ **Seção: Protect matching branches**

**Marque estas opções:**

- ✅ **Require a pull request before merging**
  - ✅ **Require approvals:** Configure para `1` aprovação mínima
  - ✅ **Dismiss stale pull request approvals when new commits are pushed**
  - ✅ **Require review from Code Owners** (opcional, se tiver CODEOWNERS)

- ✅ **Require status checks to pass before merging**
  - ✅ **Require branches to be up to date before merging**
  - No campo de busca, adicione os checks:
    - `build` (se configurado no CI)
    - `test` (se configurado no CI)
    - `lint` (se configurado no CI)
  
  > **Nota:** Estes checks aparecerão após o primeiro PR com GitHub Actions

- ✅ **Require conversation resolution before merging**
  - Garante que todos os comentários sejam resolvidos

- ✅ **Require signed commits** (opcional, mas recomendado)
  - Aumenta a segurança

- ✅ **Require linear history** (opcional)
  - Mantém histórico limpo, sem merge commits

- ✅ **Do not allow bypassing the above settings**
  - **⚠️ CRÍTICO:** Garante que nem admins pulem as regras

#### ❌ **NÃO marque estas opções:**

- ❌ **Allow force pushes**
  - Mantém histórico intacto
  
- ❌ **Allow deletions**
  - Previne exclusão acidental da branch

### **4. Configurações Adicionais (Opcional)**

- **Require deployments to succeed before merging**
  - Se quiser garantir que deploy em staging funcione

- **Lock branch**
  - Torna a branch read-only (não recomendado para main)

### **5. Salvar Configuração**
1. Role até o final da página
2. Clique em **Create** ou **Save changes**

---

## ✅ Resultado Esperado

Após configurar, a branch `main` terá:

- ❌ **Push direto BLOQUEADO** para todos (incluindo você)
- ✅ **Apenas Pull Requests** são aceitos
- ✅ **Mínimo 1 aprovação** necessária
- ✅ **CI deve passar** (build, test, lint)
- ✅ **Comentários resolvidos** antes de merge
- ✅ **Ninguém pode burlar** as regras

---

## 🧪 Testar a Configuração

### **Teste 1: Tentar push direto (deve falhar)**
```bash
git checkout main
git add .
git commit -m "test: tentar push direto"
git push origin main
```

**Resultado esperado:**
```
! [remote rejected] main -> main (protected branch hook declined)
error: failed to push some refs
```

✅ **Sucesso!** A proteção está funcionando.

### **Teste 2: Criar Pull Request (deve funcionar)**
```bash
git checkout develop
git add .
git commit -m "feat: nova funcionalidade"
git push origin develop

# Agora criar PR no GitHub: develop → main
```

**Resultado esperado:**
- ✅ PR criado com sucesso
- ⏳ CI executando (GitHub Actions)
- ⏳ Aguardando aprovação
- ⏳ Aguardando CI passar

---

## 📊 Visualizar Regras Ativas

Após configurar, você verá na página de Branches:

```
Branch protection rules

main
  ✓ Require pull request reviews before merging
  ✓ Require status checks to pass
  ✓ Require conversation resolution
  ✓ Do not allow bypassing
  ✗ Allow force pushes (disabled)
  ✗ Allow deletions (disabled)
```

---

## 🔄 Repetir para Branch `develop` (Opcional)

Se quiser proteger também a branch `develop`:

1. Repita o processo acima
2. **Branch name pattern:** `develop`
3. Use configurações **menos restritivas**:
   - Aprovações: `0` ou `1`
   - Permitir bypass para admins (opcional)
   - Menos crítico que main

---

## 🆘 Troubleshooting

### **Problema: Não consigo criar a regra**
- Verifique se você tem permissões de **Admin** no repositório
- Se for repositório de organização, peça ao owner

### **Problema: Status checks não aparecem**
- Execute o workflow pelo menos uma vez
- Faça um PR para ver os checks disponíveis
- Adicione os checks depois que aparecerem

### **Problema: Preciso fazer push urgente na main**
- **NÃO desabilite a proteção!**
- Crie um hotfix branch
- Faça PR rápido com aprovação
- Mantenha o processo

### **Problema: CI sempre falha**
- Verifique logs do GitHub Actions
- Corrija os erros no código
- Push na branch de feature
- PR só merge quando CI passar

---

## 📝 Checklist de Validação

Após configurar, verifique:

- [ ] Tentei push direto na main (deve falhar)
- [ ] Criei PR de develop → main (deve funcionar)
- [ ] GitHub Actions executa no PR
- [ ] Botão "Merge" fica bloqueado até aprovação
- [ ] Não consigo burlar as regras
- [ ] Configuração está salva no GitHub

---

## 🎯 Objetivo Final

Com esta configuração:

1. ✅ **main** protegida contra pushes diretos
2. ✅ **Processo de review** obrigatório
3. ✅ **CI/CD** garante qualidade
4. ✅ **Histórico limpo** e rastreável
5. ✅ **Deploys seguros** em produção

---

## 📚 Referências

- **GitHub Docs:** https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches
- **Best Practices:** https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches

---

**⏰ Tempo estimado:** 5-10 minutos  
**✅ Quando concluir, volte e marque como feito!**