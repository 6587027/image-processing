import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface UploadResponse {
  image_id: string;
  filename: string;
  url: string;
  message: string;
}

export interface SimilarityResult {
  id: string;
  filename: string;
  similarity: number;
  category: 'high' | 'medium' | 'low';
  url: string;
}

export interface CompareResponse {
  source_id: string;
  results: SimilarityResult[];
  total_compared: number;
}

export const uploadImage = async (file: File, permanent: boolean = false): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post<UploadResponse>(
    `/api/upload?permanent=${permanent}`, 
    formData, 
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  
  return response.data;
};
export const compareImages = async (sourceId: string): Promise<CompareResponse> => {
  const response = await api.post<CompareResponse>('/api/similarity/compare', {
    source_image_id: sourceId,
  });
  
  return response.data;
};

export const listImages = async () => {
  const response = await api.get('/api/images');
  return response.data;
};