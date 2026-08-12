import axiosClient from './axiosClient';
import { SportCenterResponseDto, CreateSportCenterDto, UpdateSportCenterDto } from '../types/api';

export const sportCentersApi = {
  getAll: async () => {
    const response = await axiosClient.get<SportCenterResponseDto[]>('/api/sportcenters');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await axiosClient.get<SportCenterResponseDto>(`/api/sportcenters/${id}`);
    return response.data;
  },

  create: async (data: CreateSportCenterDto) => {
    const response = await axiosClient.post<SportCenterResponseDto>('/api/sportcenters', data);
    return response.data;
  },

  update: async (id: string, data: UpdateSportCenterDto) => {
    const response = await axiosClient.put<SportCenterResponseDto>(`/api/sportcenters/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    await axiosClient.delete(`/api/sportcenters/${id}`);
  },

  search: async (name?: string) => {
    const response = await axiosClient.get<SportCenterResponseDto[]>('/api/sportcenters/search', {
      params: { name },
    });
    return response.data;
  },
};
