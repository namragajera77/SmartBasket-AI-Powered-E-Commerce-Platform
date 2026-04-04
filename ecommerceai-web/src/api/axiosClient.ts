import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import type { ApiErrorPayload, ApiResponse } from "../types/api";
import { clearSessionStorage } from "../utils/storage";
import { getAccessToken } from "../utils/storage";

const baseURL = import.meta.env.VITE_API_URL;

if (!baseURL) {
  // Phase 1 guardrail: frontend should fail early when API URL is not configured.
  throw new Error("VITE_API_URL is not configured.");
}

export class ApiError extends Error {
  public readonly status?: number;
  public readonly code?: string;

  constructor(message: string, status?: number, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

function getPayloadField<T>(payload: Record<string, unknown> | undefined, camelKey: string, pascalKey: string): T | undefined {
  if (!payload) {
    return undefined;
  }

  return (payload[camelKey] ?? payload[pascalKey]) as T | undefined;
}

export const axiosClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retryCount?: number;
}

axiosClient.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (import.meta.env.DEV) {
    console.debug("[API request]", config.method?.toUpperCase(), config.url, { hasToken: Boolean(token) });
  }

  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorPayload>) => {
    const status = error.response?.status;
    const requestConfig = error.config as RetryableRequestConfig | undefined;

    if (import.meta.env.DEV) {
      console.debug("[API error]", requestConfig?.method?.toUpperCase(), requestConfig?.url, {
        status,
        message: error.message,
      });
    }

    if (status === 429 && requestConfig) {
      requestConfig._retryCount = (requestConfig._retryCount ?? 0) + 1;

      if (requestConfig._retryCount <= 3) {
        const retryAfterHeader = error.response?.headers?.["retry-after"];
        const retryAfterSeconds = Number(retryAfterHeader);
        const fallbackDelayMs = Math.min(1000 * 2 ** requestConfig._retryCount, 8000);
        const delayMs = Number.isFinite(retryAfterSeconds) && retryAfterSeconds > 0
          ? retryAfterSeconds * 1000
          : fallbackDelayMs;

        await new Promise((resolve) => window.setTimeout(resolve, delayMs));
        return axiosClient(requestConfig);
      }
    }

    if (status === 401) {
      clearSessionStorage();
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    const payload = error.response?.data as Record<string, unknown> | undefined;
    const payloadMessage = getPayloadField<string>(payload, "message", "Message");
    const payloadCode = getPayloadField<string>(payload, "error", "Error");
    const message =
      payloadMessage ??
      (status === 403 ? "You are not allowed to perform this action." : undefined) ??
      error.message ??
      "Unexpected API error.";
    const code = payloadCode;

    return Promise.reject(new ApiError(message, status, code));
  },
);

export async function unwrapResponse<T>(request: Promise<{ data: ApiResponse<T> | T }>): Promise<T> {
  const { data } = await request;

  if (isApiResponse<T>(data)) {
    const success = (data as { success?: boolean; Success?: boolean }).success ??
      (data as { success?: boolean; Success?: boolean }).Success;
    const message = (data as { message?: string; Message?: string }).message ??
      (data as { message?: string; Message?: string }).Message;
    const error = (data as { error?: string; Error?: string }).error ??
      (data as { error?: string; Error?: string }).Error;
    const payload = (data as { data?: T; Data?: T }).data ??
      (data as { data?: T; Data?: T }).Data;

    if (!success) {
      throw new ApiError(message ?? error ?? "Request failed.", undefined, error);
    }

    return payload as T;
  }

  return data as T;
}

function isApiResponse<T>(value: ApiResponse<T> | T): value is ApiResponse<T> {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  return ("success" in value && "data" in value) || ("Success" in value && "Data" in value);
}

