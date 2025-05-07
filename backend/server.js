const express = require("express");
const connection = require("./config/database.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config(); // Carregar variáveis do .env

const app = express();
app.use(express.json()); // Permite receber JSON no corpo da requisição

// Rota de registro
app.post("/api/auth/register", (req, res) => {
  const { nome, email, senha } = req.body;  // 'senha' ao invés de 'password'
  
  console.log("Dados recebidos para registro:", req.body);  // Adicionei um log aqui para inspecionar a requisição

  // Verificar se todos os campos foram preenchidos
  if (!nome || !email || !senha) {  // 'senha' ao invés de 'password'
    return res.status(400).json({ message: "Nome, email e senha são obrigatórios" });
  }

  // Verificar se o email já existe no banco
  connection.query("SELECT email FROM usuarios WHERE email = ?", [email], (err, results) => {
    if (err) {
      console.error("Erro ao verificar email:", err);
      return res.status(500).json({ error: "Erro ao acessar o banco de dados" });
    }

    console.log("Resultado da consulta de email:", results); // Adicionei um log aqui também para ver o que o banco retorna

    if (results.length > 0) {
      return res.status(400).json({ message: "Email já cadastrado" });
    }

    // Criptografar a senha com bcrypt
    bcrypt.hash(senha, 10, (err, hashedPassword) => {  // 'senha' ao invés de 'password'
      if (err) {
        console.error("Erro ao criptografar senha:", err);
        return res.status(500).json({ error: "Erro ao criptografar a senha" });
      }

      console.log("Senha criptografada:", hashedPassword);  // Log da senha criptografada para depuração

      // Inserir o novo usuário no banco de dados
      connection.query(
        "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)", // 'senha' no banco de dados
        [nome, email, hashedPassword],  // 'senha' ao invés de 'password'
        (err, results) => {
          if (err) {
            console.error("Erro ao inserir no banco de dados:", err);
            return res.status(500).json({ error: "Erro ao registrar o usuário" });
          }

          console.log("Usuário registrado com sucesso:", results);  // Log da inserção bem-sucedida

          // Sucesso no cadastro
          res.status(201).json({ message: "Usuário registrado com sucesso!" });
        }
      );
    });
  });
});


// Rota de login
app.post("/api/auth/login", (req, res) => {
  console.log("Requisição recebida:", req.body);

  const { email, senha } = req.body;  // 'senha' ao invés de 'password'

  if (!email || !senha) {  // 'senha' ao invés de 'password'
    return res.status(400).json({ message: "Email e senha são obrigatórios" });
  }

  connection.query("SELECT email, senha FROM usuarios WHERE email = ?", [email], (err, results) => {
    if (err) {
      console.error("Erro ao acessar o banco:", err);
      return res.status(500).json({ error: "Erro ao acessar o banco de dados" });
    }

    console.log("Usuário encontrado:", results);

    if (results.length === 0) {
      return res.status(400).json({ message: "Usuário não encontrado" });
    }

    const user = results[0];

    bcrypt.compare(senha, user.senha, (err, isMatch) => {  // 'senha' ao invés de 'password'
      if (err) {
        console.error("Erro ao comparar senha:", err);
        return res.status(500).json({ error: "Erro ao verificar a senha" });
      }

      if (!isMatch) {
        return res.status(400).json({ message: "Senha incorreta" });
      }

      console.log("Login bem-sucedido!");

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.json({ token });
    });
  });
});

// Teste de conexão com o banco
app.get("/test-db", (req, res) => {
  connection.query("SELECT 1", (err, results) => {
    if (err) {
      console.error("Erro ao conectar ao banco:", err);
      return res.status(500).json({ error: "Erro ao conectar ao banco de dados" });
    }
    res.json({ message: "Conexão com o banco bem-sucedida!" });
  });
});

// Inicialização do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// Rota de teste
app.get("/test", (req, res) => {
  res.send("Rota de teste funcionando!");
});
