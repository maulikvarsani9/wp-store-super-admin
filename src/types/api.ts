export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'superadmin' | 'admin' | 'merchant' | 'user';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  additionalImages?: string[];
  parentCategory?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CategoriesResponse {
  categories: Category[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCategories: number;
    limit: number;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

