-- Script para inserir produtos de demonstração - VERSÃO CORRIGIDA COM UUIDs
-- Execute este script no SQL Editor do Supabase

-- Primeiro, vamos criar alguns usuários vendedores de exemplo
-- Usaremos gen_random_uuid() para gerar IDs únicos, mas vamos salvá-los em variáveis

DO $$
DECLARE
  seller1_id UUID;
  seller2_id UUID;
  seller3_id UUID;
BEGIN
  -- Criar vendedores e capturar seus IDs
  INSERT INTO users (name, email, password, role, bio, store_name, store_description, profile_image)
  VALUES 
    (
      'Tech Store Pro',
      'techstore@demo.com',
      '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
      'seller',
      'Especialista em tecnologia e gadgets',
      'Tech Store Pro',
      'Os melhores produtos de tecnologia para você',
      'https://ui-avatars.com/api/?name=Tech+Store&background=3b82f6&color=fff'
    )
  ON CONFLICT (email) DO UPDATE SET email = EXCLUDED.email
  RETURNING id INTO seller1_id;

  INSERT INTO users (name, email, password, role, bio, store_name, store_description, profile_image)
  VALUES 
    (
      'Fashion House',
      'fashion@demo.com',
      '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
      'seller',
      'Moda e estilo para todos',
      'Fashion House',
      'Tendências e moda com os melhores preços',
      'https://ui-avatars.com/api/?name=Fashion+House&background=ec4899&color=fff'
    )
  ON CONFLICT (email) DO UPDATE SET email = EXCLUDED.email
  RETURNING id INTO seller2_id;

  INSERT INTO users (name, email, password, role, bio, store_name, store_description, profile_image)
  VALUES 
    (
      'Home & Living',
      'homeliving@demo.com',
      '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
      'seller',
      'Decoração e itens para casa',
      'Home & Living',
      'Transforme sua casa em um lar',
      'https://ui-avatars.com/api/?name=Home+Living&background=10b981&color=fff'
    )
  ON CONFLICT (email) DO UPDATE SET email = EXCLUDED.email
  RETURNING id INTO seller3_id;

  -- Se os vendedores já existiam, buscar seus IDs
  IF seller1_id IS NULL THEN
    SELECT id INTO seller1_id FROM users WHERE email = 'techstore@demo.com';
  END IF;
  
  IF seller2_id IS NULL THEN
    SELECT id INTO seller2_id FROM users WHERE email = 'fashion@demo.com';
  END IF;
  
  IF seller3_id IS NULL THEN
    SELECT id INTO seller3_id FROM users WHERE email = 'homeliving@demo.com';
  END IF;

  -- Agora inserir produtos usando os IDs dos vendedores
  INSERT INTO products (title, description, price, stock, category, video_url, thumbnail, seller_id, likes, comments_count)
  VALUES 
    -- Produtos de Tecnologia (seller1)
    (
      'Fone Bluetooth Premium',
      'Fone de ouvido Bluetooth com cancelamento de ruído ativo, bateria de 30h e som de alta qualidade. Perfeito para trabalho e lazer!',
      299.90,
      50,
      'Eletrônicos',
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
      seller1_id,
      342,
      28
    ),
    (
      'Smart Watch Fitness Pro',
      'Relógio inteligente com monitoramento de saúde 24/7, GPS integrado e resistente à água. Acompanhe seus treinos!',
      599.90,
      30,
      'Eletrônicos',
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
      seller1_id,
      521,
      45
    ),
    (
      'Teclado Mecânico RGB',
      'Teclado mecânico gamer com iluminação RGB personalizável, switches blue e anti-ghosting. Para gamers profissionais!',
      449.90,
      25,
      'Eletrônicos',
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400',
      seller1_id,
      189,
      15
    ),
    (
      'Mouse Gamer Wireless',
      'Mouse sem fio com sensor de 16.000 DPI, 8 botões programáveis e RGB customizável. Precisão absoluta!',
      199.90,
      60,
      'Eletrônicos',
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400',
      seller1_id,
      456,
      38
    ),
    (
      'Webcam Full HD Pro',
      'Webcam 1080p com foco automático, microfone integrado e iluminação ajustável. Ideal para streaming!',
      279.90,
      40,
      'Eletrônicos',
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400',
      seller1_id,
      321,
      27
    ),
    (
      'Power Bank 20.000mAh',
      'Carregador portátil com carregamento rápido, 3 portas USB e display LED. Nunca fique sem bateria!',
      129.90,
      120,
      'Eletrônicos',
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400',
      seller1_id,
      567,
      42
    ),
    (
      'Câmera de Segurança WiFi',
      'Câmera com visão noturna, detecção de movimento e armazenamento em nuvem. Segurança 24/7!',
      199.90,
      90,
      'Eletrônicos',
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      'https://images.unsplash.com/photo-1557324232-b8917d3c3dcb?w=400',
      seller1_id,
      412,
      33
    ),
    
    -- Produtos de Moda (seller2)
    (
      'Tênis Running Ultra',
      'Tênis para corrida com tecnologia de amortecimento avançado. Conforto e performance em cada passada!',
      349.90,
      100,
      'Moda',
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
      seller2_id,
      678,
      52
    ),
    (
      'Jaqueta Jeans Premium',
      'Jaqueta jeans estilo vintage, 100% algodão premium. Um clássico que nunca sai de moda!',
      249.90,
      45,
      'Moda',
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
      seller2_id,
      234,
      19
    ),
    (
      'Bolsa Executiva Couro',
      'Bolsa em couro legítimo, perfeita para o dia a dia profissional. Elegância e praticidade!',
      489.90,
      20,
      'Moda',
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400',
      seller2_id,
      412,
      31
    ),
    (
      'Óculos de Sol Premium',
      'Óculos com proteção UV400, armação em acetato e design moderno. Estilo e proteção!',
      189.90,
      70,
      'Moda',
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400',
      seller2_id,
      389,
      29
    ),
    (
      'Relógio Analógico Clássico',
      'Relógio de pulso com pulseira em couro e mostrador minimalista. Elegância atemporal!',
      299.90,
      55,
      'Moda',
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400',
      seller2_id,
      267,
      21
    ),
    (
      'Mochila Urbana Premium',
      'Mochila com compartimento para notebook 15", USB integrado e design anti-furto. Segurança e estilo!',
      229.90,
      65,
      'Moda',
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
      seller2_id,
      445,
      34
    ),
    (
      'Camiseta Premium Básica',
      'Camiseta 100% algodão egípcio, modelagem moderna e cores vibrantes. Básico essencial!',
      79.90,
      200,
      'Moda',
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
      seller2_id,
      890,
      67
    ),
    
    -- Produtos para Casa (seller3)
    (
      'Luminária LED Inteligente',
      'Luminária com controle por app, 16 milhões de cores e integração com assistentes de voz. Ilumine com estilo!',
      159.90,
      80,
      'Casa',
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400',
      seller3_id,
      298,
      22
    ),
    (
      'Kit Panelas Premium',
      'Conjunto com 5 panelas antiaderentes, cabos ergonômicos e tampas de vidro. Cozinhe como um chef!',
      399.90,
      35,
      'Casa',
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      'https://images.unsplash.com/photo-1584990347449-39943621426b?w=400',
      seller3_id,
      145,
      11
    ),
    (
      'Tapete Decorativo Luxo',
      'Tapete artesanal 2x1.5m, material premium e design moderno. Transforme seu ambiente!',
      599.90,
      15,
      'Casa',
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      'https://images.unsplash.com/photo-1600166898405-da9535204843?w=400',
      seller3_id,
      87,
      7
    ),
    (
      'Cafeteira Expresso Smart',
      'Cafeteira com 15 barras de pressão, moedor integrado e controle por app. Café profissional em casa!',
      899.90,
      20,
      'Casa',
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400',
      seller3_id,
      234,
      18
    ),
    (
      'Aspirador Robô Inteligente',
      'Robô aspirador com mapeamento laser, app integrado e estação de auto-esvaziamento. Limpeza automática!',
      1299.90,
      15,
      'Casa',
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400',
      seller3_id,
      678,
      55
    ),
    (
      'Conjunto Sofá 3 Lugares',
      'Sofá retrátil e reclinável, tecido suede e design contemporâneo. Conforto supremo!',
      1999.90,
      10,
      'Casa',
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400',
      seller3_id,
      123,
      9
    );

  -- Mensagem de sucesso
  RAISE NOTICE 'Produtos de demonstração inseridos com sucesso!';
  RAISE NOTICE 'Total de produtos: %', (SELECT COUNT(*) FROM products);
  
END $$;

-- Consulta final para confirmar
SELECT 
  '✅ Script executado com sucesso!' as status,
  COUNT(*) as total_produtos 
FROM products;

SELECT 
  '👥 Vendedores criados:' as info,
  COUNT(*) as total_vendedores 
FROM users 
WHERE role = 'seller';
