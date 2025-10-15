import type { AxiosResponse } from 'axios';
import { apiClient, apiEndpoints } from '../lib/api';
import type { Author, AuthorsResponse } from '../types/api';

export const authorsService = {
  // Get all authors
  getAuthors: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<AuthorsResponse> => {
    const response = await apiClient.get<AxiosResponse>(
      apiEndpoints.authors.getAll,
      params
    );
    return response.data;
  },

  // Get author by ID
  getAuthor: async (id: string): Promise<Author> => {
    const response = await apiClient.get<{ author: Author }>(apiEndpoints.authors.getById(id));
    return response.author;
  },

  // Create author
  createAuthor: async (data: Partial<Author>): Promise<Author> => {
    const response = await apiClient.post<{ author: Author }>(apiEndpoints.authors.create, data);
    return response.author;
  },

  // Update author
  updateAuthor: async (
    id: string,
    data: Partial<Author>
  ): Promise<Author> => {
    const response = await apiClient.put<{ author: Author }>(
      apiEndpoints.authors.update(id),
      data
    );
    return response.author;
  },

  // Delete author
  deleteAuthor: async (id: string): Promise<void> => {
    await apiClient.delete(apiEndpoints.authors.delete(id));
  },
};

