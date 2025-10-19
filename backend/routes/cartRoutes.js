const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { authenticateToken } = require('../middleware/auth');

// GET /api/cart - Buscar itens do carrinho do usuário
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const { data: cartItems, error } = await supabase
      .from('cart_items')
      .select(`
        id,
        product_id,
        quantity,
        added_at,
        products:product_id (
          title,
          description,
          price,
          thumbnail,
          stock,
          users:seller_id (
            name,
            store_name
          )
        )
      `)
      .eq('user_id', userId)
      .order('added_at', { ascending: false });

    if (error) throw error;

    // Formatar dados para corresponder ao formato esperado
    const formattedItems = cartItems.map(item => ({
      id: item.id,
      product_id: item.product_id,
      quantity: item.quantity,
      added_at: item.added_at,
      title: item.products.title,
      description: item.products.description,
      price: item.products.price,
      thumbnail: item.products.thumbnail,
      stock: item.products.stock,
      seller_name: item.products.users.name,
      store_name: item.products.users.store_name
    }));
    
    // Calcular total
    const total = formattedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    res.json({
      success: true,
      data: {
        items: formattedItems,
        total: total,
        count: formattedItems.length
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

    // Verificar se o produto existe
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id, stock')
      .eq('id', product_id)
      .single();

    if (productError || !product) {
      return res.status(404).json({
        success: false,
        error: 'Produto não encontrado'
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        error: 'Estoque insuficiente'
      });
    }

    // Verificar se item já existe no carrinho
    const { data: existingItem, error: checkError } = await supabase
      .from('cart_items')
      .select('id, quantity')
      .eq('user_id', userId)
      .eq('product_id', product_id)
      .single();

    if (existingItem) {
      // Atualizar quantidade
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity > product.stock) {
        return res.status(400).json({
          success: false,
          error: 'Quantidade solicitada excede o estoque disponível'
        });
      }

      const { error: updateError } = await supabase
        .from('cart_items')
        .update({ quantity: newQuantity })
        .eq('id', existingItem.id);

      if (updateError) throw updateError;
    } else {
      // Inserir novo item
      const { error: insertError } = await supabase
        .from('cart_items')
        .insert([{
          user_id: userId,
          product_id: product_id,
          quantity: quantity
        }]);

      if (insertError) throw insertError;
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

    // Verificar se o item pertence ao usuário e pegar o estoque
    const { data: cartItem, error: cartError } = await supabase
      .from('cart_items')
      .select(`
        id,
        quantity,
        products:product_id (stock)
      `)
      .eq('id', cartItemId)
      .eq('user_id', userId)
      .single();

    if (cartError || !cartItem) {
      return res.status(404).json({
        success: false,
        error: 'Item do carrinho não encontrado'
      });
    }

    if (quantity > cartItem.products.stock) {
      return res.status(400).json({
        success: false,
        error: 'Quantidade solicitada excede o estoque disponível'
      });
    }

    const { error: updateError } = await supabase
      .from('cart_items')
      .update({ quantity: quantity })
      .eq('id', cartItemId);

    if (updateError) throw updateError;

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

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', cartItemId)
      .eq('user_id', userId);

    if (error) throw error;

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

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;

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