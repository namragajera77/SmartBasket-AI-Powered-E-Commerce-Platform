import { axiosClient, unwrapResponse } from "./axiosClient";
import type { ApiResponse } from "../types/api";
import type {
  DescriptionRequest,
  DescriptionResponse,
  Recommendation,
  ReviewSummary,
  SmartSearchRequest,
  SmartSearchResult,
} from "../types/domain";

export async function smartSearch(payload: SmartSearchRequest): Promise<SmartSearchResult[]> {
  return unwrapResponse<SmartSearchResult[]>(
    axiosClient.post<ApiResponse<SmartSearchResult[]>>("/api/ai/smart-search", payload),
  );
}

export async function getRecommendations(productId: number): Promise<Recommendation[]> {
  return unwrapResponse<Recommendation[]>(
    axiosClient.get<ApiResponse<Recommendation[]>>(`/api/ai/recommendations/${productId}`),
  );
}

export async function generateDescription(payload: DescriptionRequest): Promise<DescriptionResponse> {
  return unwrapResponse<DescriptionResponse>(
    axiosClient.post<ApiResponse<DescriptionResponse>>("/api/ai/generate-description", payload),
  );
}

export async function summarizeReviews(productId: number): Promise<ReviewSummary> {
  return unwrapResponse<ReviewSummary>(
    axiosClient.get<ApiResponse<ReviewSummary>>(`/api/ai/reviews-summary/${productId}`),
  );
}

