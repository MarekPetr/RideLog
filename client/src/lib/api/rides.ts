import api from './axios';
import type {
  Ride,
  CreateRideRequest,
  UpdateRideRequest,
  RidesResponse,
  RideStats,
} from '@/lib/types';

export const ridesAPI = {
  getAll: async (): Promise<RidesResponse> => {
    const response = await api.get<RidesResponse>('/rides');
    return response.data;
  },

  create: async (data: CreateRideRequest): Promise<{ message: string; ride: Ride }> => {
    const response = await api.post<{ message: string; ride: Ride }>('/rides', data);
    return response.data;
  },

  update: async (id: string, data: UpdateRideRequest): Promise<{ message: string; ride: Ride }> => {
    const response = await api.put<{ message: string; ride: Ride }>(`/rides/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<{ message: string; rideId: string }> => {
    const response = await api.delete<{ message: string; rideId: string }>(`/rides/${id}`);
    return response.data;
  },

  getStats: async (): Promise<RideStats> => {
    const response = await api.get<RideStats>('/rides/stats');
    return response.data;
  },
};
