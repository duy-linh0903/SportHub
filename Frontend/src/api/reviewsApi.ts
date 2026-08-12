import axiosClient from './axiosClient';
import { ReviewResponseDto, CreateReviewDto } from '../types/api';

export const reviewsApi = {
  getBySportCenter: async (sportCenterId: string) => {
    const response = await axiosClient.get<ReviewResponseDto[]>(`/api/reviews/sportcenter/${sportCenterId}`);
    return response.data;
  },

  create: async (data: CreateReviewDto) => {
    const response = await axiosClient.post<ReviewResponseDto>('/api/reviews', data);
    return response.data;
  },
};
