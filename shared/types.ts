// User types
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

// Ride types
export interface Ride {
  _id: string;
  userId: string;
  date: string;
  distance: number;
  duration: number;
  notes?: string;
  createdAt: string;
}

export interface CreateRideRequest {
  date: string;
  distance: number;
  duration: number;
  notes?: string;
}

export interface UpdateRideRequest {
  date?: string;
  distance?: number;
  duration?: number;
  notes?: string;
}

export interface RidesResponse {
  count: number;
  rides: Ride[];
}

export interface DailyStat {
  date: string;
  distance: number;
}

export interface RideStats {
  dailyStats: DailyStat[];
  summary: {
    totalRides: number;
    totalDistance: number;
    totalDuration: number;
    averageSpeed: number;
  };
}
