import { API_CONFIG } from '@/config/api';

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  isLoading: boolean;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

class ApiClient {
  private baseURL: string;
  private apiKey: string;
  private timeout: number;

  constructor(baseURL: string, apiKey: string = '', timeout: number = API_CONFIG.REQUEST.TIMEOUT) {
    this.baseURL = baseURL;
    this.apiKey = apiKey;
    this.timeout = timeout;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
    retryCount: number = 0
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Add API key to query params if provided
    const urlWithKey = this.apiKey 
      ? `${url}${url.includes('?') ? '&' : '?'}api_key=${this.apiKey}`
      : url;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(urlWithKey, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      
      // Retry logic for network errors
      if (retryCount < API_CONFIG.REQUEST.RETRY_ATTEMPTS && this.shouldRetry(error)) {
        await this.delay(API_CONFIG.REQUEST.RETRY_DELAY * (retryCount + 1));
        return this.makeRequest<T>(endpoint, options, retryCount + 1);
      }
      
      throw this.handleError(error);
    }
  }

  private shouldRetry(error: any): boolean {
    // Retry on network errors, timeouts, and 5xx server errors
    return (
      error.name === 'AbortError' ||
      error.message.includes('fetch') ||
      (error.status >= 500 && error.status < 600)
    );
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private handleError(error: any): ApiError {
    if (error.name === 'AbortError') {
      return {
        message: 'Request timeout. Please check your connection.',
        code: 'TIMEOUT',
      };
    }

    if (error.message.includes('fetch')) {
      return {
        message: 'Network error. Please check your internet connection.',
        code: 'NETWORK_ERROR',
      };
    }

    return {
      message: error.message || 'An unexpected error occurred.',
      status: error.status,
      code: error.code,
    };
  }

  // GET request
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const queryString = params 
      ? '?' + new URLSearchParams(params).toString()
      : '';
    
    return this.makeRequest<T>(`${endpoint}${queryString}`, {
      method: 'GET',
    });
  }

  // POST request
  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT request
  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<T> {
    return this.makeRequest<T>(endpoint, {
      method: 'DELETE',
    });
  }
}

// Create API client instances
export const newsApiClient = new ApiClient(
  API_CONFIG.NEWS_API.BASE_URL,
  API_CONFIG.NEWS_API.API_KEY
);

export const tmdbApiClient = new ApiClient(
  API_CONFIG.TMDB_API.BASE_URL,
  API_CONFIG.TMDB_API.API_KEY
);

export const socialApiClient = new ApiClient(
  API_CONFIG.SOCIAL_API.BASE_URL
);

// Utility function to handle API responses
export const handleApiResponse = <T>(
  data: T | null,
  error: any
): ApiResponse<T> => {
  if (error) {
    return {
      data: null,
      error: error.message || 'An error occurred',
      isLoading: false,
    };
  }

  return {
    data,
    error: null,
    isLoading: false,
  };
};
