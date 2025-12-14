import { apiClient } from "./api-client";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  employeeId?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  nationalId: string;
  employeeNumber: string;
  dateOfHire: string;
  role: string;
}

export interface AuthResponse {
  user: User;
  access_token?: string;
}

export const authService = {
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      "/auth/register",
      data
    );
    return response.data;
  },

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      "/auth/login",
      credentials
    );
    return response.data;
  },

  async logout(): Promise<void> {
    await apiClient.post("/auth/logout");
  },

  async getProfile(): Promise<User> {
    const response = await apiClient.get<User>("/auth/profile");
    return response.data;
  },

  async refreshToken(): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/auth/refresh");
    return response.data;
  },
};
