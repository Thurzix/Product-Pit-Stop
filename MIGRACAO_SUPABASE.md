# 🔄 GUIA RÁPIDO - MIGRAÇÃO SUPABASE

## ✅ JÁ CONCLUÍDO:

1. ✅ **package.json** - Atualizado (mysql2 → @supabase/supabase-js)
2. ✅ **config/supabase.js** - Cliente Supabase criado
3. ✅ **.env** - Variáveis atualizadas
4. ✅ **database/schema-supabase.sql** - Schema PostgreSQL criado

---

## ⏳ FALTA FAZER:

### 1. **Instalar Dependências**
```bash
cd backend
npm install
```

### 2. **Configurar Supabase**

1. Acesse: https://supabase.com
2. Crie novo projeto
3. Copie:
   - **URL**: `https://xyz.supabase.co`
   - **anon key**: `eyJhbGciOiJIUzI1...`

4. Atualize `.env`:
```env
SUPABASE_URL=sua_url_aqui
SUPABASE_ANON_KEY=sua_key_aqui
```

### 3. **Executar Schema no Supabase**

1. Supabase Dashboard → SQL Editor
2. Copie todo o conteúdo de `backend/database/schema-supabase.sql`
3. Cole e execute (RUN)

### 4. **Atualizar server-new.js**

Trocar:
```javascript
require('./config/database');
```

Por:
```javascript
require('./config/supabase');
```

### 5. **Atualizar Rotas**

Todas as rotas precisam trocar queries SQL por Supabase client:

**ANTES (MySQL):**
```javascript
connection.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
  // ...
});
```

**DEPOIS (Supabase):**
```javascript
const { data, error } = await supabase
  .from('users')
  .select('*')
  .eq('id', id)
  .single();
```

---

## 📝 PADRÕES SUPABASE:

### **SELECT:**
```javascript
// Buscar todos
const { data } = await supabase.from('products').select('*');

// Buscar por ID
const { data } = await supabase
  .from('products')
  .select('*')
  .eq('id', 1)
  .single();

// Com join
const { data } = await supabase
  .from('products')
  .select(`
    *,
    seller:users!seller_id(name, store_name)
  `);

// Com filtros
const { data } = await supabase
  .from('products')
  .select('*')
  .eq('category', 'tech')
  .gte('price', 100)
  .order('created_at', { ascending: false })
  .limit(10);
```

### **INSERT:**
```javascript
const { data, error } = await supabase
  .from('products')
  .insert([{ title: 'Produto', price: 99.99 }])
  .select()
  .single();
```

### **UPDATE:**
```javascript
const { data, error } = await supabase
  .from('products')
  .update({ price: 89.99 })
  .eq('id', 1);
```

### **DELETE:**
```javascript
const { error } = await supabase
  .from('products')
  .delete()
  .eq('id', 1);
```

---

## 🎯 ARQUIVOS QUE PRECISAM ATUALIZAR:

- [x] backend/package.json
- [x] backend/.env
- [x] backend/config/supabase.js
- [x] backend/database/schema-supabase.sql
- [x] backend/models/users.js (atualizado)
- [ ] backend/models/Product.js (remover e recriar)
- [ ] backend/routes/authRoutes.js
- [ ] backend/routes/productRoutes.js
- [ ] backend/routes/cartRoutes.js
- [ ] backend/routes/messageRoutes.js
- [ ] backend/server-new.js (mudar import)

---

## 🚀 TESTAR:

```bash
cd backend
node server-new.js
```

Deve aparecer:
```
✅ Conexão com Supabase estabelecida com sucesso!
🚀 Servidor Product Pit Stop rodando na porta 3001
```

---

## 📚 DOCS:

- Supabase JS: https://supabase.com/docs/reference/javascript/introduction
- PostgreSQL vs MySQL: https://supabase.com/docs/guides/database

---

**Quer que eu continue migrando as rotas ou prefere fazer manualmente?**