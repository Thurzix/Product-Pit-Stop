const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Validar variáveis de ambiente
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  console.error('❌ ERRO: Variáveis SUPABASE_URL e SUPABASE_ANON_KEY são obrigatórias!');
  process.exit(1);
}

// Criar cliente Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: false
    }
  }
);

// Testar conexão
const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('users').select('count', { count: 'exact', head: true });
    if (error && error.code !== 'PGRST116') { // PGRST116 = tabela não existe ainda
      console.error('❌ Erro ao conectar ao Supabase:', error.message);
    } else {
      console.log('✅ Conexão com Supabase estabelecida com sucesso!');
    }
  } catch (err) {
    console.error('❌ Erro ao testar conexão:', err.message);
  }
};

// Executar teste de conexão
testConnection();

module.exports = supabase;
