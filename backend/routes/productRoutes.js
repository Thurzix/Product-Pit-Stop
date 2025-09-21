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

// Rota para criar produto - POST /api/products
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, description, price, stock, category, video_url, thumbnail } = req.body;
    
    // Validação básica
    if (!title || !description || !price || !category || !video_url) {
      return res.status(400).json({
        success: false,
        message: 'Campos obrigatórios: title, description, price, category, video_url'
      });
    }

    const productData = {
      title,
      description,
      price: parseFloat(price),
      stock: stock ? parseInt(stock) : 0,
      category,
      video_url,
      thumbnail,
      seller_id: req.user.userId
    };

    const newProduct = await Product.create(productData);
    
    res.status(201).json({
      success: true,
      message: 'Produto criado com sucesso',
      data: { product: newProduct }
    });

  } catch (error) {
    console.error('Erro ao criar produto:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
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

// Rota para atualizar produto - PUT /api/products/:id
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const productId = req.params.id;
    const { title, description, price, stock, category, video_url, thumbnail } = req.body;
    
    // Verificar se o produto existe e se pertence ao usuário
    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }

    // Verificar se o usuário é o vendedor do produto (ou admin no futuro)
    if (existingProduct.seller_id !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Você não tem permissão para editar este produto'
      });
    }

    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (price) updateData.price = parseFloat(price);
    if (stock !== undefined) updateData.stock = parseInt(stock);
    if (category) updateData.category = category;
    if (video_url) updateData.video_url = video_url;
    if (thumbnail) updateData.thumbnail = thumbnail;

    const updated = await Product.update(productId, updateData);
    
    if (updated) {
      const updatedProduct = await Product.findById(productId);
      res.json({
        success: true,
        message: 'Produto atualizado com sucesso',
        data: { product: updatedProduct }
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Nenhuma alteração foi feita'
      });
    }

  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Rota para deletar produto - DELETE /api/products/:id
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const productId = req.params.id;
    
    // Verificar se o produto existe e se pertence ao usuário
    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }

    // Verificar se o usuário é o vendedor do produto (ou admin no futuro)
    if (existingProduct.seller_id !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Você não tem permissão para deletar este produto'
      });
    }

    const deleted = await Product.delete(productId, req.user.userId);
    
    if (deleted) {
      res.json({
        success: true,
        message: 'Produto deletado com sucesso'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Não foi possível deletar o produto'
      });
    }

  } catch (error) {
    console.error('Erro ao deletar produto:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Rota para obter produtos por vendedor - GET /api/products/seller/:sellerId
router.get('/seller/:sellerId', async (req, res) => {
  try {
    const sellerId = req.params.sellerId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    
    const products = await Product.findBySeller(sellerId, page, limit);
    
    res.json({
      success: true,
      data: { products }
    });

  } catch (error) {
    console.error('Erro ao obter produtos do vendedor:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Rota para obter produtos do usuário logado - GET /api/products/my-products
router.get('/my-products', authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    
    const products = await Product.findBySeller(req.user.userId, page, limit);
    
    res.json({
      success: true,
      data: { products }
    });

  } catch (error) {
    console.error('Erro ao obter meus produtos:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Rota para pesquisar produtos - GET /api/products/search/:searchTerm
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

// Rota para curtir produto - POST /api/products/:id/like
router.post('/:id/like', authenticateToken, async (req, res) => {
  try {
    const productId = req.params.id;
    
    // Verificar se o produto existe
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }

    // Incrementar likes do produto
    await Product.incrementLikes(productId);
    
    res.json({
      success: true,
      message: 'Produto curtido com sucesso'
    });

  } catch (error) {
    console.error('Erro ao curtir produto:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

module.exports = router;
