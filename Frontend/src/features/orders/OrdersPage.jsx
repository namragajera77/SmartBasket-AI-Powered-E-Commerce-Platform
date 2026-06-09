import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getMyOrders } from "../../api/ordersApi";
import { Card } from "../../components/ui/Card";
import { PageSkeleton } from "../../components/feedback/PageSkeleton";
import { ErrorMessage } from "../../components/feedback/ErrorMessage";
import { EmptyState } from "../../components/feedback/EmptyState";
import { formatCurrency, formatDate } from "../../utils/http";

function isRejectedOrder(order) {
  const status = (order.status ?? "").toLowerCase();
  return (
    status.includes("reject") ||
    Boolean(order.rejectedBy) ||
    Boolean(order.rejectionReason) ||
    Boolean(order.rejectedAtUtc)
  );
}

export function OrdersPage() {
  const ordersQuery = useQuery({
    queryKey: ["my-orders"],
    queryFn: getMyOrders,
  });

  if (ordersQuery.isLoading) {
    return <PageSkeleton rows={5} />;
  }

  if (ordersQuery.isError) {
    return <ErrorMessage message={ordersQuery.error.message} />;
  }

  const orders = ordersQuery.data ?? [];

  if (orders.length === 0) {
    return (
      <EmptyState
        title="No orders yet"
        message="Place your first order from the products page."
      />
    );
  }

  return (
    <div className="section-stack">
      <Card>
        <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
      </Card>

      <div className="grid gap-4">
        {orders.map((order) => (
          <Link
            key={order.orderId}
            to={`/orders/${order.orderId}`}
            className="card-surface-hover block p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Order #{order.orderId}
                </p>
                <p className="text-sm text-gray-500">
                  {formatDate(order.orderedAtUtc)}
                </p>
                {order.deliveryOtp &&
                !order.otpVerified &&
                ["Assigned", "OutForDelivery"].includes(order.status) ? (
                  <p className="mt-1 text-xs font-semibold text-amber-700">
                    OTP to share with delivery boy: {order.deliveryOtp}
                  </p>
                ) : null}
                {isRejectedOrder(order) ? (
                  <p className="mt-1 text-xs font-semibold text-rose-700">
                    {order.rejectedBy ?? order.status}:{" "}
                    {order.rejectionReason ?? "No reason provided"}
                  </p>
                ) : null}
              </div>
              <p className="status-pill bg-blue-50 text-blue-700">
                {order.status}
              </p>
              <p className="text-lg font-bold text-gray-900">
                {formatCurrency(order.totalAmount)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
