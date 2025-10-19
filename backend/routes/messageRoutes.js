const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { authenticateToken } = require('../middleware/auth');

// GET /api/messages - Buscar conversas do usuário
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Buscar todas as conversas onde o usuário é remetente ou destinatário
    const query = `
      SELECT DISTINCT
        CASE 
          WHEN m.sender_id = ? THEN m.recipient_id 
          ELSE m.sender_id 
        END as contact_id,
        u.name as contact_name,
        u.profile_image as contact_image,
        u.store_name as contact_store,
        MAX(m.created_at) as last_message_time,
        (
          SELECT content 
          FROM messages 
          WHERE (sender_id = userId AND recipient_id = contact_id) 
             OR (sender_id = contact_id AND recipient_id = userId)
          ORDER BY created_at DESC 
          LIMIT 1
        ) as last_message_content,
        (
          SELECT COUNT(*) 
          FROM messages 
          WHERE recipient_id = ? AND sender_id = contact_id AND is_read = FALSE
        ) as unread_count
      FROM messages m
      JOIN users u ON u.id = CASE 
        WHEN m.sender_id = ? THEN m.recipient_id 
        ELSE m.sender_id 
      END
      WHERE m.sender_id = ? OR m.recipient_id = ?
      GROUP BY contact_id, u.name, u.profile_image, u.store_name
      ORDER BY last_message_time DESC
    `;
    
    const [conversations] = await db.execute(query, [userId, userId, userId, userId, userId]);
    
    res.json({
      success: true,
      data: { conversations }
    });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// GET /api/messages/:contactId - Buscar mensagens de uma conversa específica
router.get('/:contactId', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const contactId = req.params.contactId;
    
    const query = `
      SELECT 
        m.id,
        m.sender_id,
        m.recipient_id,
        m.product_id,
        m.content,
        m.is_read,
        m.created_at,
        u.name as sender_name,
        u.profile_image as sender_image
      FROM messages m
      JOIN users u ON u.id = m.sender_id
      WHERE (m.sender_id = ? AND m.recipient_id = ?) 
         OR (m.sender_id = ? AND m.recipient_id = ?)
      ORDER BY m.created_at ASC
    `;
    
    const [messages] = await db.execute(query, [userId, contactId, contactId, userId]);
    
    // Marcar mensagens como lidas
    await db.execute(
      'UPDATE messages SET is_read = TRUE WHERE sender_id = ? AND recipient_id = ? AND is_read = FALSE',
      [contactId, userId]
    );
    
    res.json({
      success: true,
      data: { messages }
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// POST /api/messages - Enviar nova mensagem
router.post('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { recipient_id, content, product_id } = req.body;

    if (!recipient_id || !content) {
      return res.status(400).json({
        success: false,
        error: 'recipient_id e content são obrigatórios'
      });
    }

    // Verificar se o destinatário existe
    const [recipients] = await db.execute(
      'SELECT id FROM users WHERE id = ?',
      [recipient_id]
    );

    if (recipients.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Usuário destinatário não encontrado'
      });
    }

    // Inserir mensagem
    const [result] = await db.execute(
      'INSERT INTO messages (sender_id, recipient_id, product_id, content) VALUES (?, ?, ?, ?)',
      [userId, recipient_id, product_id || null, content]
    );

    // Buscar a mensagem criada com dados do remetente
    const [newMessage] = await db.execute(
      `SELECT 
        m.id,
        m.sender_id,
        m.recipient_id,
        m.product_id,
        m.content,
        m.is_read,
        m.created_at,
        u.name as sender_name,
        u.profile_image as sender_image
      FROM messages m
      JOIN users u ON u.id = m.sender_id
      WHERE m.id = ?`,
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      data: { message: newMessage[0] }
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// PUT /api/messages/:id/read - Marcar mensagem como lida
router.put('/:id/read', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const messageId = req.params.id;

    // Verificar se a mensagem pertence ao usuário (como destinatário)
    const [messages] = await db.execute(
      'SELECT id FROM messages WHERE id = ? AND recipient_id = ?',
      [messageId, userId]
    );

    if (messages.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Mensagem não encontrada'
      });
    }

    // Marcar como lida
    await db.execute(
      'UPDATE messages SET is_read = TRUE WHERE id = ?',
      [messageId]
    );

    res.json({
      success: true,
      message: 'Mensagem marcada como lida'
    });
  } catch (error) {
    console.error('Error marking message as read:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

// GET /api/messages/unread/count - Contar mensagens não lidas
router.get('/unread/count', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const [result] = await db.execute(
      'SELECT COUNT(*) as unread_count FROM messages WHERE recipient_id = ? AND is_read = FALSE',
      [userId]
    );

    res.json({
      success: true,
      data: { unread_count: result[0].unread_count }
    });
  } catch (error) {
    console.error('Error counting unread messages:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
});

module.exports = router;