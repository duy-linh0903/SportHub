import axiosClient from './axiosClient';
import { ServiceResponseDto, CreateServiceDto, UpdateServiceDto } from '../types/api';

export const servicesApi = {
  getAll: async () => {
    const response = await axiosClient.get<ServiceResponseDto[]>('/api/services');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await axiosClient.get<ServiceResponseDto>(`/api/services/${id}`);
    return response.data;
  },

  create: async (data: CreateServiceDto) => {
    const response = await axiosClient.post<ServiceResponseDto>('/api/services', data);
    return response.data;
  },

  update: async (id: string, data: UpdateServiceDto) => {
    const response = await axiosClient.put<ServiceResponseDto>(`/api/services/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    await axiosClient.delete(`/api/services/${id}`);
  },

  getByFieldType: async (type: string) => {
    const response = await axiosClient.get<ServiceResponseDto[]>(`/api/services/field-type/${type}`);
    return response.data;
  },
};
