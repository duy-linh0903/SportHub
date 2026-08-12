import axiosClient from './axiosClient';
import { UploadResponse } from '../types/api';

export const uploadApi = {
  uploadFile: async (file: any) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axiosClient.post<UploadResponse>('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
