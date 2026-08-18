import axiosClient from './axiosClient';
import { SportCenterResponseDto } from '../types/api';

export const favoritesApi = {
  toggleFavorite: async (sportCenterId: string) => {
    const response = await axiosClient.post(`/api/Favorites/toggle/${sportCenterId}`);
    return response.data;
  },

  checkIsFavorite: async (sportCenterId: string) => {
    const response = await axiosClient.get<boolean>(`/api/Favorites/check/${sportCenterId}`);
    return response.data;
  },

  getMyFavorites: async () => {
    const response = await axiosClient.get<SportCenterResponseDto[]>('/api/Favorites/my-favorites');
    return response.data;
  },
};
