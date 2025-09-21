const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

// GET /api/cart - Buscar itens do carrinho do usuário
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const query = `
      SELECT 
        ci.id,
        ci.product_id,
        ci.quantity,
        ci.added_at,
        p.title,
        p.description,
        p.price,
        p.thumbnail,
        p.stock,
        u.name as seller_name,
        u.store_name
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      JOIN users u ON p.seller_id = u.id
      WHERE ci.user_id = ?
      ORDER BY ci.added_at DESC
    `;
    
    const [cartItems] = await db.execute(query, [userId]);
    
    // Calculate total
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    res.json({
      success: true,
      data: {
        items: cartItems,
        total: total,
        count: cartItems.length
      }
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// POST /api/cart - Adicionar item ao carrinho
router.post('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { product_id, quantity = 1 } = req.body;

    if (!product_id) {
      return res.status(400).json({
        success: false,
        error: 'product_id é obrigatório'
      });
    }

    // Check if product exists
    const [products] = await db.execute(
      'SELECT id, stock FROM products WHERE id = ?',
      [product_id]
    );

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Produto não encontrado'
      });
    }

    const product = products[0];
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        error: 'Estoque insuficiente'
      });
    }

    // Check if item already exists in cart
    const [existingItems] = await db.execute(
      'SELECT id, quantity FROM cart_items WHERE user_id = ? AND product_id = ?',
      [userId, product_id]
    );

    if (existingItems.length > 0) {
      // Update quantity
      const newQuantity = existingItems[0].quantity + quantity;
      if (newQuantity > product.stock) {
        return res.status(400).json({
          success: false,
          error: 'Quantidade solicitada excede o estoque disponível'
        });
      }

      await db.execute(
        'UPDATE cart_items SET quantity = ? WHERE id = ?',
        [newQuantity, existingItems[0].id]
      );
    } else {
      // Insert new item
      await db.execute(
        'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)',
        [userId, product_id, quantity]
      );
    }

    res.status(201).json({
      success: true,
      message: 'Item adicionado ao carrinho com sucesso'
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// PUT /api/cart/:id - Atualizar quantidade do item no carrinho
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const cartItemId = req.params.id;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        error: 'Quantidade deve ser maior que zero'
      });
    }

    // Check if cart item belongs to user
    const [cartItems] = await db.execute(
      `SELECT ci.*, p.stock FROM cart_items ci 
       JOIN products p ON ci.product_id = p.id 
       WHERE ci.id = ? AND ci.user_id = ?`,
      [cartItemId, userId]
    );

    if (cartItems.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Item do carrinho não encontrado'
      });
    }

    const cartItem = cartItems[0];
    if (quantity > cartItem.stock) {
      return res.status(400).json({
        success: false,
        error: 'Quantidade solicitada excede o estoque disponível'
      });
    }

    await db.execute(
      'UPDATE cart_items SET quantity = ? WHERE id = ?',
      [quantity, cartItemId]
    );

    res.json({
      success: true,
      message: 'Quantidade atualizada com sucesso'
    });
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// DELETE /api/cart/:id - Remover item do carrinho
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const cartItemId = req.params.id;

    const [result] = await db.execute(
      'DELETE FROM cart_items WHERE id = ? AND user_id = ?',
      [cartItemId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Item do carrinho não encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Item removido do carrinho com sucesso'
    });
  } catch (error) {
    console.error('Error removing cart item:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// DELETE /api/cart - Limpar todo o carrinho
router.delete('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    await db.execute('DELETE FROM cart_items WHERE user_id = ?', [userId]);

    res.json({
      success: true,
      message: 'Carrinho limpo com sucesso'
    });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

module.exports = router;