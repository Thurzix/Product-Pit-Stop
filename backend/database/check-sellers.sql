-- Verificar todos os vendedores criados
SELECT 
  id,
  name,
  email,
  store_name,
  created_at
FROM users
WHERE role = 'seller'
ORDER BY created_at DESC;

-- Contar produtos por vendedor
SELECT 
  u.name as vendedor,
  u.store_name as loja,
  COUNT(p.id) as total_produtos
FROM users u
LEFT JOIN products p ON p.seller_id = u.id
WHERE u.role = 'seller'
GROUP BY u.id, u.name, u.store_name
ORDER BY total_produtos DESC;

-- Total geral
SELECT 
  (SELECT COUNT(*) FROM users WHERE role = 'seller') as total_vendedores,
  (SELECT COUNT(*) FROM products) as total_produtos;
