import { useQuery } from "@tanstack/react-query";
import { getAssignedOrders } from "../../api/deliveryApi";
import { Card } from "../../components/ui/Card";
import { PageSkeleton } from "../../components/feedback/PageSkeleton";
import { ErrorMessage } from "../../components/feedback/ErrorMessage";
import { EmptyState } from "../../components/feedback/EmptyState";
import { formatCurrency, formatDate } from "../../utils/http";

export function DeliveryPastDeliveriesPage() {
  const ordersQuery = useQuery({
    queryKey: ["delivery-orders", "past"],
    queryFn: getAssignedOrders,
  });

  if (ordersQuery.isLoading) {
    return <PageSkeleton rows={5} />;
  }

  if (ordersQuery.isError) {
    return <ErrorMessage message={ordersQuery.error.message} />;
  }

  const deliveredOrders = (ordersQuery.data ?? []).filter((order) => order.status === "Delivered");

  if (deliveredOrders.length === 0) {
    return <EmptyState title="No past deliveries" message="Completed deliveries will appear here." />;
  }

  return (
    <div className="section-stack">
      <Card>
        <h1 className="text-2xl font-bold text-gray-900">Past Delivery</h1>
        <p className="mt-1 text-sm text-gray-600">Your completed deliveries history.</p>
      </Card>

      <div className="grid gap-4">
        {deliveredOrders.map((order) => (
          <Card key={order.orderId} className="space-y-2 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-gray-900">Order #{order.orderId}</p>
                <p className="text-xs text-gray-500">{formatDate(order.orderedAtUtc)}</p>
              </div>
              <p className="status-pill bg-emerald-100 text-emerald-700">Delivered</p>
              <p className="text-lg font-bold text-gray-900">{formatCurrency(order.totalAmount)}</p>
            </div>
            <p className="text-xs text-gray-500">Address: {order.shippingAddress || "N/A"}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}