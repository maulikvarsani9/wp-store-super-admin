import { apiClient, apiEndpoints } from '../lib/api';
import type { Author, AuthorsResponse } from '../types/api';

export const authorsService = {
  // Get all authors
  getAuthors: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<AuthorsResponse> => {
    const response = await apiClient.get(
      apiEndpoints.authors.getAll,
      params
    );
    return response.data;
  },

  // Get author by ID
  getAuthor: async (id: string): Promise<Author> => {
    const response = await apiClient.get(apiEndpoints.authors.getById(id));
    return response.data.author;
  },

  // Create author
  createAuthor: async (data: Partial<Author>): Promise<Author> => {
    const response = await apiClient.post(apiEndpoints.authors.create, data);
    return response.data.author;
  },

  // Update author
  updateAuthor: async (
    id: string,
    data: Partial<Author>
  ): Promise<Author> => {
    const response = await apiClient.put(
      apiEndpoints.authors.update(id),
      data
    );
    return response.data.author;
  },

  // Delete author
  deleteAuthor: async (id: string): Promise<void> => {
    await apiClient.delete(apiEndpoints.authors.delete(id));
  },
};

