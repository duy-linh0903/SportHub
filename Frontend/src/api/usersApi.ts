import axiosClient from './axiosClient';
import { UserResponseDto, UpdateProfileDto } from '../types/api';

export const usersApi = {
  getAll: async () => {
    const response = await axiosClient.get<UserResponseDto[]>('/api/users');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await axiosClient.get<UserResponseDto>(`/api/users/${id}`);
    return response.data;
  },

  getByEmail: async (email: string) => {
    const response = await axiosClient.get<UserResponseDto>('/api/users/by-email', {
      params: { email },
    });
    return response.data;
  },

  update: async (id: string, data: UpdateProfileDto) => {
    const response = await axiosClient.put<UserResponseDto>(`/api/users/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    await axiosClient.delete(`/api/users/${id}`);
  },
};
