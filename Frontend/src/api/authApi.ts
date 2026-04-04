import { axiosClient, unwrapResponse } from "./axiosClient";
import type { ApiResponse } from "../types/api";
import type { AuthResponse, LoginRequest, RegisterRequest } from "../types/domain";

export async function login(payload: LoginRequest): Promise<AuthResponse> {
  return unwrapResponse<AuthResponse>(axiosClient.post<ApiResponse<AuthResponse>>("/api/auth/login", payload));
}

export async function register(payload: RegisterRequest): Promise<AuthResponse> {
  return unwrapResponse<AuthResponse>(axiosClient.post<ApiResponse<AuthResponse>>("/api/auth/register", payload));
}

export async function refresh(refreshToken: string): Promise<AuthResponse> {
  return unwrapResponse<AuthResponse>(
    axiosClient.post<ApiResponse<AuthResponse>>("/api/auth/refresh", { refreshToken }),
  );
}

