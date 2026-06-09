import { axiosClient, unwrapResponse } from "./axiosClient";

export async function getAssignedOrders() {
  return unwrapResponse(axiosClient.get("/api/delivery/orders"));
}

export async function updateDeliveryStatus(orderId, status) {
  await axiosClient.post(`/api/delivery/orders/${orderId}/status/${status}`);
}

export async function verifyDeliveryOtp(orderId, otp) {
  await axiosClient.post(`/api/delivery/orders/${orderId}/verify-otp`, {
    OTP: otp,
  });
}

export async function rejectAssignedOrder(orderId, reason) {
  await axiosClient.post(`/api/delivery/orders/${orderId}/reject`, { reason });
}
