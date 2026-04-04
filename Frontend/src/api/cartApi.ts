import { axiosClient, unwrapResponse } from "./axiosClient";
import type { ApiResponse } from "../types/api";
import type { AddToCartPayload, CartItem, UpdateCartPayload } from "../types/domain";

export async function getCart(): Promise<CartItem[]> {
  return unwrapResponse<CartItem[]>(axiosClient.get<ApiResponse<CartItem[]>>("/api/cart"));
}

export async function addToCart(payload: AddToCartPayload): Promise<void> {
  await axiosClient.post("/api/cart", payload);
}

export async function updateCartItem(cartItemId: number, payload: UpdateCartPayload): Promise<void> {
  await axiosClient.put(`/api/cart/${cartItemId}`, payload);
}

export async function removeCartItem(cartItemId: number): Promise<void> {
  await axiosClient.delete(`/api/cart/${cartItemId}`);
}

