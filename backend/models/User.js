const connection = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  constructor(userData) {
    this.name = userData.name;
    this.email = userData.email;
    this.password = userData.password;
    this.role = userData.role || 'buyer';
    this.profile_image = userData.profile_image || null;
    this.bio = userData.bio || null;
    this.phone = userData.phone || null;
    this.store_name = userData.store_name || null;
    this.store_description = userData.store_description || null;
    this.preferences = userData.preferences || null;
    this.wishlist = userData.wishlist || null;
  }

  // Criar novo usuário
  static async create(userData) {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO users (name, email, password, role, profile_image, bio, phone, store_name, store_description, preferences, wishlist) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const values = [
        userData.name,
        userData.email,
        userData.password,
        userData.role,
        userData.profile_image,
        userData.bio,
        userData.phone,
        userData.store_name,
        userData.store_description,
        userData.preferences ? JSON.stringify(userData.preferences) : null,
        userData.wishlist ? JSON.stringify(userData.wishlist) : null
      ];

      connection.query(query, values, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve({
            id: results.insertId,
            ...userData,
            password: undefined // Não retornar a senha
          });
        }
      });
    });
  }

  // Buscar usuário por email
  static async findByEmail(email) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM users WHERE email = ?';
      
      connection.query(query, [email], (err, results) => {
        if (err) {
          reject(err);
        } else {
          if (results.length > 0) {
            const user = results[0];
            // Parse JSON fields
            if (user.preferences) {
              user.preferences = JSON.parse(user.preferences);
            }
            if (user.wishlist) {
              user.wishlist = JSON.parse(user.wishlist);
            }
            resolve(user);
          } else {
            resolve(null);
          }
        }
      });
    });
  }

  // Buscar usuário por ID
  static async findById(id) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM users WHERE id = ?';
      
      connection.query(query, [id], (err, results) => {
        if (err) {
          reject(err);
        } else {
          if (results.length > 0) {
            const user = results[0];
            // Parse JSON fields
            if (user.preferences) {
              user.preferences = JSON.parse(user.preferences);
            }
            if (user.wishlist) {
              user.wishlist = JSON.parse(user.wishlist);
            }
            // Remover senha do retorno
            delete user.password;
            resolve(user);
          } else {
            resolve(null);
          }
        }
      });
    });
  }

  // Verificar se email já existe
  static async emailExists(email) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT COUNT(*) as count FROM users WHERE email = ?';
      
      connection.query(query, [email], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results[0].count > 0);
        }
      });
    });
  }

  // Validar senha
  static async validatePassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  // Hash da senha
  static async hashPassword(password) {
    return bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS) || 10);
  }

  // Atualizar usuário
  static async update(id, userData) {
    return new Promise((resolve, reject) => {
      const fields = [];
      const values = [];
      
      // Campos permitidos para atualização
      const allowedFields = ['name', 'profile_image', 'bio', 'phone', 'store_name', 'store_description', 'preferences', 'wishlist'];
      
      allowedFields.forEach(field => {
        if (userData[field] !== undefined) {
          fields.push(`${field} = ?`);
          if (field === 'preferences' || field === 'wishlist') {
            values.push(userData[field] ? JSON.stringify(userData[field]) : null);
          } else {
            values.push(userData[field]);
          }
        }
      });

      if (fields.length === 0) {
        return resolve(null);
      }

      values.push(id);
      const query = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
      
      connection.query(query, values, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results.affectedRows > 0);
        }
      });
    });
  }
}

module.exports = User;