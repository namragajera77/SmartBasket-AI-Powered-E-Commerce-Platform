import { axiosClient, unwrapResponse } from "./axiosClient";

export async function login(payload) {
  return unwrapResponse(axiosClient.post("/api/auth/login", payload));
}

export async function register(payload) {
  return unwrapResponse(axiosClient.post("/api/auth/register", payload));
}

export async function refresh(refreshToken) {
  return unwrapResponse(
    axiosClient.post("/api/auth/refresh", { refreshToken }),
  );
}
