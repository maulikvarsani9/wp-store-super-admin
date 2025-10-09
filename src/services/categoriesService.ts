import { apiClient, apiEndpoints } from '../lib/api';
import type { Category, CategoriesResponse } from '../types/api';

export const categoriesService = {
  // Get all categories
  getCategories: async (params?: {
    page?: number;
    limit?: number;
    isActive?: boolean;
    parentCategory?: string;
  }): Promise<CategoriesResponse> => {
    const response = await apiClient.get(
      apiEndpoints.categories.getAll,
      params
    );
    // Backend returns: { success, message, data: { categories, pagination } }
    // apiClient.get returns response.data, so we need response.data (which is the data object)
    return response.data;
  },

  // Get category by ID
  getCategory: async (id: string): Promise<Category> => {
    const response = await apiClient.get(apiEndpoints.categories.getById(id));
    return response.data.category;
  },

  // Create category
  createCategory: async (data: Partial<Category>): Promise<Category> => {
    const response = await apiClient.post(apiEndpoints.categories.create, data);
    return response.data.category;
  },

  // Update category
  updateCategory: async (
    id: string,
    data: Partial<Category>
  ): Promise<Category> => {
    const response = await apiClient.put(
      apiEndpoints.categories.update(id),
      data
    );
    return response.data.category;
  },

  // Delete category
  deleteCategory: async (id: string): Promise<void> => {
    await apiClient.delete(apiEndpoints.categories.delete(id));
  },
};

