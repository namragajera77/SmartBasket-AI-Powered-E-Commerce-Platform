import axios from "axios";
import { clearSessionStorage } from "../utils/storage";
import { getAccessToken } from "../utils/storage";
const baseURL = import.meta.env.VITE_API_URL;
if (!baseURL) {
    // Phase 1 guardrail: frontend should fail early when API URL is not configured.
    throw new Error("VITE_API_URL is not configured.");
}
export class ApiError extends Error {
    status;
    code;
    constructor(message, status, code) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.code = code;
    }
}
function getPayloadField(payload, camelKey, pascalKey) {
    if (!payload) {
        return undefined;
    }
    return (payload[camelKey] ?? payload[pascalKey]);
}
export const axiosClient = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },
});
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
axiosClient.interceptors.response.use((response) => response, async (error) => {
    const status = error.response?.status;
    const requestConfig = error.config;
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
    const payload = error.response?.data;
    const payloadMessage = getPayloadField(payload, "message", "Message");
    const payloadCode = getPayloadField(payload, "error", "Error");
    const message = payloadMessage ??
        (status === 403 ? "You are not allowed to perform this action." : undefined) ??
        error.message ??
        "Unexpected API error.";
    const code = payloadCode;
    return Promise.reject(new ApiError(message, status, code));
});
export async function unwrapResponse(request) {
    const { data } = await request;
    if (isApiResponse(data)) {
        const success = data.success ??
            data.Success;
        const message = data.message ??
            data.Message;
        const error = data.error ??
            data.Error;
        const payload = data.data ??
            data.Data;
        if (!success) {
            throw new ApiError(message ?? error ?? "Request failed.", undefined, error);
        }
        return payload;
    }
    return data;
}
function isApiResponse(value) {
    if (typeof value !== "object" || value === null) {
        return false;
    }
    return ("success" in value && "data" in value) || ("Success" in value && "Data" in value);
}
