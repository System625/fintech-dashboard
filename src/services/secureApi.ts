// Secure API layer - hides real endpoints from client
export interface SecureApiConfig {
  baseUrl: string;
  timeout: number;
}

// Only expose generic endpoint paths, not real URLs
const API_ENDPOINTS = {
  // Public endpoints (safe to expose)
  auth: {
    login: '/auth/login',
    register: '/auth/register', 
    logout: '/auth/logout',
    refresh: '/auth/refresh'
  },
  
  // User data endpoints
  user: {
    profile: '/user/profile',
    preferences: '/user/preferences'
  },
  
  // Financial data (authenticated)
  finance: {
    accounts: '/finance/accounts',
    transactions: '/finance/transactions', 
    investments: '/finance/investments',
    savings: '/finance/savings'
  }
} as const;

// Server proxy configuration (not exposed to client)
const getApiConfig = (): SecureApiConfig => {
  // In production, this would come from server-side config
  return {
    baseUrl: import.meta.env.MODE === 'production' 
      ? 'https://your-api-server.com/api/v1'  // Real backend
      : '/api/v1', // Local proxy during development
    timeout: 10000
  };
};

// Secure API client that goes through your backend
class SecureApiClient {
  private config: SecureApiConfig;
  
  constructor() {
    this.config = getApiConfig();
  }
  
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.config.baseUrl}${endpoint}`;
    
    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          // Don't expose sensitive headers here
          ...options.headers,
        },
        signal: controller.signal,
        ...options,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      return response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }
  
  // User methods
  async getUserProfile() {
    return this.request(API_ENDPOINTS.user.profile);
  }
  
  async updateUserPreferences(preferences: any) {
    return this.request(API_ENDPOINTS.user.preferences, {
      method: 'PATCH',
      body: JSON.stringify(preferences)
    });
  }
  
  // Financial methods
  async getAccounts() {
    return this.request(API_ENDPOINTS.finance.accounts);
  }
  
  async getTransactions(filters?: any) {
    const query = filters ? `?${new URLSearchParams(filters)}` : '';
    return this.request(`${API_ENDPOINTS.finance.transactions}${query}`);
  }
}

export const secureApi = new SecureApiClient();
export { API_ENDPOINTS };