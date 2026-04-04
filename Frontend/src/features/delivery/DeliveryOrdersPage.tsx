import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAssignedOrders, rejectAssignedOrder, updateDeliveryStatus, verifyDeliveryOtp } from "../../api/deliveryApi";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { PageSkeleton } from "../../components/feedback/PageSkeleton";
import { ErrorMessage } from "../../components/feedback/ErrorMessage";
import { EmptyState } from "../../components/feedback/EmptyState";
import { useToast } from "../../components/feedback/ToastProvider";
import { useAuth } from "../../auth/AuthContext";
import { formatCurrency, formatDate } from "../../utils/http";

export function DeliveryOrdersPage() {
  const [otpValues, setOtpValues] = useState<Record<number, string>>({});
  const [rejectReasons, setRejectReasons] = useState<Record<number, string>>({});
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { role } = useAuth();

  const ordersQuery = useQuery({
    queryKey: ["delivery-orders", role],
    queryFn: getAssignedOrders,
  });

  const verifyMutation = useMutation({
    mutationFn: ({ orderId, otp }: { orderId: number; otp: string }) => verifyDeliveryOtp(orderId, otp),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["delivery-orders"] });
      showToast({ title: "OTP verified", variant: "success" });
    },
    onError: (error) => {
      showToast({ title: "OTP verification failed", description: error.message, variant: "error" });
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ orderId, status }: { orderId: number; status: string }) => updateDeliveryStatus(orderId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["delivery-orders"] });
      showToast({ title: "Status updated", variant: "success" });
    },
    onError: (error) => {
      showToast({ title: "Status update failed", description: error.message, variant: "error" });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ orderId, reason }: { orderId: number; reason: string }) => rejectAssignedOrder(orderId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["delivery-orders"] });
      showToast({ title: "Order rejected", variant: "success" });
    },
    onError: (error) => {
      showToast({ title: "Reject failed", description: error.message, variant: "error" });
    },
  });

  const orders = ordersQuery.data ?? [];
  const activeOrders = orders.filter((order) => order.status !== "Delivered");

  if (import.meta.env.DEV && !ordersQuery.isLoading && !ordersQuery.isError) {
    console.debug("[Delivery orders]", { role, count: activeOrders.length });
  }

  return (
    <div className="section-stack">
      <Card className="relative overflow-hidden">
        <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-orange-100 blur-2xl" />
        <h1 className="text-2xl font-bold text-gray-900">Assigned Deliveries</h1>
      </Card>

      {ordersQuery.isLoading ? <PageSkeleton rows={5} /> : null}
      {ordersQuery.isError ? <ErrorMessage message={ordersQuery.error.message} /> : null}

      {!ordersQuery.isLoading && !ordersQuery.isError && activeOrders.length === 0 ? (
        <EmptyState
          title="No assigned deliveries"
          message="No orders are currently assigned to your delivery account."
        />
      ) : null}

      <div className="grid gap-4">
        {activeOrders.map((order) => (
          <Card key={order.orderId} className="space-y-4 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-gray-900">Order #{order.orderId}</p>
                <p className="text-sm text-gray-500">Address: {order.shippingAddress || "N/A"}</p>
                <p className="text-sm text-gray-500">{formatDate(order.orderedAtUtc)}</p>
              </div>
              <p
                className={`status-pill ${
                  order.status === "Delivered"
                    ? "bg-emerald-100 text-emerald-700"
                    : order.status === "OutForDelivery"
                      ? "bg-orange-100 text-orange-700"
                      : "bg-blue-100 text-blue-700"
                }`}
              >
                {order.status}
              </p>
              <p className="text-lg font-bold text-gray-900">{formatCurrency(order.totalAmount)}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="secondary"
                disabled={statusMutation.isPending || verifyMutation.isPending || order.status === "OutForDelivery" || order.status === "Delivered"}
                className="hover:shadow-md"
                onClick={() => statusMutation.mutate({ orderId: order.orderId, status: "OutForDelivery" })}
              >
                Mark Out For Delivery
              </Button>
            </div>

            <div className="flex flex-wrap items-end gap-3">
              <Input
                label="Delivery OTP"
                value={otpValues[order.orderId] ?? ""}
                onChange={(event) =>
                  setOtpValues((previous) => ({
                    ...previous,
                    [order.orderId]: event.target.value,
                  }))
                }
              />
              <Button
                className="hover:shadow-md"
                disabled={verifyMutation.isPending || statusMutation.isPending || !otpValues[order.orderId]?.trim() || order.status === "Delivered"}
                onClick={() =>
                  verifyMutation.mutate({ orderId: order.orderId, otp: otpValues[order.orderId] ?? "" })
                }
              >
                Verify OTP
              </Button>
            </div>

            <div className="rounded-lg border border-red-200 bg-red-50 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-red-700">Cannot deliver?</p>
              <div className="mt-2 flex flex-wrap items-end gap-2">
                <Input
                  label=""
                  placeholder="Reason for rejecting this delivery"
                  value={rejectReasons[order.orderId] ?? ""}
                  onChange={(event) =>
                    setRejectReasons((previous) => ({
                      ...previous,
                      [order.orderId]: event.target.value,
                    }))
                  }
                />
                <Button
                  variant="danger"
                  disabled={
                    rejectMutation.isPending ||
                    statusMutation.isPending ||
                    verifyMutation.isPending ||
                    (rejectReasons[order.orderId]?.trim().length ?? 0) < 3 ||
                    order.status === "Delivered"
                  }
                  onClick={() =>
                    rejectMutation.mutate({
                      orderId: order.orderId,
                      reason: rejectReasons[order.orderId] ?? "",
                    })
                  }
                >
                  {rejectMutation.isPending ? "Rejecting..." : "Reject Delivery"}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

