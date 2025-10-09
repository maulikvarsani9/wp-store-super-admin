import { api, apiEndpoints } from '../lib/api';

export const uploadService = {
  // Upload single image
  uploadSingleImage: async (
    file: File
  ): Promise<{ url: string; filename: string }> => {
    const formData = new FormData();
    formData.append('mainImage', file); // Backend expects 'mainImage'

    const response = await api.post(apiEndpoints.uploads.single, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return {
      url: response.data?.data?.url || response.data?.url,
      filename: response.data?.data?.filename || response.data?.filename,
    };
  },

  // Upload multiple images
  uploadMultipleImages: async (
    files: File[]
  ): Promise<{ urls: string[]; filenames: string[] }> => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('additionalImages', file); // Backend expects 'additionalImages'
    });

    const response = await api.post(apiEndpoints.uploads.multiple, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const data = response.data?.data || response.data;
    return {
      urls: data?.urls || [],
      filenames: data?.filenames || [],
    };
  },
};

