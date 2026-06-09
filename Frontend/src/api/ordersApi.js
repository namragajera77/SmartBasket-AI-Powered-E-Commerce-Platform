import { axiosClient, unwrapResponse } from "./axiosClient";

export async function checkout(payload) {
  return unwrapResponse(axiosClient.post("/api/orders/checkout", payload));
}

export async function getMyOrders() {
  return unwrapResponse(axiosClient.get("/api/orders/my"));
}

export async function getMyOrderById(orderId) {
  return unwrapResponse(axiosClient.get(`/api/orders/my/${orderId}`));
}

export async function getAllOrders() {
  return unwrapResponse(axiosClient.get("/api/orders"));
}

export async function assignDelivery(orderId, payload) {
  await axiosClient.post(`/api/orders/${orderId}/assign-delivery`, payload);
}

export async function getDeliveryUsers() {
  return unwrapResponse(axiosClient.get("/api/orders/delivery-users"));
}

export async function rejectMyOrder(orderId, reason) {
  await axiosClient.post(`/api/orders/${orderId}/reject`, { reason });
}

export async function rejectOrderAsAdmin(orderId, reason) {
  await axiosClient.post(`/api/orders/${orderId}/reject-admin`, { reason });
}
