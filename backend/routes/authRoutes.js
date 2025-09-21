const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validate, registerSchema, loginSchema } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Rota para registro de usuário - POST /api/auth/register
router.post('/register', validate(registerSchema), async (req, res) => {
  try {
    const { name, email, password, role } = req.validatedData;

    // Verificar se o email já existe
    const emailExists = await User.emailExists(email);
    if (emailExists) {
      return res.status(400).json({
        success: false,
        message: 'Este email já está cadastrado'
      });
    }

    // Criptografar a senha
    const hashedPassword = await User.hashPassword(password);

    // Criar o usuário
    const userData = {
      name,
      email,
      password: hashedPassword,
      role
    };

    const newUser = await User.create(userData);

    // Gerar token JWT
    const token = jwt.sign(
      { 
        userId: newUser.id, 
        email: newUser.email,
        role: newUser.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '24h' }
    );

    res.status(201).json({
      success: true,
      message: 'Usuário cadastrado com sucesso',
      data: {
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role
        },
        token
      }
    });

  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Rota para login de usuário - POST /api/auth/login
router.post('/login', validate(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.validatedData;

    // Buscar usuário por email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email ou senha incorretos'
      });
    }

    // Validar senha
    const isPasswordValid = await User.validatePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email ou senha incorretos'
      });
    }

    // Gerar token JWT
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '24h' }
    );

    res.json({
      success: true,
      message: 'Login realizado com sucesso',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          profile_image: user.profile_image,
          bio: user.bio,
          store_name: user.store_name,
          store_description: user.store_description
        },
        token
      }
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Rota para obter perfil do usuário logado - GET /api/auth/me
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    res.json({
      success: true,
      data: { user }
    });

  } catch (error) {
    console.error('Erro ao obter perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Rota para verificar se token é válido - POST /api/auth/verify
router.post('/verify', authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: 'Token válido',
    data: {
      userId: req.user.userId,
      email: req.user.email,
      role: req.user.role
    }
  });
});

// Rota para logout (invalidar token no frontend) - POST /api/auth/logout
router.post('/logout', authenticateToken, (req, res) => {
  // Como estamos usando JWT stateless, o logout é feito no frontend
  // removendo o token do localStorage/sessionStorage
  res.json({
    success: true,
    message: 'Logout realizado com sucesso'
  });
});

module.exports = router;