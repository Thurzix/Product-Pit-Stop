// backend/routes/authRoutes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users'); // Modelo do usuário

const router = express.Router();

// Rota para login de usuário
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Verificar se o usuário existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Usuário não encontrado' });
    }

    // 2. Verificar a senha (usando bcrypt)
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Senha incorreta' });
    }

    // 3. Gerar um token JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      'secrettoken', // Chave secreta (coloque em uma variável de ambiente)
      { expiresIn: '1h' } // O token expira em 1 hora
    );

    // 4. Enviar o token para o cliente
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

module.exports = router;
