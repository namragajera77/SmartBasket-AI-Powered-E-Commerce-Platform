import { axiosClient, unwrapResponse } from "./axiosClient";
import type { ApiResponse } from "../types/api";
import type { Order } from "../types/domain";

export async function getAssignedOrders(): Promise<Order[]> {
  return unwrapResponse<Order[]>(axiosClient.get<ApiResponse<Order[]>>("/api/delivery/orders"));
}

export async function updateDeliveryStatus(orderId: number, status: string): Promise<void> {
  await axiosClient.post(`/api/delivery/orders/${orderId}/status/${status}`);
}

export async function verifyDeliveryOtp(orderId: number, otp: string): Promise<void> {
  await axiosClient.post(`/api/delivery/orders/${orderId}/verify-otp`, { OTP: otp });
}

export async function rejectAssignedOrder(orderId: number, reason: string): Promise<void> {
  await axiosClient.post(`/api/delivery/orders/${orderId}/reject`, { reason });
}

