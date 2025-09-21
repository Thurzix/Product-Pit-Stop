// API Configuration
const API_BASE_URL = 'http://localhost:3001';

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
}

// Create and export API client instance
export const apiClient = new ApiClient(API_BASE_URL);

export default apiClient;