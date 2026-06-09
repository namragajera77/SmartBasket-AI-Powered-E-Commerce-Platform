import { axiosClient, unwrapResponse } from "./axiosClient";

export async function getCart() {
  return unwrapResponse(axiosClient.get("/api/cart"));
}

export async function addToCart(payload) {
  await axiosClient.post("/api/cart", payload);
}

export async function updateCartItem(cartItemId, payload) {
  await axiosClient.put(`/api/cart/${cartItemId}`, payload);
}

export async function removeCartItem(cartItemId) {
  await axiosClient.delete(`/api/cart/${cartItemId}`);
}
