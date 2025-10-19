import { Product } from '../types';

export interface CartItem {
  product: Product;
  quantity: number;
}

const CART_STORAGE_KEY = 'product_pit_stop_cart';

// Função para obter o carrinho do localStorage
export const getCart = (): CartItem[] => {
  try {
    const cartData = localStorage.getItem(CART_STORAGE_KEY);
    if (!cartData) return [];
    return JSON.parse(cartData);
  } catch (error) {
    console.error('Erro ao carregar carrinho:', error);
    return [];
  }
};

// Função para salvar o carrinho no localStorage
const saveCart = (cart: CartItem[]): void => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error('Erro ao salvar carrinho:', error);
  }
};

// Adicionar produto ao carrinho
export const addToCart = (product: Product, quantity: number = 1): CartItem[] => {
  const cart = getCart();
  const existingItemIndex = cart.findIndex(item => item.product.id === product.id);

  if (existingItemIndex >= 0) {
    // Produto já existe, atualiza quantidade
    cart[existingItemIndex].quantity += quantity;
  } else {
    // Produto novo, adiciona ao carrinho
    cart.push({ product, quantity });
  }

  saveCart(cart);
  return cart;
};

// Remover produto do carrinho
export const removeFromCart = (productId: string): CartItem[] => {
  const cart = getCart();
  const updatedCart = cart.filter(item => item.product.id !== productId);
  saveCart(updatedCart);
  return updatedCart;
};

// Atualizar quantidade de um item
export const updateCartItemQuantity = (productId: string, quantity: number): CartItem[] => {
  const cart = getCart();
  const itemIndex = cart.findIndex(item => item.product.id === productId);

  if (itemIndex >= 0) {
    if (quantity <= 0) {
      // Remove se quantidade for 0 ou negativa
      return removeFromCart(productId);
    }
    cart[itemIndex].quantity = quantity;
    saveCart(cart);
  }

  return cart;
};

// Limpar carrinho
export const clearCart = (): void => {
  localStorage.removeItem(CART_STORAGE_KEY);
};

// Calcular total do carrinho
export const getCartTotal = (): number => {
  const cart = getCart();
  return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
};

// Calcular quantidade total de itens
export const getCartItemCount = (): number => {
  const cart = getCart();
  return cart.reduce((count, item) => count + item.quantity, 0);
};
