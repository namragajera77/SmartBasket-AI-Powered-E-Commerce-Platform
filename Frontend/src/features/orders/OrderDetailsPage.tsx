import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMyOrderById, rejectMyOrder } from "../../api/ordersApi";
import { Card } from "../../components/ui/Card";
import { PageSkeleton } from "../../components/feedback/PageSkeleton";
import { ErrorMessage } from "../../components/feedback/ErrorMessage";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { formatCurrency, formatDate } from "../../utils/http";
import { useState } from "react";
import { useToast } from "../../components/feedback/ToastProvider";

function isRejectedOrder(order: {
  status?: string;
  rejectedBy?: string;
  rejectionReason?: string;
  rejectedAtUtc?: string;
}) {
  const status = (order.status ?? "").toLowerCase();
  return (
    status.includes("reject") ||
    Boolean(order.rejectedBy) ||
    Boolean(order.rejectionReason) ||
    Boolean(order.rejectedAtUtc)
  );
}

export function OrderDetailsPage() {
  const params = useParams();
  const orderId = Number(params.orderId);
  const [rejectReason, setRejectReason] = useState("");
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const orderQuery = useQuery({
    queryKey: ["my-order", orderId],
    queryFn: () => getMyOrderById(orderId),
    enabled: Number.isFinite(orderId),
  });

  const rejectMutation = useMutation({
    mutationFn: () => rejectMyOrder(orderId, rejectReason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-order", orderId] });
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });
      showToast({ title: "Order rejected", variant: "success" });
      setRejectReason("");
    },
    onError: (error) => {
      showToast({ title: "Reject failed", description: error.message, variant: "error" });
    },
  });

  if (orderQuery.isLoading) {
    return <PageSkeleton rows={3} />;
  }

  if (orderQuery.isError || !orderQuery.data) {
    return <ErrorMessage message={orderQuery.error?.message ?? "Order not found."} />;
  }

  const order = orderQuery.data;
  const canReject = order.status !== "Delivered" && !isRejectedOrder(order);

  return (
    <div className="section-stack">
      <Card className="space-y-3">
        <h1 className="text-2xl font-bold text-gray-900">Order #{order.orderId}</h1>
        <p className="text-sm text-gray-500">Placed at {formatDate(order.orderedAtUtc)}</p>
        <p className="text-sm text-gray-500">Shipping: {order.shippingAddress || "N/A"}</p>
        <div className="flex items-center justify-between">
          <p className="status-pill bg-blue-50 text-blue-700">{order.status}</p>
          <p className="text-lg font-bold text-gray-900">{formatCurrency(order.totalAmount)}</p>
        </div>
        {order.deliveryOtp && !order.otpVerified && ["Assigned", "OutForDelivery"].includes(order.status) ? (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">Delivery OTP</p>
            <p className="mt-1 text-2xl font-bold tracking-[0.2em] text-amber-900">{order.deliveryOtp}</p>
            <p className="mt-1 text-xs text-amber-700">Show this OTP to your delivery person to complete handoff.</p>
          </div>
        ) : null}
        {canReject ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-red-700">Reject Order</p>
            <div className="mt-2 flex flex-wrap items-end gap-2">
              <Input
                label=""
                placeholder="Reason (e.g. wrong address, delayed, changed mind)"
                value={rejectReason}
                onChange={(event) => setRejectReason(event.target.value)}
              />
              <Button
                variant="danger"
                disabled={rejectMutation.isPending || rejectReason.trim().length < 3}
                onClick={() => rejectMutation.mutate()}
              >
                {rejectMutation.isPending ? "Rejecting..." : "Reject Order"}
              </Button>
            </div>
          </div>
        ) : null}
        {isRejectedOrder(order) ? (
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-rose-700">Rejection History</p>
            <p className="mt-1 text-sm text-rose-900">Rejected By: {order.rejectedBy ?? order.status}</p>
            <p className="mt-1 text-sm text-rose-900">Rejected At: {order.rejectedAtUtc ? formatDate(order.rejectedAtUtc) : "-"}</p>
            <p className="mt-1 text-sm text-rose-900">Reason: {order.rejectionReason ?? "-"}</p>
          </div>
        ) : null}
      </Card>

      <Card className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-900">Items</h2>
        <div className="grid gap-2">
          {order.items.map((item) => (
            <div key={item.productId} className="flex items-center justify-between rounded-xl border border-gray-200 p-3 transition-all duration-200 hover:shadow-md">
              <div>
                <p className="text-sm font-semibold text-gray-900">{item.productName}</p>
                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
              </div>
              <p className="text-sm font-medium text-gray-900">{formatCurrency(item.subtotal)}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

