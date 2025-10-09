import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoriesService } from '../services/categoriesService';
import { useToast } from '../contexts/ToastContext';
import type { Category } from '../types/api';

export const useCategories = (params?: {
  page?: number;
  limit?: number;
  isActive?: boolean;
}) => {
  return useQuery({
    queryKey: ['categories', params],
    queryFn: () => categoriesService.getCategories(params),
  });
};

export const useCategory = (id: string) => {
  return useQuery({
    queryKey: ['category', id],
    queryFn: () => categoriesService.getCategory(id),
    enabled: !!id,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (data: Partial<Category>) =>
      categoriesService.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      showSuccess('Success', 'Category created successfully');
    },
    onError: (error: Error) => {
      showError('Error', error.message || 'Failed to create category');
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Category> }) =>
      categoriesService.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      showSuccess('Success', 'Category updated successfully');
    },
    onError: (error: Error) => {
      showError('Error', error.message || 'Failed to update category');
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (id: string) => categoriesService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      showSuccess('Success', 'Category deleted successfully');
    },
    onError: (error: Error) => {
      showError('Error', error.message || 'Failed to delete category');
    },
  });
};

