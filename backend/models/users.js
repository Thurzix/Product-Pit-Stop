const supabase = require('../config/supabase');

class User {
  // Criar novo usuário
  static async create(userData) {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Buscar usuário por ID
  static async findById(id) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  // Buscar usuário por email
  static async findByEmail(email) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = não encontrado
    return data;
  }

  // Atualizar usuário
  static async update(id, userData) {
    const { data, error } = await supabase
      .from('users')
      .update(userData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Deletar usuário
  static async delete(id) {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }

  // Listar todos os usuários (com paginação)
  static async findAll(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    
    const { data, error, count } = await supabase
      .from('users')
      .select('*', { count: 'exact' })
      .range(offset, offset + limit - 1);
    
    if (error) throw error;
    return { users: data, total: count };
  }

  // Buscar vendedores
  static async findSellers() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'seller');
    
    if (error) throw error;
    return data;
  }
}

module.exports = User;

