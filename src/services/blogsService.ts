import { apiClient, apiEndpoints } from '../lib/api';
import type { Blog, BlogsResponse } from '../types/api';

export const blogsService = {
  // Get all blogs
  getBlogs: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<BlogsResponse> => {
    const response = await apiClient.get(
      apiEndpoints.blogs.getAll,
      params
    );
    return response.data;
  },

  // Get blog by ID
  getBlog: async (id: string): Promise<{ blog: Blog }> => {
    const response = await apiClient.get(apiEndpoints.blogs.getById(id));
    return response.data;
  },

  // Create blog
  createBlog: async (data: {
    title: string;
    content: string;
    mainImage: string;
    coverImage: string;
    author: string;
  }): Promise<Blog> => {
    const response = await apiClient.post(apiEndpoints.blogs.create, data);
    return response.data.blog;
  },

  // Update blog
  updateBlog: async (
    id: string,
    data: {
      title: string;
      content: string;
      mainImage: string;
      coverImage: string;
      author: string;
    }
  ): Promise<Blog> => {
    const response = await apiClient.put(
      apiEndpoints.blogs.update(id),
      data
    );
    return response.data.blog;
  },

  // Delete blog
  deleteBlog: async (id: string): Promise<void> => {
    await apiClient.delete(apiEndpoints.blogs.delete(id));
  },
};

