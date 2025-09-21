const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // limite de requests por IP
});

// Middleware de segurança
app.use(helmet({
  contentSecurityPolicy: false, // Desabilitar CSP para desenvolvimento
}));

app.use(limiter);
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Product Pit Stop API está funcionando!',
    timestamp: new Date().toISOString()
  });
});

// Mock de dados para demonstração
const mockProducts = [
  {
    id: 1,
    name: "Smartphone Premium",
    price: 899.99,
    description: "O melhor smartphone do mercado com câmera profissional",
    image_url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300",
    video_url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    seller_id: 1,
    category: "Eletrônicos",
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    name: "Tênis Esportivo",
    price: 199.99,
    description: "Tênis confortável para corrida e atividades físicas",
    image_url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300",
    video_url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    seller_id: 2,
    category: "Esportes",
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    name: "Notebook Gaming",
    price: 2499.99,
    description: "Notebook para jogos com placa de vídeo dedicada",
    image_url: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300",
    video_url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    seller_id: 1,
    category: "Eletrônicos",
    created_at: new Date().toISOString()
  }
];

// Mock de usuários
const mockUsers = [
  {
    id: 1,
    email: "demo@pitstop.com",
    password: "123456", // Em produção seria hasheado
    name: "Usuário Demo",
    is_seller: true
  }
];

// Mock de carrinho
let mockCart = [];

// API Routes
app.get('/api/products', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  const products = mockProducts.slice(startIndex, endIndex);
  
  res.json({
    products,
    totalProducts: mockProducts.length,
    currentPage: page,
    totalPages: Math.ceil(mockProducts.length / limit),
    hasMore: endIndex < mockProducts.length
  });
});

app.get('/api/products/:id', (req, res) => {
  const product = mockProducts.find(p => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({ error: 'Produto não encontrado' });
  }
  res.json(product);
});

// Auth routes (mock)
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = mockUsers.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }
  
  res.json({
    token: 'mock-jwt-token',
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      is_seller: user.is_seller
    }
  });
});

app.post('/api/auth/register', (req, res) => {
  const { email, password, name } = req.body;
  
  const newUser = {
    id: mockUsers.length + 1,
    email,
    password,
    name,
    is_seller: false
  };
  
  mockUsers.push(newUser);
  
  res.status(201).json({
    token: 'mock-jwt-token',
    user: {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      is_seller: newUser.is_seller
    }
  });
});

// Cart routes
app.get('/api/cart', (req, res) => {
  const cartWithProducts = mockCart.map(item => ({
    ...item,
    product: mockProducts.find(p => p.id === item.product_id)
  }));
  
  res.json(cartWithProducts);
});

app.post('/api/cart', (req, res) => {
  const { product_id, quantity = 1 } = req.body;
  
  const existingItem = mockCart.find(item => item.product_id === product_id);
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    mockCart.push({
      id: mockCart.length + 1,
      product_id,
      quantity,
      user_id: 1 // Mock user
    });
  }
  
  res.status(201).json({ message: 'Produto adicionado ao carrinho' });
});

app.put('/api/cart/:id', (req, res) => {
  const { quantity } = req.body;
  const item = mockCart.find(item => item.id === parseInt(req.params.id));
  
  if (!item) {
    return res.status(404).json({ error: 'Item não encontrado' });
  }
  
  item.quantity = quantity;
  res.json({ message: 'Quantidade atualizada' });
});

app.delete('/api/cart/:id', (req, res) => {
  const index = mockCart.findIndex(item => item.id === parseInt(req.params.id));
  
  if (index === -1) {
    return res.status(404).json({ error: 'Item não encontrado' });
  }
  
  mockCart.splice(index, 1);
  res.json({ message: 'Item removido do carrinho' });
});

app.delete('/api/cart', (req, res) => {
  mockCart = [];
  res.json({ message: 'Carrinho limpo' });
});

// Messages routes (mock)
app.get('/api/messages/conversations', (req, res) => {
  res.json([
    {
      id: 1,
      other_user_id: 2,
      other_user_name: "Vendedor Demo",
      last_message: "Olá! Em que posso ajudá-lo?",
      last_message_time: new Date().toISOString(),
      unread_count: 1
    }
  ]);
});

app.get('/api/messages/:userId', (req, res) => {
  res.json([
    {
      id: 1,
      sender_id: 2,
      receiver_id: 1,
      content: "Olá! Em que posso ajudá-lo?",
      created_at: new Date().toISOString(),
      is_read: false
    }
  ]);
});

app.post('/api/messages', (req, res) => {
  const { receiver_id, content } = req.body;
  
  res.status(201).json({
    id: Date.now(),
    sender_id: 1,
    receiver_id,
    content,
    created_at: new Date().toISOString(),
    is_read: false
  });
});

// Upload route (mock)
app.post('/api/upload', (req, res) => {
  res.json({
    url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    public_id: 'mock_upload_' + Date.now()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Erro no servidor:', err);
  res.status(500).json({ 
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Algo deu errado'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint não encontrado' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Servidor Product Pit Stop rodando na porta ${PORT}`);
  console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`📦 API Mock funcionando com dados de demonstração`);
});

module.exports = app;