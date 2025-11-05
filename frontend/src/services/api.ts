import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post('/api/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

export const compareImages = async (sourceId: string, targetIds: string[]) => {
  const response = await api.post('/api/similarity/compare', {
    source_image_id: sourceId,
    compare_with: targetIds,
  });
  
  return response.data;
};