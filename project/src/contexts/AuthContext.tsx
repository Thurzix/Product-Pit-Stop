import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Message, Comment, CartItem } from '../types';
import { mockUsers } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signup: (userData: Partial<User>) => Promise<boolean>;
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
    const savedMessages = localStorage.getItem('pps_messages');
    const savedComments = localStorage.getItem('pps_comments');
    const savedCart = localStorage.getItem('pps_cart');
    const savedProductLikes = localStorage.getItem('pps_product_likes');
    const savedProductComments = localStorage.getItem('pps_product_comments');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
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

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simular autenticação
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('pps_user', JSON.stringify(foundUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    setMessages([]);
    setComments([]);
    setCart([]);
    setProductLikes({});
    setProductComments({});
    localStorage.removeItem('pps_user');
    localStorage.removeItem('pps_messages');
    localStorage.removeItem('pps_comments');
    localStorage.removeItem('pps_cart');
    localStorage.removeItem('pps_product_likes');
    localStorage.removeItem('pps_product_comments');
  };

  const signup = async (userData: Partial<User>): Promise<boolean> => {
    setIsLoading(true);
    
    // Simular criação de conta
    const newUser: User = {
      id: `u${Date.now()}`,
      role: 'buyer',
      name: userData.name || '',
      email: userData.email || '',
      wishlist: [],
      orders: [],
      preferences: userData.preferences || [],
      ...userData
    };
    
    setUser(newUser);
    localStorage.setItem('pps_user', JSON.stringify(newUser));
    setIsLoading(false);
    return true;
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

  const addToCart = (productId: string, quantity: number = 1) => {
    const existingItem = cart.find(item => item.product_id === productId);
    let updatedCart;
    
    if (existingItem) {
      updatedCart = cart.map(item =>
        item.product_id === productId
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      const newItem: CartItem = {
        product_id: productId,
        quantity,
        added_at: new Date().toISOString(),
      };
      updatedCart = [...cart, newItem];
    }
    
    setCart(updatedCart);
    localStorage.setItem('pps_cart', JSON.stringify(updatedCart));
  };

  const removeFromCart = (productId: string) => {
    const updatedCart = cart.filter(item => item.product_id !== productId);
    setCart(updatedCart);
    localStorage.setItem('pps_cart', JSON.stringify(updatedCart));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    const updatedCart = cart.map(item =>
      item.product_id === productId
        ? { ...item, quantity }
        : item
    );
    setCart(updatedCart);
    localStorage.setItem('pps_cart', JSON.stringify(updatedCart));
  };

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