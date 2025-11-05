export interface ImageFile {
  id: string;
  file: File;
  preview: string;
  name: string;
  size: number;
  type: string;
}

export interface SimilarityResult {
  id: string;
  url: string;
  similarity: number;
  category: 'high' | 'medium' | 'low';
}

export interface UploadResponse {
  image_id: string;
  url: string;
  message: string;
}