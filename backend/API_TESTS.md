# Testes das APIs do Product Pit Stop Backend

## Collection Postman - Product Pit Stop API

### Configuração Base
- Base URL: `http://localhost:3001`
- Content-Type: `application/json`

### Testes para realizar:

## 1. Health Check
**GET** `http://localhost:3001/health`
- Deve retornar status 200 com informações do servidor

## 2. Registro de Usuário
**POST** `http://localhost:3001/api/auth/register`

```json
{
  "name": "Teste Usuario",
  "email": "teste@email.com",
  "password": "123456",
  "role": "buyer"
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
      "name": "Teste Usuario",
      "email": "teste@email.com",
      "role": "buyer"
    },
    "token": "jwt_token_aqui"
  }
}
```

## 3. Login de Usuário
**POST** `http://localhost:3001/api/auth/login`

```json
{
  "email": "teste@email.com",
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
      "name": "Teste Usuario",
      "email": "teste@email.com",
      "role": "buyer"
    },
    "token": "jwt_token_aqui"
  }
}
```

## 4. Verificar Perfil (Autenticado)
**GET** `http://localhost:3001/api/auth/me`

**Headers:**
```
Authorization: Bearer {token_do_login}
```

**Resposta esperada (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "Teste Usuario",
      "email": "teste@email.com",
      "role": "buyer"
    }
  }
}
```

## 5. Verificar Token
**POST** `http://localhost:3001/api/auth/verify`

**Headers:**
```
Authorization: Bearer {token_do_login}
```

**Resposta esperada (200):**
```json
{
  "success": true,
  "message": "Token válido",
  "data": {
    "userId": 1,
    "email": "teste@email.com",
    "role": "buyer"
  }
}
```

## 6. Listar Produtos
**GET** `http://localhost:3001/api/products`

**Resposta esperada (200):**
```json
{
  "success": true,
  "data": {
    "products": []
  }
}
```

## Testes de Validação (devem falhar):

### 7. Registro com dados inválidos
**POST** `http://localhost:3001/api/auth/register`

```json
{
  "name": "",
  "email": "email_inválido",
  "password": "123"
}
```

**Resposta esperada (400):**
```json
{
  "success": false,
  "message": "Dados inválidos",
  "errors": [
    "Nome é obrigatório",
    "Email deve ter um formato válido",
    "Senha deve ter pelo menos 6 caracteres"
  ]
}
```

### 8. Login com credenciais incorretas
**POST** `http://localhost:3001/api/auth/login`

```json
{
  "email": "inexistente@email.com",
  "password": "senhaerrada"
}
```

**Resposta esperada (401):**
```json
{
  "success": false,
  "message": "Email ou senha incorretos"
}
```

### 9. Acessar rota protegida sem token
**GET** `http://localhost:3001/api/auth/me`

**Resposta esperada (401):**
```json
{
  "success": false,
  "message": "Token de acesso requerido"
}
```

## Observações:
- Para testar completamente, seria necessário configurar o MySQL com as credenciais corretas
- Atualmente o servidor funciona mesmo sem banco, retornará erros adequados para operações que precisam do banco
- Todas as rotas de autenticação e validação funcionam independentemente do banco
- As rotas de produtos precisarão do banco configurado para funcionar corretamente