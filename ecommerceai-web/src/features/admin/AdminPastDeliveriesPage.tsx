import { useQuery } from "@tanstack/react-query";
import { getAllOrders } from "../../api/ordersApi";
import { Card } from "../../components/ui/Card";
import { PageSkeleton } from "../../components/feedback/PageSkeleton";
import { ErrorMessage } from "../../components/feedback/ErrorMessage";
import { EmptyState } from "../../components/feedback/EmptyState";
import { formatCurrency, formatDate } from "../../utils/http";

export function AdminPastDeliveriesPage() {
  const ordersQuery = useQuery({
    queryKey: ["admin-orders", "past-delivery"],
    queryFn: getAllOrders,
  });

  if (ordersQuery.isLoading) {
    return <PageSkeleton rows={5} />;
  }

  if (ordersQuery.isError) {
    return <ErrorMessage message={ordersQuery.error.message} />;
  }

  const deliveredOrders = (ordersQuery.data ?? []).filter((order) => order.status === "Delivered");

  if (deliveredOrders.length === 0) {
    return <EmptyState title="No past deliveries" message="Delivered orders will appear here." />;
  }

  return (
    <div className="section-stack">
      <Card>
        <h1 className="text-2xl font-bold text-gray-900">Past Delivery (Admin)</h1>
        <p className="mt-1 text-sm text-gray-600">Delivered orders history.</p>
      </Card>

      <Card>
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Delivered Status</th>
                <th className="px-4 py-3">Ordered At</th>
                <th className="px-4 py-3">Delivery ID</th>
                <th className="px-4 py-3">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {deliveredOrders.map((order) => (
                <tr key={order.orderId} className="transition-all duration-200 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">#{order.orderId}</td>
                  <td className="px-4 py-3 text-emerald-700">{order.status}</td>
                  <td className="px-4 py-3 text-gray-600">{formatDate(order.orderedAtUtc)}</td>
                  <td className="px-4 py-3 text-gray-600">{order.deliveryBoyId ?? "-"}</td>
                  <td className="px-4 py-3 text-gray-900">{formatCurrency(order.totalAmount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}