import axiosClient from './axiosClient';

export interface TimeSlotDto {
  id: string;
  startTime: string; // HH:mm:ss
  endTime: string; // HH:mm:ss
  sportCenterId?: string | null;
}

export const slotsApi = {
  getBySportCenter: async (sportCenterId: string) => {
    const response = await axiosClient.get<TimeSlotDto[]>(`/api/slots/sportcenter/${sportCenterId}`);
    return response.data;
  },

  create: async (data: Partial<TimeSlotDto>) => {
    const response = await axiosClient.post<TimeSlotDto>('/api/slots', data);
    return response.data;
  },

  update: async (id: string, data: Partial<TimeSlotDto>) => {
    const response = await axiosClient.put(`/api/slots/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await axiosClient.delete(`/api/slots/${id}`);
    return response.data;
  }
};
