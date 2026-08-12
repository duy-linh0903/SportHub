import axiosClient from './axiosClient';
import { FieldResponseDto, CreateFieldDto, UpdateFieldDto } from '../types/api';

export const fieldsApi = {
  getAll: async () => {
    const response = await axiosClient.get<FieldResponseDto[]>('/api/fields');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await axiosClient.get<FieldResponseDto>(`/api/fields/${id}`);
    return response.data;
  },

  create: async (data: CreateFieldDto) => {
    const response = await axiosClient.post<FieldResponseDto>('/api/fields', data);
    return response.data;
  },

  update: async (id: string, data: UpdateFieldDto) => {
    const response = await axiosClient.put<FieldResponseDto>(`/api/fields/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    await axiosClient.delete(`/api/fields/${id}`);
  },

  getBySportCenter: async (sportCenterId: string) => {
    const response = await axiosClient.get<FieldResponseDto[]>(`/api/fields/sportcenter/${sportCenterId}`);
    return response.data;
  },

  getByType: async (type: string) => {
    const response = await axiosClient.get<FieldResponseDto[]>(`/api/fields/type/${type}`);
    return response.data;
  },

  getByPriceRange: async (minPrice: number, maxPrice: number) => {
    const response = await axiosClient.get<FieldResponseDto[]>('/api/fields/price-range', {
      params: { minPrice, maxPrice },
    });
    return response.data;
  },
};
