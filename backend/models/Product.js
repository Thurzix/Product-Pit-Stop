const connection = require('../config/database');

class Product {
  constructor(productData) {
    this.title = productData.title;
    this.description = productData.description;
    this.price = productData.price;
    this.stock = productData.stock || 0;
    this.category = productData.category;
    this.video_url = productData.video_url;
    this.thumbnail = productData.thumbnail;
    this.likes = productData.likes || 0;
    this.comments_count = productData.comments_count || 0;
    this.seller_id = productData.seller_id;
  }

  // Criar novo produto
  static async create(productData) {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO products (title, description, price, stock, category, video_url, thumbnail, seller_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const values = [
        productData.title,
        productData.description,
        productData.price,
        productData.stock || 0,
        productData.category,
        productData.video_url,
        productData.thumbnail,
        productData.seller_id
      ];

      connection.query(query, values, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve({
            id: results.insertId,
            ...productData
          });
        }
      });
    });
  }

  // Buscar produto por ID
  static async findById(id) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT p.*, u.name as seller_name, u.store_name, u.profile_image as seller_image 
        FROM products p 
        JOIN users u ON p.seller_id = u.id 
        WHERE p.id = ?
      `;
      
      connection.query(query, [id], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results.length > 0 ? results[0] : null);
        }
      });
    });
  }

  // Buscar todos os produtos com paginação
  static async findAll(page = 1, limit = 20, category = null, sellerId = null) {
    return new Promise((resolve, reject) => {
      let query = `
        SELECT p.*, u.name as seller_name, u.store_name, u.profile_image as seller_image 
        FROM products p 
        JOIN users u ON p.seller_id = u.id 
      `;
      
      const conditions = [];
      const values = [];

      if (category) {
        conditions.push('p.category = ?');
        values.push(category);
      }

      if (sellerId) {
        conditions.push('p.seller_id = ?');
        values.push(sellerId);
      }

      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }

      query += ' ORDER BY p.posted_at DESC LIMIT ? OFFSET ?';
      
      const offset = (page - 1) * limit;
      values.push(limit, offset);

      connection.query(query, values, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }

  // Buscar produtos por vendedor
  static async findBySeller(sellerId, page = 1, limit = 20) {
    return this.findAll(page, limit, null, sellerId);
  }

  // Atualizar produto
  static async update(id, productData) {
    return new Promise((resolve, reject) => {
      const fields = [];
      const values = [];
      
      // Campos permitidos para atualização
      const allowedFields = ['title', 'description', 'price', 'stock', 'category', 'video_url', 'thumbnail'];
      
      allowedFields.forEach(field => {
        if (productData[field] !== undefined) {
          fields.push(`${field} = ?`);
          values.push(productData[field]);
        }
      });

      if (fields.length === 0) {
        return resolve(null);
      }

      values.push(id);
      const query = `UPDATE products SET ${fields.join(', ')} WHERE id = ?`;
      
      connection.query(query, values, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results.affectedRows > 0);
        }
      });
    });
  }

  // Deletar produto
  static async delete(id, sellerId = null) {
    return new Promise((resolve, reject) => {
      let query = 'DELETE FROM products WHERE id = ?';
      const values = [id];

      // Se fornecido sellerId, garantir que apenas o vendedor pode deletar
      if (sellerId) {
        query += ' AND seller_id = ?';
        values.push(sellerId);
      }
      
      connection.query(query, values, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results.affectedRows > 0);
        }
      });
    });
  }

  // Incrementar likes
  static async incrementLikes(id) {
    return new Promise((resolve, reject) => {
      const query = 'UPDATE products SET likes = likes + 1 WHERE id = ?';
      
      connection.query(query, [id], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results.affectedRows > 0);
        }
      });
    });
  }

  // Incrementar comentários
  static async incrementComments(id) {
    return new Promise((resolve, reject) => {
      const query = 'UPDATE products SET comments_count = comments_count + 1 WHERE id = ?';
      
      connection.query(query, [id], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results.affectedRows > 0);
        }
      });
    });
  }

  // Pesquisar produtos
  static async search(searchTerm, page = 1, limit = 20) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT p.*, u.name as seller_name, u.store_name, u.profile_image as seller_image 
        FROM products p 
        JOIN users u ON p.seller_id = u.id 
        WHERE p.title LIKE ? OR p.description LIKE ? OR p.category LIKE ?
        ORDER BY p.posted_at DESC 
        LIMIT ? OFFSET ?
      `;
      
      const searchPattern = `%${searchTerm}%`;
      const offset = (page - 1) * limit;
      const values = [searchPattern, searchPattern, searchPattern, limit, offset];

      connection.query(query, values, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }
}

module.exports = Product;