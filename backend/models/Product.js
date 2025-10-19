const supabase = require('../config/supabase');

class Product {
  /**
   * Busca todos os produtos com paginação e filtro opcional por categoria
   * @param {number} page - Número da página (padrão: 1)
   * @param {number} limit - Itens por página (padrão: 20)
   * @param {string|null} category - Categoria para filtrar (opcional)
   * @returns {Promise<{products: Array, total: number}>}
   */
  static async findAll(page = 1, limit = 20, category = null) {
    try {
      const offset = (page - 1) * limit;
      
      let query = supabase
        .from('products')
        .select('*, users!products_seller_id_fkey(id, name, store_name, profile_image)', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);
      
      // Aplica filtro de categoria se fornecido
      if (category) {
        query = query.eq('category', category);
      }
      
      const { data, error, count } = await query;
      
      if (error) throw error;
      
      // Formata os produtos para incluir informações do vendedor
      const formattedProducts = data.map(product => ({
        id: product.id,
        title: product.title,
        description: product.description,
        price: product.price,
        stock: product.stock,
        category: product.category,
        video_url: product.video_url,
        thumbnail: product.thumbnail,
        likes: product.likes || 0,
        comments_count: product.comments_count || 0,
        seller_id: product.seller_id,
        seller_name: product.users?.name || 'Vendedor',
        store_name: product.users?.store_name || 'Loja',
        seller_image: product.users?.profile_image,
        created_at: product.created_at,
        updated_at: product.updated_at
      }));
      
      return {
        products: formattedProducts,
        total: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit)
      };
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      throw error;
    }
  }

  /**
   * Cria um novo produto
   * @param {Object} productData - Dados do produto
   * @returns {Promise<Object>} Produto criado
   */
  static async create(productData) {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([{
          title: productData.title,
          description: productData.description,
          price: productData.price,
          stock: productData.stock || 0,
          category: productData.category,
          video_url: productData.video_url,
          thumbnail: productData.thumbnail,
          seller_id: productData.seller_id
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      throw error;
    }
  }

  /**
   * Busca produto por ID
   * @param {string} id - ID do produto
   * @returns {Promise<Object|null>} Produto encontrado ou null
   */
  static async findById(id) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, users!products_seller_id_fkey(id, name, store_name, profile_image, bio)')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      if (!data) return null;
      
      return {
        ...data,
        seller_name: data.users?.name,
        store_name: data.users?.store_name,
        seller_image: data.users?.profile_image,
        seller_bio: data.users?.bio
      };
    } catch (error) {
      console.error('Erro ao buscar produto por ID:', error);
      throw error;
    }
  }
}

module.exports = Product;

