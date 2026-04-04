import { useQuery } from "@tanstack/react-query";
import { getAllOrders } from "../../api/ordersApi";
import { getProducts } from "../../api/productsApi";
import { ErrorMessage } from "../../components/feedback/ErrorMessage";
import { Card } from "../../components/ui/Card";
import { formatCurrency } from "../../utils/http";

export function AdminDashboardPage() {
  const ordersQuery = useQuery({
    queryKey: ["admin", "orders", "summary"],
    queryFn: getAllOrders,
  });

  const productsQuery = useQuery({
    queryKey: ["admin", "products", "summary"],
    queryFn: () => getProducts({ page: 1, pageSize: 1 }),
  });

  const totalOrders = ordersQuery.data?.length ?? 0;
  const totalProducts = productsQuery.data?.totalItems ?? 0;
  const totalRevenue = (ordersQuery.data ?? []).reduce((sum, order) => sum + order.totalAmount, 0);

  return (
    <div className="section-stack">
      <Card>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">Manage catalog, orders, delivery assignment, and AI operations.</p>
      </Card>

      {ordersQuery.isError ? <ErrorMessage message={ordersQuery.error.message} /> : null}
      {productsQuery.isError ? <ErrorMessage message={productsQuery.error.message} /> : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Card className="p-6">
          <p className="text-sm font-medium text-gray-500">Total Orders</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{ordersQuery.isLoading ? "..." : totalOrders}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm font-medium text-gray-500">Total Products</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{productsQuery.isLoading ? "..." : totalProducts}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm font-medium text-gray-500">Revenue</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{ordersQuery.isLoading ? "..." : formatCurrency(totalRevenue)}</p>
        </Card>
      </div>
    </div>
  );
}

