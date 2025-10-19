const supabase = require('../config/supabase');
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
    const { data, error } = await supabase
      .from('users')
      .insert([{
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: userData.role || 'buyer',
        profile_image: userData.profile_image || null,
        bio: userData.bio || null,
        phone: userData.phone || null,
        store_name: userData.store_name || null,
        store_description: userData.store_description || null,
        preferences: userData.preferences || [],
        wishlist: userData.wishlist || []
      }])
      .select()
      .single();

    if (error) throw error;

    // Remover senha do retorno
    const { password, ...userWithoutPassword } = data;
    return userWithoutPassword;
  }

  // Buscar usuário por email
  static async findByEmail(email) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Nenhum registro encontrado
        return null;
      }
      throw error;
    }

    return data;
  }

  // Buscar usuário por ID
  static async findById(id) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }

    // Remover senha do retorno
    const { password, ...userWithoutPassword } = data;
    return userWithoutPassword;
  }

  // Verificar se email já existe
  static async emailExists(email) {
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (error && error.code === 'PGRST116') {
      return false; // Email não existe
    }

    return data !== null;
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
    const updateData = {};
    
    // Campos permitidos para atualização
    const allowedFields = ['name', 'profile_image', 'bio', 'phone', 'store_name', 'store_description', 'preferences', 'wishlist'];
    
    allowedFields.forEach(field => {
      if (userData[field] !== undefined) {
        updateData[field] = userData[field];
      }
    });

    if (Object.keys(updateData).length === 0) {
      return null;
    }

    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Remover senha do retorno
    const { password, ...userWithoutPassword } = data;
    return userWithoutPassword;
  }
}

module.exports = User;