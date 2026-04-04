import { axiosClient, unwrapResponse } from "./axiosClient";
import type { ApiResponse } from "../types/api";
import type { AssignDeliveryPayload, CheckoutPayload, DeliveryUserOption, Order } from "../types/domain";

export async function checkout(payload: CheckoutPayload): Promise<Order> {
  return unwrapResponse<Order>(axiosClient.post<ApiResponse<Order>>("/api/orders/checkout", payload));
}

export async function getMyOrders(): Promise<Order[]> {
  return unwrapResponse<Order[]>(axiosClient.get<ApiResponse<Order[]>>("/api/orders/my"));
}

export async function getMyOrderById(orderId: number): Promise<Order> {
  return unwrapResponse<Order>(axiosClient.get<ApiResponse<Order>>(`/api/orders/my/${orderId}`));
}

export async function getAllOrders(): Promise<Order[]> {
  return unwrapResponse<Order[]>(axiosClient.get<ApiResponse<Order[]>>("/api/orders"));
}

export async function assignDelivery(orderId: number, payload: AssignDeliveryPayload): Promise<void> {
  await axiosClient.post(`/api/orders/${orderId}/assign-delivery`, payload);
}

export async function getDeliveryUsers(): Promise<DeliveryUserOption[]> {
  return unwrapResponse<DeliveryUserOption[]>(axiosClient.get<ApiResponse<DeliveryUserOption[]>>("/api/orders/delivery-users"));
}

export async function rejectMyOrder(orderId: number, reason: string): Promise<void> {
  await axiosClient.post(`/api/orders/${orderId}/reject`, { reason });
}

export async function rejectOrderAsAdmin(orderId: number, reason: string): Promise<void> {
  await axiosClient.post(`/api/orders/${orderId}/reject-admin`, { reason });
}

