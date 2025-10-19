import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Message, Comment, CartItem, Order } from '../types';
import { mockUsers } from '../data/mockData';
import { apiClient, type CartItemResponse } from '../services/api';

// API Base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  signup: (userData: Partial<User>) => Promise<{ success: boolean; message?: string }>;
  updateUser: (userData: Partial<User>) => void;
  messages: Message[];
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  comments: Comment[];
  addComment: (comment: Omit<Comment, 'id' | 'timestamp'>) => void;
  cart: CartItem[];
  addToCart: (productId: string, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  toggleWishlist: (productId: string) => void;
  addOrder: (order: Omit<Order, 'order_id' | 'purchased_at'>) => void;
  productLikes: Record<string, number>;
  productComments: Record<string, number>;
  updateProductLikes: (productId: string, increment: boolean) => void;
  updateProductComments: (productId: string, increment: boolean) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [productLikes, setProductLikes] = useState<Record<string, number>>({});
  const [productComments, setProductComments] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular verificação de token/sessão
    const savedUser = localStorage.getItem('pps_user');
    const savedToken = localStorage.getItem('pps_token');
    const savedMessages = localStorage.getItem('pps_messages');
    const savedComments = localStorage.getItem('pps_comments');
    const savedCart = localStorage.getItem('pps_cart');
    const savedProductLikes = localStorage.getItem('pps_product_likes');
    const savedProductComments = localStorage.getItem('pps_product_comments');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedToken) {
      apiClient.setToken(savedToken); // Restaura o token no cliente API
    }
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
    if (savedComments) {
      setComments(JSON.parse(savedComments));
    }
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    if (savedProductLikes) {
      setProductLikes(JSON.parse(savedProductLikes));
    }
    if (savedProductComments) {
      setProductComments(JSON.parse(savedProductComments));
    }
    
    // Listen for direct message events
    const handleAddDirectMessage = (event: CustomEvent) => {
      const messageData = event.detail;
      const newMessage: Message = {
        ...messageData,
        id: `m${Date.now()}`,
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prev => {
        const updatedMessages = [...prev, newMessage];
        localStorage.setItem('pps_messages', JSON.stringify(updatedMessages));
        return updatedMessages;
      });
    };

    window.addEventListener('addDirectMessage', handleAddDirectMessage as EventListener);
    
    setIsLoading(false);
    
    return () => {
      window.removeEventListener('addDirectMessage', handleAddDirectMessage as EventListener);
    };
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    
    try {
      // Fazer chamada para o backend
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const userData = {
          id: data.data.user.id,
          name: data.data.user.name,
          email: data.data.user.email,
          role: data.data.user.role,
          profile_image: data.data.user.profile_image,
          bio: data.data.user.bio,
          store_name: data.data.user.store_name,
          store_description: data.data.user.store_description,
          wishlist: [],
          orders: [],
          preferences: []
        };

        setUser(userData);
        localStorage.setItem('pps_user', JSON.stringify(userData));
        localStorage.setItem('pps_token', data.data.token);
        apiClient.setToken(data.data.token); // Configura o token no cliente API
        setIsLoading(false);
        return { success: true };
      } else {
        console.error('Login failed:', data.message);
        setIsLoading(false);
        return { success: false, message: data.message || 'Erro ao fazer login' };
      }
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return { success: false, message: 'Erro ao conectar com o servidor' };
    }
  };

  const logout = () => {
    setUser(null);
    setMessages([]);
    setComments([]);
    setCart([]);
    setProductLikes({});
    setProductComments({});
    localStorage.removeItem('pps_user');
    localStorage.removeItem('pps_token');
    localStorage.removeItem('pps_messages');
    localStorage.removeItem('pps_comments');
    localStorage.removeItem('pps_cart');
    localStorage.removeItem('pps_product_likes');
    localStorage.removeItem('pps_product_comments');
    apiClient.setToken(null); // Remove o token do cliente API
  };

  const signup = async (userData: Partial<User>): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    
    try {
      // Fazer chamada para o backend
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          password: userData.password || '',
          role: userData.role || 'buyer'
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const newUser = {
          id: data.data.user.id,
          name: data.data.user.name,
          email: data.data.user.email,
          role: data.data.user.role,
          profile_image: data.data.user.profile_image,
          bio: data.data.user.bio,
          store_name: data.data.user.store_name,
          store_description: data.data.user.store_description,
          wishlist: [],
          orders: [],
          preferences: userData.preferences || []
        };

        setUser(newUser);
        localStorage.setItem('pps_user', JSON.stringify(newUser));
        localStorage.setItem('pps_token', data.data.token);
        apiClient.setToken(data.data.token); // Configura o token no cliente API
        setIsLoading(false);
        return { success: true };
      } else {
        console.error('Signup failed:', data.message || data.errors);
        setIsLoading(false);
        const errorMessage = data.message || (Array.isArray(data.errors) ? data.errors.join(', ') : 'Erro ao criar conta');
        return { success: false, message: errorMessage };
      }
    } catch (error) {
      console.error('Signup error:', error);
      setIsLoading(false);
      return { success: false, message: 'Erro ao conectar com o servidor' };
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('pps_user', JSON.stringify(updatedUser));
    }
  };

  const addMessage = (messageData: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...messageData,
      id: `m${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    localStorage.setItem('pps_messages', JSON.stringify(updatedMessages));
  };

  const addComment = (commentData: Omit<Comment, 'id' | 'timestamp'>) => {
    const newComment: Comment = {
      ...commentData,
      id: `c${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: user || undefined,
    };
    
    const updatedComments = [...comments, newComment];
    setComments(updatedComments);
    localStorage.setItem('pps_comments', JSON.stringify(updatedComments));
  };

  const addToCart = async (_productId: string, _quantity: number = 1) => {
    // Função mantida para compatibilidade mas não faz nada
    // O carrinho agora usa localStorage via cartService
    console.log('addToCart (deprecated) - use cartService instead');
  };

  const loadCartFromServer = async () => {
    // Função mantida para compatibilidade mas não faz nada
    // O carrinho agora usa localStorage via cartService
  };

  const removeFromCart = async (productId: string) => {
    if (!user) return;

    try {
      // Find cart item by product_id 
      const cartItem = cart.find(item => item.product_id === productId);
      if (!cartItem) return;

      // We need the cart item ID from server, for now use local removal
      // In a real scenario, we'd need to store the cart item ID
      const updatedCart = cart.filter(item => item.product_id !== productId);
      setCart(updatedCart);
      localStorage.setItem('pps_cart', JSON.stringify(updatedCart));
    } catch (error) {
      console.error('Erro ao remover do carrinho:', error);
    }
  };

  const updateCartQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    try {
      // For now, update locally. In future, we'd call API to update cart item
      const updatedCart = cart.map(item =>
        item.product_id === productId
          ? { ...item, quantity }
          : item
      );
      setCart(updatedCart);
      localStorage.setItem('pps_cart', JSON.stringify(updatedCart));
    } catch (error) {
      console.error('Erro ao atualizar carrinho:', error);
    }
  };

  // Load cart when user logs in
  useEffect(() => {
    if (user) {
      loadCartFromServer();
    }
  }, [user]);

  const toggleWishlist = (productId: string) => {
    if (!user) return;
    
    const currentWishlist = user.wishlist || [];
    const isInWishlist = currentWishlist.includes(productId);
    
    const updatedWishlist = isInWishlist
      ? currentWishlist.filter(id => id !== productId)
      : [...currentWishlist, productId];
    
    const updatedUser = { ...user, wishlist: updatedWishlist };
    setUser(updatedUser);
    localStorage.setItem('pps_user', JSON.stringify(updatedUser));
  };

  const addOrder = (orderData: Omit<Order, 'order_id' | 'purchased_at'>) => {
    if (!user) return;
    
    const newOrder: Order = {
      ...orderData,
      order_id: `o${Date.now()}`,
      purchased_at: new Date().toISOString(),
    };
    
    const currentOrders = user.orders || [];
    const updatedOrders = [...currentOrders, newOrder];
    const updatedUser = { ...user, orders: updatedOrders };
    
    setUser(updatedUser);
    localStorage.setItem('pps_user', JSON.stringify(updatedUser));
  };

  const updateProductLikes = (productId: string, increment: boolean) => {
    const updatedLikes = { ...productLikes };
    if (!updatedLikes[productId]) {
      updatedLikes[productId] = 0;
    }
    updatedLikes[productId] += increment ? 1 : -1;
    if (updatedLikes[productId] < 0) updatedLikes[productId] = 0;
    
    setProductLikes(updatedLikes);
    localStorage.setItem('pps_product_likes', JSON.stringify(updatedLikes));
  };

  const updateProductComments = (productId: string, increment: boolean) => {
    const updatedComments = { ...productComments };
    if (!updatedComments[productId]) {
      updatedComments[productId] = 0;
    }
    updatedComments[productId] += increment ? 1 : -1;
    if (updatedComments[productId] < 0) updatedComments[productId] = 0;
    
    setProductComments(updatedComments);
    localStorage.setItem('pps_product_comments', JSON.stringify(updatedComments));
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      signup, 
      updateUser,
      messages,
      addMessage,
      comments,
      addComment,
      cart,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      toggleWishlist,
      addOrder,
      productLikes,
      productComments,
      updateProductLikes,
      updateProductComments,
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};