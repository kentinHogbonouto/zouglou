import { API_BASE_URL } from './constants';
import { ApiResponse, PaginatedResponse } from '@/shared/types';

class ApiService {
  private baseUrl: string;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value: unknown) => void;
    reject: (error: unknown) => void;
  }> = [];

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private processQueue(error: unknown, token: string | null = null) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(token);
      }
    });
    this.failedQueue = [];
  }

  private async refreshToken(): Promise<string | null> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      return null;
    }

    try {
      const response = await fetch(`${this.baseUrl}/token/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Refresh token failed');
      }

      const data = await response.json();
      localStorage.setItem('auth_token', data.access);
      return data.access;
    } catch (error) {
      // Si le refresh échoue, déconnecter l'utilisateur
      this.logout();
      throw error;
    }
  }

  private logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('current_user_id');
    
    // Rediriger vers la page de connexion
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }

  private getAuthToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retryCount = 0
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    // Ajouter le token d'authentification si disponible
    const token = this.getAuthToken();
    const headers: Record<string, string> = {
      ...options.headers as Record<string, string>,
    };

    // Ajouter le Content-Type seulement si ce n'est pas un FormData
    const isFormData = options.body instanceof FormData;
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      headers,
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      // Si le token est expiré (401) et qu'on n'a pas encore retenté
      if (response.status === 401 && retryCount === 0) {
        if (this.isRefreshing) {
          // Si un refresh est déjà en cours, attendre
          return new Promise((resolve, reject) => {
            this.failedQueue.push({ resolve, reject });
          }).then(() => this.request<T>(endpoint, options, retryCount + 1));
        }

        this.isRefreshing = true;

        try {
          const newToken = await this.refreshToken();
          this.processQueue(null, newToken);
          
          // Relancer la requête avec le nouveau token
          return this.request<T>(endpoint, options, retryCount + 1);
        } catch (error) {
          this.processQueue(error, null);
          this.logout();
          throw new Error('Session expirée. Veuillez vous reconnecter.');
        } finally {
          this.isRefreshing = false;
        }
      }

      if (!response.ok) {
        const errorData = data.message || data;
        
        if (errorData.non_field_errors && errorData.non_field_errors.length > 0) {
          throw new Error(errorData.non_field_errors[0]);
        }
        
        const fieldErrors = Object.entries(errorData)
          .filter(([key]) => key !== 'non_field_errors')
          .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages[0] : messages}`)
          .join(', ');

        throw new Error(fieldErrors || 'Une erreur est survenue');
      }

      return {
        success: true,
        data: data,
        message: data.message,
        error: data.error,
      };
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Une erreur est survenue');
    }
  }

  // Méthodes GET
  async get<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET', ...options });
  }

  async getPaginated<T>(endpoint: string, page = 1, limit = 10): Promise<PaginatedResponse<T>> {
    const url = `${endpoint}?page=${page}&limit=${limit}`;
    const response = await this.request<PaginatedResponse<T>>(url, { method: 'GET' });
    return response.data!;
  }

  // Méthodes POST
  async post<T>(endpoint: string, data: unknown, options?: RequestInit): Promise<ApiResponse<T>> {
    const isFormData = data instanceof FormData;
    return this.request<T>(endpoint, {
      method: 'POST',
      body: isFormData ? data : JSON.stringify(data),
      ...options,
    });
  }

  // Méthodes PATCH
  async patch<T>(endpoint: string, data: unknown, options?: RequestInit): Promise<ApiResponse<T>> {
    const isFormData = data instanceof FormData;
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: isFormData ? data : JSON.stringify(data),
      ...options,
    });
  }

  // Méthodes PUT
  async put<T>(endpoint: string, data: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Méthodes DELETE
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiService = new ApiService(); 