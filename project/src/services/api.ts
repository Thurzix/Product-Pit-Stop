// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
console.log('🔗 API URL configurada:', API_BASE_URL);

// API endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  REGISTER: '/api/auth/register',
  LOGIN: '/api/auth/login',
  ME: '/api/auth/me',
  VERIFY: '/api/auth/verify',
  LOGOUT: '/api/auth/logout',
  
  // Product endpoints
  PRODUCTS: '/api/products',
  PRODUCT_BY_ID: (id: string) => `/api/products/${id}`,
  PRODUCTS_SEARCH: (term: string) => `/api/products/search/${term}`,
  
  // Upload endpoints
  UPLOAD_VIDEO: '/api/upload/video',
  UPLOAD_IMAGE: '/api/upload/image',
  
  // Cart endpoints
  CART: '/api/cart',
  CART_ITEM: (id: string) => `/api/cart/${id}`,
  
  // Message endpoints
  MESSAGES: '/api/messages',
  MESSAGE_THREAD: (contactId: string) => `/api/messages/${contactId}`,
  MESSAGE_READ: (id: string) => `/api/messages/${id}/read`,
  UNREAD_COUNT: '/api/messages/unread/count',
};

// API response types
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: string[];
  error?: string;
}

// Auth response types
export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: 'buyer' | 'seller';
    profile_image?: string;
    bio?: string;
    store_name?: string;
    store_description?: string;
  };
  token: string;
}

// Product types
export interface ProductResponse {
  id: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  video_url: string;
  thumbnail: string;
  likes: number;
  comments_count: number;
  seller_id: string;
  seller_name?: string;
  store_name?: string;
  seller_image?: string;
  posted_at: string;
  updated_at: string;
}

// HTTP client configuration
class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('pps_token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('pps_token', token);
    } else {
      localStorage.removeItem('pps_token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add authorization header if token exists
    if (this.token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${this.token}`,
      };
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth methods
  async register(userData: {
    name: string;
    email: string;
    password: string;
    role?: 'buyer' | 'seller';
  }): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>(API_ENDPOINTS.REGISTER, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: {
    email: string;
    password: string;
  }): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>(API_ENDPOINTS.LOGIN, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async getProfile(): Promise<ApiResponse<{ user: AuthResponse['user'] }>> {
    return this.request<{ user: AuthResponse['user'] }>(API_ENDPOINTS.ME);
  }

  async verifyToken(): Promise<ApiResponse<{ userId: string; email: string; role: string }>> {
    return this.request<{ userId: string; email: string; role: string }>(API_ENDPOINTS.VERIFY, {
      method: 'POST',
    });
  }

  async logout(): Promise<ApiResponse<{}>> {
    const response = await this.request<{}>(API_ENDPOINTS.LOGOUT, {
      method: 'POST',
    });
    this.setToken(null);
    return response;
  }

  // Product methods
  async getProducts(params?: {
    page?: number;
    limit?: number;
    category?: string;
  }): Promise<ApiResponse<{ products: ProductResponse[] }>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.category) searchParams.append('category', params.category);
    
    const endpoint = `${API_ENDPOINTS.PRODUCTS}${searchParams.toString() ? `?${searchParams}` : ''}`;
    return this.request<{ products: ProductResponse[] }>(endpoint);
  }

  async getProduct(id: string): Promise<ApiResponse<{ product: ProductResponse }>> {
    return this.request<{ product: ProductResponse }>(API_ENDPOINTS.PRODUCT_BY_ID(id));
  }

  async createProduct(productData: {
    title: string;
    description: string;
    price: number;
    stock?: number;
    category: string;
    video_url: string;
    thumbnail?: string;
  }): Promise<ApiResponse<ProductResponse>> {
    return this.request<ProductResponse>(API_ENDPOINTS.PRODUCTS, {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(
    id: string,
    productData: Partial<{
      title: string;
      description: string;
      price: number;
      stock: number;
      category: string;
      video_url: string;
      thumbnail: string;
    }>
  ): Promise<ApiResponse<boolean>> {
    return this.request<boolean>(API_ENDPOINTS.PRODUCT_BY_ID(id), {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(id: string): Promise<ApiResponse<boolean>> {
    return this.request<boolean>(API_ENDPOINTS.PRODUCT_BY_ID(id), {
      method: 'DELETE',
    });
  }

  async searchProducts(
    searchTerm: string,
    params?: { page?: number; limit?: number }
  ): Promise<ApiResponse<{ products: ProductResponse[] }>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    
    const endpoint = `${API_ENDPOINTS.PRODUCTS_SEARCH(searchTerm)}${searchParams.toString() ? `?${searchParams}` : ''}`;
    return this.request<{ products: ProductResponse[] }>(endpoint);
  }

  // Cart methods
  async getCart(): Promise<ApiResponse<{ 
    items: CartItemResponse[]; 
    total: number; 
    count: number; 
  }>> {
    return this.request<{ 
      items: CartItemResponse[]; 
      total: number; 
      count: number; 
    }>(API_ENDPOINTS.CART);
  }

  async addToCart(productData: {
    product_id: string;
    quantity?: number;
  }): Promise<ApiResponse<{}>> {
    return this.request<{}>(API_ENDPOINTS.CART, {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async updateCartItem(
    id: string,
    data: { quantity: number }
  ): Promise<ApiResponse<{}>> {
    return this.request<{}>(API_ENDPOINTS.CART_ITEM(id), {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async removeCartItem(id: string): Promise<ApiResponse<{}>> {
    return this.request<{}>(API_ENDPOINTS.CART_ITEM(id), {
      method: 'DELETE',
    });
  }

  async clearCart(): Promise<ApiResponse<{}>> {
    return this.request<{}>(API_ENDPOINTS.CART, {
      method: 'DELETE',
    });
  }

  // Message methods
  async getConversations(): Promise<ApiResponse<{ conversations: ConversationResponse[] }>> {
    return this.request<{ conversations: ConversationResponse[] }>(API_ENDPOINTS.MESSAGES);
  }

  async getMessages(contactId: string): Promise<ApiResponse<{ messages: MessageResponse[] }>> {
    return this.request<{ messages: MessageResponse[] }>(API_ENDPOINTS.MESSAGE_THREAD(contactId));
  }

  async sendMessage(messageData: {
    recipient_id: string;
    content: string;
    product_id?: string;
  }): Promise<ApiResponse<{ message: MessageResponse }>> {
    return this.request<{ message: MessageResponse }>(API_ENDPOINTS.MESSAGES, {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  }

  async markMessageAsRead(messageId: string): Promise<ApiResponse<{}>> {
    return this.request<{}>(API_ENDPOINTS.MESSAGE_READ(messageId), {
      method: 'PUT',
    });
  }

  async getUnreadCount(): Promise<ApiResponse<{ unread_count: number }>> {
    return this.request<{ unread_count: number }>(API_ENDPOINTS.UNREAD_COUNT);
  }
}

// Cart item response type
export interface CartItemResponse {
  id: string;
  product_id: string;
  quantity: number;
  added_at: string;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  stock: number;
  seller_name: string;
  store_name: string;
}

// Message types
export interface MessageResponse {
  id: string;
  sender_id: string;
  recipient_id: string;
  product_id?: string;
  content: string;
  is_read: boolean;
  created_at: string;
  sender_name: string;
  sender_image?: string;
}

export interface ConversationResponse {
  contact_id: string;
  contact_name: string;
  contact_image?: string;
  contact_store?: string;
  last_message_time: string;
  last_message_content: string;
  unread_count: number;
}



// Create and export API client instance
export const apiClient = new ApiClient(API_BASE_URL);

export default apiClient;