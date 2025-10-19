const supabase = require('../config/supabase');

class Product {
  static async findAll() {
    const { data, error } = await supabase.from('products').select('*');
    if (error) throw error;
    return { products: data, total: data.length };
  }
}

module.exports = Product;
