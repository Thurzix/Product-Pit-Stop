# TESTES CICLO 2 - Product Pit Stop API

## Collection Postman - Product Pit Stop API (Ciclo 2)

### Configuração Base
- Base URL: `http://localhost:3001`
- Content-Type: `application/json`

---

## 📋 PARTE 1: TESTES DE AUTENTICAÇÃO

### 1. Health Check
**GET** `http://localhost:3001/health`
- **Status esperado**: 200
- **Resposta**: Informações do servidor

### 2. Registro de Usuário
**POST** `http://localhost:3001/api/auth/register`

```json
{
  "name": "João Vendedor",
  "email": "joao@pitstop.com",
  "password": "123456",
  "role": "seller"
}
```

**Resposta esperada (201):**
```json
{
  "success": true,
  "message": "Usuário cadastrado com sucesso",
  "data": {
    "user": {
      "id": 1,
      "name": "João Vendedor",
      "email": "joao@pitstop.com",
      "role": "seller"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3. Login de Usuário
**POST** `http://localhost:3001/api/auth/login`

```json
{
  "email": "joao@pitstop.com",
  "password": "123456"
}
```

**Resposta esperada (200):**
```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "data": {
    "user": {
      "id": 1,
      "name": "João Vendedor",
      "email": "joao@pitstop.com",
      "role": "seller"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**⚠️ IMPORTANTE: Salvar o token retornado para os próximos testes!**

---

## 🛍️ PARTE 2: TESTES DE PRODUTOS (CRUD)

**Headers necessários para rotas protegidas:**
```
Authorization: Bearer {seu_token_aqui}
Content-Type: application/json
```

### 4. Listar Produtos
**GET** `http://localhost:3001/api/products`

**Query Params opcionais:**
- `page=1` (número da página)
- `limit=20` (produtos por página)
- `category=eletrônicos` (filtrar por categoria)

**Resposta esperada (200):**
```json
{
  "success": true,
  "data": {
    "products": []
  }
}
```

### 5. Criar Produto (Autenticado)
**POST** `http://localhost:3001/api/products`

**Headers:**
```
Authorization: Bearer {seu_token}
Content-Type: application/json
```

**Body:**
```json
{
  "title": "iPhone 15 Pro Max",
  "description": "Smartphone Apple iPhone 15 Pro Max 256GB em ótimo estado",
  "price": 5999.99,
  "stock": 5,
  "category": "Eletrônicos",
  "video_url": "https://res.cloudinary.com/demo/video/upload/v123456789/sample.mp4",
  "thumbnail": "https://res.cloudinary.com/demo/image/upload/v123456789/sample.jpg"
}
```

**Resposta esperada (201):**
```json
{
  "success": true,
  "message": "Produto criado com sucesso",
  "data": {
    "product": {
      "id": 1,
      "title": "iPhone 15 Pro Max",
      "description": "Smartphone Apple iPhone 15 Pro Max 256GB em ótimo estado",
      "price": 5999.99,
      "stock": 5,
      "category": "Eletrônicos",
      "video_url": "https://res.cloudinary.com/demo/video/upload/v123456789/sample.mp4",
      "thumbnail": "https://res.cloudinary.com/demo/image/upload/v123456789/sample.jpg",
      "seller_id": 1
    }
  }
}
```

### 6. Obter Produto por ID
**GET** `http://localhost:3001/api/products/1`

**Resposta esperada (200):**
```json
{
  "success": true,
  "data": {
    "product": {
      "id": 1,
      "title": "iPhone 15 Pro Max",
      "seller_name": "João Vendedor",
      "store_name": null,
      "seller_image": null
    }
  }
}
```

### 7. Atualizar Produto (Autenticado)
**PUT** `http://localhost:3001/api/products/1`

**Headers:**
```
Authorization: Bearer {seu_token}
Content-Type: application/json
```

**Body:**
```json
{
  "title": "iPhone 15 Pro Max - NOVO",
  "price": 5799.99,
  "stock": 3
}
```

**Resposta esperada (200):**
```json
{
  "success": true,
  "message": "Produto atualizado com sucesso",
  "data": {
    "product": {
      "id": 1,
      "title": "iPhone 15 Pro Max - NOVO",
      "price": 5799.99,
      "stock": 3
    }
  }
}
```

### 8. Meus Produtos (Autenticado)
**GET** `http://localhost:3001/api/products/my-products`

**Headers:**
```
Authorization: Bearer {seu_token}
```

### 9. Curtir Produto (Autenticado)
**POST** `http://localhost:3001/api/products/1/like`

**Headers:**
```
Authorization: Bearer {seu_token}
```

### 10. Pesquisar Produtos
**GET** `http://localhost:3001/api/products/search/iPhone`

### 11. Deletar Produto (Autenticado)
**DELETE** `http://localhost:3001/api/products/1`

**Headers:**
```
Authorization: Bearer {seu_token}
```

---

## 📤 PARTE 3: TESTES DE UPLOAD

**Headers necessários:**
```
Authorization: Bearer {seu_token}
Content-Type: multipart/form-data
```

### 12. Upload de Vídeo
**POST** `http://localhost:3001/api/upload/video`

**Form Data:**
- `video`: [arquivo de vídeo .mp4, .mov, .avi ou .webm]

**Resposta esperada (200):**
```json
{
  "success": true,
  "message": "Vídeo enviado com sucesso",
  "data": {
    "video_url": "https://res.cloudinary.com/.../video.mp4",
    "thumbnail_url": "https://res.cloudinary.com/.../thumbnail.jpg",
    "public_id": "product-pitstop/videos/abc123",
    "duration": 30.5,
    "format": "mp4",
    "resource_type": "video"
  }
}
```

### 13. Upload de Imagem
**POST** `http://localhost:3001/api/upload/image`

**Form Data:**
- `image`: [arquivo de imagem .jpg, .png, .gif ou .webp]

**Resposta esperada (200):**
```json
{
  "success": true,
  "message": "Imagem enviada com sucesso",
  "data": {
    "image_url": "https://res.cloudinary.com/.../image.jpg",
    "public_id": "product-pitstop/images/def456",
    "width": 800,
    "height": 600,
    "format": "jpg",
    "resource_type": "image"
  }
}
```

### 14. Upload de Produto Completo (Vídeo + Thumbnail)
**POST** `http://localhost:3001/api/upload/product`

**Form Data:**
- `video`: [arquivo de vídeo - obrigatório]
- `thumbnail`: [arquivo de imagem - opcional]

**Resposta esperada (200):**
```json
{
  "success": true,
  "message": "Arquivos enviados com sucesso",
  "data": {
    "video": {
      "url": "https://res.cloudinary.com/.../video.mp4",
      "public_id": "product-pitstop/videos/abc123",
      "duration": 30.5
    },
    "thumbnail": {
      "url": "https://res.cloudinary.com/.../thumbnail.jpg",
      "public_id": "product-pitstop/images/def456",
      "generated": false
    }
  }
}
```

---

## ⚠️ TESTES DE VALIDAÇÃO (devem falhar)

### 15. Criar produto sem autenticação
**POST** `http://localhost:3001/api/products`
**Sem header Authorization**

**Resposta esperada (401):**
```json
{
  "success": false,
  "message": "Token de acesso requerido"
}
```

### 16. Criar produto com dados inválidos
**POST** `http://localhost:3001/api/products`

```json
{
  "title": "",
  "description": "",
  "price": "abc",
  "category": ""
}
```

**Resposta esperada (400):**
```json
{
  "success": false,
  "message": "Campos obrigatórios: title, description, price, category, video_url"
}
```

### 17. Editar produto de outro usuário
**PUT** `http://localhost:3001/api/products/{id_de_outro_usuario}`

**Resposta esperada (403):**
```json
{
  "success": false,
  "message": "Você não tem permissão para editar este produto"
}
```

---

## 🔧 CONFIGURAÇÃO CLOUDINARY

Para testar uploads, você precisará configurar uma conta gratuita no Cloudinary:

1. **Criar conta**: https://cloudinary.com/users/register/free
2. **Obter credenciais**: Dashboard > Settings > Security
3. **Configurar no .env**:
   ```
   CLOUDINARY_CLOUD_NAME=seu_cloud_name
   CLOUDINARY_API_KEY=sua_api_key
   CLOUDINARY_API_SECRET=seu_api_secret
   ```

---

## 📊 STATUS DOS TESTES

- ✅ **Servidor funcionando**: Porta 3001
- ✅ **Autenticação**: Register/Login implementados
- ✅ **CRUD Produtos**: Todas as rotas criadas
- ✅ **Upload Service**: Cloudinary configurado
- ⚠️ **MySQL**: Precisa configurar credenciais
- ⚠️ **Cloudinary**: Precisa configurar conta gratuita

## 📝 OBSERVAÇÕES

- **Backend funciona mesmo sem MySQL** para testes básicos de estrutura
- **Upload funciona apenas com Cloudinary configurado**
- **Frontend integrado** com as novas APIs de autenticação
- **CORS configurado** para permitir frontend localhost