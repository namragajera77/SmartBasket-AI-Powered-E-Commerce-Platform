import { axiosClient, unwrapResponse } from "./axiosClient";
import type { ApiResponse } from "../types/api";
import type { Category, CategoryCreatePayload } from "../types/domain";

export async function getCategories(): Promise<Category[]> {
  return unwrapResponse<Category[]>(axiosClient.get<ApiResponse<Category[]>>("/api/categories"));
}

export async function createCategory(payload: CategoryCreatePayload): Promise<Category> {
  return unwrapResponse<Category>(axiosClient.post<ApiResponse<Category>>("/api/categories", payload));
}

