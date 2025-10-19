# 🎯 Como Adicionar Produtos de Demonstração ao Supabase

## ⚡ Passo a Passo Rápido:

### 1️⃣ Acesse o Supabase
1. Vá para: https://supabase.com/dashboard
2. Faça login
3. Selecione seu projeto: **xaaxihzrpulwzgkyesmk**

### 2️⃣ Abra o SQL Editor
1. No menu lateral esquerdo, clique em **SQL Editor**
2. Clique em **"New query"**

### 3️⃣ Execute o Script
1. Abra o arquivo: `backend/database/seed-demo-products.sql`
2. **Copie TODO o conteúdo** do arquivo
3. **Cole** no SQL Editor do Supabase
4. Clique em **"Run"** (ou pressione Ctrl+Enter)

### 4️⃣ Verifique o Resultado
Você deve ver uma mensagem de sucesso:
```
status: "Produtos de demonstração inseridos com sucesso!"
total_produtos: 20
```

---

## 📦 O que será criado:

### ✅ 3 Vendedores de Demonstração:
- **Tech Store Pro** - Especialista em tecnologia
- **Fashion House** - Moda e estilo  
- **Home & Living** - Decoração e casa

### ✅ 20 Produtos de Demonstração:

**Eletrônicos (Tech Store Pro):**
1. Fone Bluetooth Premium - R$ 299,90
2. Smart Watch Fitness Pro - R$ 599,90
3. Teclado Mecânico RGB - R$ 449,90
4. Mouse Gamer Wireless - R$ 199,90
5. Webcam Full HD Pro - R$ 279,90
6. Power Bank 20.000mAh - R$ 129,90
7. Câmera de Segurança WiFi - R$ 199,90

**Moda (Fashion House):**
8. Tênis Running Ultra - R$ 349,90
9. Jaqueta Jeans Premium - R$ 249,90
10. Bolsa Executiva Couro - R$ 489,90
11. Óculos de Sol Premium - R$ 189,90
12. Relógio Analógico Clássico - R$ 299,90
13. Mochila Urbana Premium - R$ 229,90
14. Camiseta Premium Básica - R$ 79,90

**Casa (Home & Living):**
15. Luminária LED Inteligente - R$ 159,90
16. Kit Panelas Premium - R$ 399,90
17. Tapete Decorativo Luxo - R$ 599,90
18. Cafeteira Expresso Smart - R$ 899,90
19. Aspirador Robô Inteligente - R$ 1.299,90
20. Conjunto Sofá 3 Lugares - R$ 1.999,90

---

## 🎨 Características dos Produtos:

Cada produto inclui:
- ✅ **Título e descrição** atraentes
- ✅ **Preço** realista
- ✅ **Estoque** variado
- ✅ **Categoria** definida
- ✅ **Imagens** do Unsplash (alta qualidade)
- ✅ **Likes e comentários** simulados
- ✅ **Vendedor** associado

---

## 🚀 Depois de executar o script:

1. **Aguarde ~30 segundos** para o backend do Render reiniciar (se necessário)
2. **Acesse sua aplicação** no Vercel
3. **Clique em "Descobrir"**
4. **Veja os produtos** aparecendo no feed!

---

## ⚠️ Observações Importantes:

### Sobre as senhas dos vendedores:
- Todos os vendedores têm senha: `demo123`
- ⚠️ **MAS**: As senhas estão com hash **fictício** no script
- ✅ **Você NÃO vai conseguir fazer login como esses vendedores**
- ✅ **Os vendedores são apenas para preencher produtos**

### Se quiser fazer login como vendedor:
Use seu próprio usuário e altere o `role` para `'seller'` diretamente no Supabase:

```sql
UPDATE users 
SET role = 'seller', 
    store_name = 'Minha Loja',
    store_description = 'Descrição da minha loja'
WHERE email = 'seu-email@gmail.com';
```

---

## 🔧 Comandos SQL Úteis:

### Ver todos os produtos:
```sql
SELECT id, title, price, category, seller_id FROM products;
```

### Ver total de produtos por categoria:
```sql
SELECT category, COUNT(*) as total 
FROM products 
GROUP BY category;
```

### Deletar todos os produtos de demonstração (se quiser limpar):
```sql
DELETE FROM products WHERE id LIKE 'prod-demo-%';
DELETE FROM users WHERE id LIKE 'demo-seller-%';
```

---

## ✨ Resultado Esperado:

Após executar o script, quando você acessar o feed "Descobrir", verá:
- ✅ **20 produtos** com imagens reais
- ✅ **Scroll infinito** funcionando
- ✅ **Informações do vendedor** em cada produto
- ✅ **Likes e comentários** simulados
- ✅ **Categorias** variadas

---

## 🆘 Problemas Comuns:

### "Erro: duplicate key value violates unique constraint"
**Solução**: Os produtos já foram inseridos antes. Tudo certo!

### "Nenhum produto aparece no feed"
**Soluções**:
1. Verifique se o script foi executado com sucesso
2. Veja se o backend está rodando (Render)
3. Abra o console (F12) e veja se há erros
4. Teste a rota diretamente: `https://product-pit-stop-backend.onrender.com/api/products`

### "As imagens não carregam"
**Solução**: As URLs do Unsplash são públicas e devem funcionar. Se não funcionarem, você pode substituir por outras URLs.

---

**Pronto! Agora execute o script e veja a mágica acontecer! 🎉**
