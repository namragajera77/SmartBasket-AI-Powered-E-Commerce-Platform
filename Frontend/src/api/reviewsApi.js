import { axiosClient, unwrapResponse } from "./axiosClient";

export async function getProductReviews(productId) {
  return unwrapResponse(axiosClient.get(`/api/reviews/product/${productId}`));
}

export async function createReview(payload) {
  await axiosClient.post("/api/reviews", payload);
}

export async function updateReview(reviewId, payload) {
  await axiosClient.put(`/api/reviews/${reviewId}`, payload);
}

export async function deleteReview(reviewId) {
  await axiosClient.delete(`/api/reviews/${reviewId}`);
}
