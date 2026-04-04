import { useQuery } from "@tanstack/react-query";
import { BarChart3, Boxes, CircleDollarSign, ClipboardList } from "lucide-react";
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
      <Card className="relative overflow-hidden">
        <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-blue-100 blur-2xl" />
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">Manage catalog, orders, delivery assignment, and AI operations.</p>
      </Card>

      {ordersQuery.isError ? <ErrorMessage message={ordersQuery.error.message} /> : null}
      {productsQuery.isError ? <ErrorMessage message={productsQuery.error.message} /> : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">Total Orders</p>
            <span className="rounded-xl bg-blue-50 p-2 text-blue-600"><ClipboardList size={18} /></span>
          </div>
          <p className="mt-3 text-3xl font-bold text-gray-900">{ordersQuery.isLoading ? "..." : totalOrders}</p>
          <p className="mt-1 text-xs text-slate-500">All statuses included</p>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">Total Products</p>
            <span className="rounded-xl bg-orange-50 p-2 text-orange-600"><Boxes size={18} /></span>
          </div>
          <p className="mt-3 text-3xl font-bold text-gray-900">{productsQuery.isLoading ? "..." : totalProducts}</p>
          <p className="mt-1 text-xs text-slate-500">Live catalog inventory</p>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">Revenue</p>
            <span className="rounded-xl bg-emerald-50 p-2 text-emerald-600"><CircleDollarSign size={18} /></span>
          </div>
          <p className="mt-3 text-3xl font-bold text-gray-900">{ordersQuery.isLoading ? "..." : formatCurrency(totalRevenue)}</p>
          <p className="mt-1 text-xs text-slate-500">Gross sales volume</p>
        </Card>
      </div>

      <Card className="p-6">
        <div className="mb-4 flex items-center gap-2 text-slate-800">
          <BarChart3 size={18} />
          <p className="text-sm font-semibold uppercase tracking-wide">Quick Revenue Pulse</p>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-orange-500"
            style={{ width: `${Math.min(100, Math.round((totalRevenue / Math.max(totalRevenue, 1000)) * 100))}%` }}
          />
        </div>
      </Card>
    </div>
  );
}

