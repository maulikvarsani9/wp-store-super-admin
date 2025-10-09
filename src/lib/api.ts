import axios from 'axios';
import { navigateToLogin } from '../utils/navigation';
import { useStore } from '../store/store';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

class ApiClient {
  private axiosInstance: ReturnType<typeof axios.create>;

  constructor(baseURL: string) {
    this.axiosInstance = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.axiosInstance.interceptors.request.use(
      config => {
        const store = JSON.parse(localStorage.getItem('super-admin-store') || '{}');
        const token = store?.state?.token;

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      error => {
        console.error('API Request Error:', error);
        return Promise.reject(error);
      }
    );

    this.axiosInstance.interceptors.response.use(
      response => {
        return response;
      },
      error => {
        if (error.response?.status === 401) {
          console.log('🚨 401 Unauthorized - Token invalid or expired');
          console.log('Error details:', {
            url: error.config?.url,
            status: error.response?.status,
            message: error.response?.data?.error?.message || error.message,
          });

          localStorage.removeItem('super-admin-store');

          useStore.setState({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
          });

          setTimeout(() => {
            navigateToLogin();
            console.log('🔄 Navigating to login');
          }, 100);
        }

        if (error.response?.data) {
          const backendError = error.response.data;

          if (backendError.error) {
            if (typeof backendError.error === 'string') {
              error.message = backendError.error;
            } else if (backendError.error.message) {
              error.message = backendError.error.message;
            }
          } else if (backendError.message) {
            error.message = backendError.message;
          }
        } else if (error.code === 'ECONNABORTED') {
          error.message =
            'Request timeout. Please check your connection and try again.';
        } else if (error.message === 'Network Error') {
          error.message =
            'Network error. Please check your internet connection and ensure the server is running.';
        }

        return Promise.reject(error);
      }
    );
  }

  private async request<T>(
    endpoint: string,
    config: Record<string, unknown> = {}
  ): Promise<T> {
    try {
      const response = await this.axiosInstance.request({
        url: endpoint,
        ...config,
      });
      return response.data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async get<T>(endpoint: string, params?: Record<string, unknown>): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'GET',
      params,
    });
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    config?: Record<string, unknown>
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      data,
      ...config,
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      data,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }

  getAxiosInstance() {
    return this.axiosInstance;
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

export const api = apiClient.getAxiosInstance();

export const apiEndpoints = {
  auth: {
    login: '/admin/auth/login',
    logout: '/admin/auth/logout',
    profile: '/admin/auth/profile',
    logoutAll: '/admin/auth/logout-all',
  },

  categories: {
    getAll: '/categories',
    getById: (id: string) => `/categories/${id}`,
    create: '/categories',
    update: (id: string) => `/categories/${id}`,
    delete: (id: string) => `/categories/${id}`,
  },

  uploads: {
    single: '/uploads/single',
    multiple: '/uploads/multiple',
  },
};

export default apiClient;

