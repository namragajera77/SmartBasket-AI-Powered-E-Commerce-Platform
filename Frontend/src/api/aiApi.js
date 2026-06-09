import { axiosClient, unwrapResponse } from "./axiosClient";

export async function smartSearch(payload) {
  return unwrapResponse(axiosClient.post("/api/ai/smart-search", payload));
}

export async function getRecommendations(productId) {
  return unwrapResponse(
    axiosClient.get(`/api/ai/recommendations/${productId}`),
  );
}

export async function generateDescription(payload) {
  return unwrapResponse(
    axiosClient.post("/api/ai/generate-description", payload),
  );
}

export async function summarizeReviews(productId) {
  return unwrapResponse(
    axiosClient.get(`/api/ai/reviews-summary/${productId}`),
  );
}
