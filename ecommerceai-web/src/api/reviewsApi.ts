import { axiosClient, unwrapResponse } from "./axiosClient";
import type { ApiResponse } from "../types/api";
import type { CreateReviewPayload, Review, UpdateReviewPayload } from "../types/domain";

export async function getProductReviews(productId: number): Promise<Review[]> {
  return unwrapResponse<Review[]>(axiosClient.get<ApiResponse<Review[]>>(`/api/reviews/product/${productId}`));
}

export async function createReview(payload: CreateReviewPayload): Promise<void> {
  await axiosClient.post("/api/reviews", payload);
}

export async function updateReview(reviewId: number, payload: UpdateReviewPayload): Promise<void> {
  await axiosClient.put(`/api/reviews/${reviewId}`, payload);
}

export async function deleteReview(reviewId: number): Promise<void> {
  await axiosClient.delete(`/api/reviews/${reviewId}`);
}

