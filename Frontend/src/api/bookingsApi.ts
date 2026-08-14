import axiosClient from './axiosClient';
import { BookingResponseDto, CreateBookingDto, UpdateBookingStatusDto } from '../types/api';

export const bookingsApi = {
  getAll: async () => {
    const response = await axiosClient.get<BookingResponseDto[]>('/api/bookings');
    return response.data;
  },

  getByOwner: async () => {
    const response = await axiosClient.get<BookingResponseDto[]>('/api/bookings/owner');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await axiosClient.get<BookingResponseDto>(`/api/bookings/${id}`);
    return response.data;
  },

  getByCheckInCode: async (code: string) => {
    const response = await axiosClient.get<BookingResponseDto>(`/api/bookings/checkincode/${code}`);
    return response.data;
  },

  create: async (data: CreateBookingDto) => {
    const response = await axiosClient.post<BookingResponseDto>('/api/bookings', data);
    return response.data;
  },

  updateStatus: async (bookingId: string, data: UpdateBookingStatusDto) => {
    await axiosClient.put(`/api/bookings/${bookingId}/status`, data);
  },

  delete: async (bookingId: string) => {
    await axiosClient.delete(`/api/bookings/${bookingId}`);
  },

  getByUser: async (userId: string) => {
    const response = await axiosClient.get<BookingResponseDto[]>(`/api/bookings/user/${userId}`);
    return response.data;
  },

  getByField: async (fieldId: string) => {
    const response = await axiosClient.get<BookingResponseDto[]>(`/api/bookings/field/${fieldId}`);
    return response.data;
  },

  getBySportCenter: async (sportCenterId: string) => {
    const response = await axiosClient.get<BookingResponseDto[]>(`/api/bookings/sportcenter/${sportCenterId}`);
    return response.data;
  },

  getByRange: async (startDate: string, endDate: string) => {
    const response = await axiosClient.get<BookingResponseDto[]>('/api/bookings/range', {
      params: { startDate, endDate },
    });
    return response.data;
  },

  getBookedSlots: async (fieldId: string, date: string) => {
    // Note: Use a try/catch if there are issues when the server is down
    const response = await axiosClient.get<string[]>('/api/bookings/booked-slots', {
      params: { fieldId, date },
    });
    return response.data;
  },
};
