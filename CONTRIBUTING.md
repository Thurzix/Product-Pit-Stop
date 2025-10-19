# 🤝 Guia de Contribuição - Product Pit Stop

## 📋 Sumário
- [Fluxo de Trabalho com Branches](#fluxo-de-trabalho-com-branches)
- [Como Contribuir](#como-contribuir)
- [Padrões de Código](#padrões-de-código)
- [Processo de Pull Request](#processo-de-pull-request)

---

## 🌳 Fluxo de Trabalho com Branches

### **Estrutura de Branches**

```
main (produção)
  ↑
  └── develop (staging/testes)
       ↑
       ├── feature/nova-funcionalidade
       ├── fix/correcao-bug
       └── hotfix/correcao-urgente
```

### **Branches Principais**

#### 🟢 **main** - Produção
- **Propósito:** Código em produção, sempre estável
- **Proteção:** ❌ PUSH DIRETO BLOQUEADO
- **Deploy:** Automático para ambiente de produção
- **Regras:**
  - Apenas aceita merge via Pull Request
  - Requer aprovação de code review
  - Todos os testes devem passar
  - Deploy automático no Vercel (frontend) e Railway (backend)

#### 🔵 **develop** - Staging/Testes
- **Propósito:** Integração e testes antes de produção
- **Proteção:** ⚠️ Recomendado evitar push direto
- **Deploy:** Automático para ambiente de staging
- **Regras:**
  - Base para novas features
  - Onde fazemos testes de integração
  - Deve estar sempre em estado "deployável"

---

## 🚀 Como Contribuir

### **1. Clone o Repositório**
```bash
git clone https://github.com/Thurzix/Product-Pit-Stop.git
cd Product-Pit-Stop
```

### **2. Instale as Dependências**
```bash
# Backend
cd backend
npm install

# Frontend
cd ../project
npm install
```

### **3. Configure as Variáveis de Ambiente**
```bash
# Backend
cp backend/.env.example backend/.env
# Edite backend/.env com suas credenciais

# Frontend
cp project/.env.example project/.env
# Edite project/.env com a URL da API
```

### **4. Crie uma Nova Branch**

#### Para novas funcionalidades:
```bash
git checkout develop
git pull origin develop
git checkout -b feature/nome-da-funcionalidade
```

#### Para correções de bugs:
```bash
git checkout develop
git pull origin develop
git checkout -b fix/descricao-do-bug
```

#### Para correções urgentes em produção:
```bash
git checkout main
git pull origin main
git checkout -b hotfix/descricao-do-problema
```

### **5. Faça Suas Alterações**
- Escreva código limpo e documentado
- Siga os padrões de código do projeto
- Adicione testes quando apropriado
- Teste localmente antes de commitar

### **6. Commit Suas Mudanças**

Usamos **Conventional Commits** para padronizar mensagens:

```bash
# Tipos de commit:
feat:     Nova funcionalidade
fix:      Correção de bug
docs:     Documentação
style:    Formatação (não afeta código)
refactor: Refatoração
test:     Testes
chore:    Manutenção

# Exemplos:
git commit -m "feat: adiciona sistema de chat entre usuários"
git commit -m "fix: corrige cálculo de total no carrinho"
git commit -m "docs: atualiza README com instruções de deploy"
```

### **7. Push para o GitHub**
```bash
git push origin feature/nome-da-funcionalidade
```

### **8. Abra um Pull Request**
1. Acesse o repositório no GitHub
2. Clique em "Compare & pull request"
3. Escolha a branch de destino:
   - `develop` para features/fixes normais
   - `main` para hotfixes urgentes
4. Preencha o template do PR
5. Aguarde review e aprovação

---

## 📝 Padrões de Código

### **JavaScript/TypeScript**
```typescript
// ✅ BOM
const fetchProducts = async (page: number): Promise<Product[]> => {
  try {
    const response = await api.getProducts(page);
    return response.products;
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    throw error;
  }
};

// ❌ EVITAR
function fetchProducts(page) {
  return api.getProducts(page).then(r => r.products);
}
```

### **Nomenclatura**
- **Componentes React:** PascalCase (`VideoFeed.tsx`)
- **Funções/Variáveis:** camelCase (`fetchProducts`)
- **Constantes:** UPPER_SNAKE_CASE (`API_BASE_URL`)
- **Arquivos CSS:** kebab-case (`video-card.css`)

### **Estrutura de Componentes React**
```typescript
// 1. Imports
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

// 2. Types/Interfaces
interface VideoFeedProps {
  category?: string;
}

// 3. Componente
export const VideoFeed: React.FC<VideoFeedProps> = ({ category }) => {
  // 4. State
  const [products, setProducts] = useState([]);
  
  // 5. Effects
  useEffect(() => {
    fetchProducts();
  }, []);
  
  // 6. Funções
  const fetchProducts = async () => {
    // ...
  };
  
  // 7. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
};
```

---

## 🔍 Processo de Pull Request

### **Template de PR**

```markdown
## 📝 Descrição
Descreva brevemente o que foi alterado/adicionado

## 🎯 Tipo de Mudança
- [ ] Nova funcionalidade (feature)
- [ ] Correção de bug (fix)
- [ ] Documentação
- [ ] Refatoração
- [ ] Hotfix

## ✅ Checklist
- [ ] Código testado localmente
- [ ] Testes automatizados adicionados/atualizados
- [ ] Documentação atualizada
- [ ] Build passa sem erros
- [ ] Sem conflitos com a branch de destino

## 🖼️ Screenshots (se aplicável)
Adicione screenshots ou GIFs demonstrando as mudanças

## 🔗 Issue Relacionada
Closes #123
```

### **Revisão de Código**

#### O que revisar:
- ✅ Lógica e funcionalidade corretas
- ✅ Código limpo e legível
- ✅ Tratamento de erros adequado
- ✅ Performance
- ✅ Segurança
- ✅ Testes suficientes

#### Como comentar:
```
✅ Aprovação: "LGTM! 🚀" (Looks Good To Me)
💬 Sugestão: "Considere usar async/await aqui"
❌ Bloqueante: "Isso pode causar memory leak"
❓ Pergunta: "Por que optou por esta abordagem?"
```

---

## 🚀 Deploy

### **Ambientes**

| Branch | Ambiente | URL | Deploy |
|--------|----------|-----|--------|
| `main` | Produção | [pitstop.com](https://pitstop.com) | Automático |
| `develop` | Staging | [staging.pitstop.com](https://staging.pitstop.com) | Automático |

### **Fluxo de Deploy**

```
1. Developer cria PR: feature/X → develop
2. Code review + aprovação
3. Merge para develop
4. ✅ Deploy automático para staging
5. Testes em staging
6. PR: develop → main
7. Aprovação final
8. Merge para main
9. ✅ Deploy automático para produção
```

---

## 📞 Suporte

- **Issues:** [GitHub Issues](https://github.com/Thurzix/Product-Pit-Stop/issues)
- **Discussões:** [GitHub Discussions](https://github.com/Thurzix/Product-Pit-Stop/discussions)
- **Email:** suporte@pitstop.com

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

**Obrigado por contribuir com o Product Pit Stop! 🎉**