const express = require('express');
const Product = require('../models/Product');
const { authenticateToken, requireSeller } = require('../middleware/auth');

const router = express.Router();

// Rota para obter todos os produtos - GET /api/products
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const category = req.query.category || null;
    
    const products = await Product.findAll(page, limit, category);
    
    res.json({
      success: true,
      data: { products }
    });

  } catch (error) {
    console.error('Erro ao obter produtos:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Rota para obter produto por ID - GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }
    
    res.json({
      success: true,
      data: { product }
    });

  } catch (error) {
    console.error('Erro ao obter produto:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Rota para pesquisar produtos - GET /api/products/search?q=termo
router.get('/search/:searchTerm', async (req, res) => {
  try {
    const searchTerm = req.params.searchTerm;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    
    const products = await Product.search(searchTerm, page, limit);
    
    res.json({
      success: true,
      data: { products }
    });

  } catch (error) {
    console.error('Erro ao pesquisar produtos:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

module.exports = router;
