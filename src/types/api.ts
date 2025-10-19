export interface User {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  profilePicture?: string; // Added missing property
  role: "superadmin" | "admin" | "merchant" | "user";
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
    pages: number;
    totalCategories: number;
    limit: number;
  };
}

export interface LoginRequest {
  phone?: string;
  email?: string;
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

export interface Author {
  _id: string;
  name: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthorsResponse {
  authors: Author[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface Blog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  mainImage: string;
  coverImage: string;
  author:
    | {
        _id: string;
        name: string;
        image?: string;
      }
    | string;
  createdAt: string;
  updatedAt: string;
}

export interface BlogsResponse {
  blogs: Blog[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}
