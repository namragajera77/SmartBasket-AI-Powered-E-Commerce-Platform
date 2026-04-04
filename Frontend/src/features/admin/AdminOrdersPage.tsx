import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { assignDelivery, getAllOrders, getDeliveryUsers, rejectOrderAsAdmin } from "../../api/ordersApi";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { PageSkeleton } from "../../components/feedback/PageSkeleton";
import { ErrorMessage } from "../../components/feedback/ErrorMessage";
import { useToast } from "../../components/feedback/ToastProvider";
import { formatCurrency, formatDate } from "../../utils/http";

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

export function AdminOrdersPage() {
  const [deliveryInput, setDeliveryInput] = useState<Record<number, string>>({});
  const [rejectInput, setRejectInput] = useState<Record<number, string>>({});
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const ordersQuery = useQuery({
    queryKey: ["admin-orders"],
    queryFn: getAllOrders,
  });

  const deliveryUsersQuery = useQuery({
    queryKey: ["delivery-users", "admin-picker"],
    queryFn: getDeliveryUsers,
  });

  const assignMutation = useMutation({
    mutationFn: ({ orderId, deliveryBoyId }: { orderId: number; deliveryBoyId: number }) =>
      assignDelivery(orderId, { deliveryBoyId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["delivery-orders"] });
      showToast({ title: "Delivery assigned", variant: "success" });
    },
    onError: (error) => {
      showToast({ title: "Assign failed", description: error.message, variant: "error" });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ orderId, reason }: { orderId: number; reason: string }) => rejectOrderAsAdmin(orderId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["delivery-orders"] });
      showToast({ title: "Order rejected", variant: "success" });
    },
    onError: (error) => {
      showToast({ title: "Reject failed", description: error.message, variant: "error" });
    },
  });

  const orders = ordersQuery.data ?? [];
  const rejectedOrders = useMemo(
    () => orders.filter(isRejectedOrder),
    [orders],
  );
  const activeOrders = useMemo(
    () => orders.filter((order) => order.status !== "Delivered" && !isRejectedOrder(order)),
    [orders],
  );
  const totalPages = Math.max(1, Math.ceil(activeOrders.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pagedOrders = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return activeOrders.slice(start, start + pageSize);
  }, [activeOrders, currentPage]);

  return (
    <div className="section-stack">
      <Card>
        <h1 className="text-2xl font-bold text-gray-900">Order Operations</h1>
        <p className="mt-1 text-sm text-gray-600">Assign delivery staff and track status lifecycle.</p>
      </Card>

      {ordersQuery.isLoading ? <PageSkeleton rows={5} /> : null}
      {ordersQuery.isError ? <ErrorMessage message={ordersQuery.error.message} /> : null}
      {deliveryUsersQuery.isError ? <ErrorMessage message={deliveryUsersQuery.error.message} /> : null}

      <Card>
        <h2 className="text-lg font-semibold text-gray-900">Delivery Staff IDs</h2>
        <p className="mt-1 text-sm text-gray-600">Use these IDs when assigning orders.</p>
        <div className="mt-3 max-h-44 overflow-auto rounded-lg border border-gray-200 bg-gray-50 p-3">
          {deliveryUsersQuery.isLoading ? <p className="text-sm text-gray-500">Loading delivery staff...</p> : null}
          {(deliveryUsersQuery.data ?? []).map((user) => (
            <button
              key={user.id}
              type="button"
              className="block w-full rounded px-2 py-1 text-left text-sm hover:bg-blue-50"
            >
              #{user.id} - {user.fullName} ({user.email})
            </button>
          ))}
          {(deliveryUsersQuery.data ?? []).length === 0 && !deliveryUsersQuery.isLoading ? (
            <p className="text-sm text-gray-500">No delivery users found.</p>
          ) : null}
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Placed At</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Delivery / OTP</th>
                <th className="px-4 py-3">Assign Delivery</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {pagedOrders.map((order) => {
                const isLockedAssignment = ["Assigned", "OutForDelivery", "Delivered"].includes(order.status) || isRejectedOrder(order);

                return <tr key={order.orderId} className="transition-all duration-200 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">#{order.orderId}</td>
                  <td className="px-4 py-3 text-gray-600">{formatDate(order.orderedAtUtc)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`status-pill ${
                        order.status === "Delivered"
                          ? "bg-emerald-100 text-emerald-700"
                          : order.status === "OutForDelivery"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-900">{formatCurrency(order.totalAmount)}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">
                    <p>Delivery ID: {order.deliveryBoyId ?? "-"}</p>
                    <p>OTP: {order.deliveryOtp ?? "-"}</p>
                    <p>Verified: {order.otpVerified ? "Yes" : "No"}</p>
                  </td>
                  <td className="px-4 py-3">
                    {isLockedAssignment ? (
                      <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Already assigned</span>
                    ) : (
                      <div className="flex min-w-64 items-end gap-2">
                        <Input
                          label=""
                          type="number"
                          value={deliveryInput[order.orderId] ?? ""}
                          onChange={(event) =>
                            setDeliveryInput((previous) => ({
                              ...previous,
                              [order.orderId]: event.target.value,
                            }))
                          }
                          placeholder="Delivery ID"
                        />
                        <select
                          className="h-10 min-w-52 rounded-lg border border-gray-300 bg-white px-2 py-2 text-sm"
                          value={deliveryInput[order.orderId] ?? ""}
                          onChange={(event) =>
                            setDeliveryInput((previous) => ({
                              ...previous,
                              [order.orderId]: event.target.value,
                            }))
                          }
                        >
                          <option value="">Select delivery user</option>
                          {(deliveryUsersQuery.data ?? []).map((user) => (
                            <option key={user.id} value={String(user.id)}>
                              {user.id} - {user.fullName}
                            </option>
                          ))}
                        </select>
                        <Button
                          className="min-w-24"
                          disabled={assignMutation.isPending || Number(deliveryInput[order.orderId] ?? 0) <= 0}
                          onClick={() =>
                            assignMutation.mutate({
                              orderId: order.orderId,
                              deliveryBoyId: Number(deliveryInput[order.orderId] ?? 0),
                            })
                          }
                        >
                          Assign
                        </Button>
                      </div>
                    )}
                    <div className="mt-2 flex min-w-64 items-end gap-2">
                      <Input
                        label=""
                        value={rejectInput[order.orderId] ?? ""}
                        onChange={(event) =>
                          setRejectInput((previous) => ({
                            ...previous,
                            [order.orderId]: event.target.value,
                          }))
                        }
                        placeholder="Reject reason"
                      />
                      <Button
                        variant="danger"
                        className="min-w-24"
                        disabled={rejectMutation.isPending || (rejectInput[order.orderId] ?? "").trim().length < 3}
                        onClick={() =>
                          rejectMutation.mutate({
                            orderId: order.orderId,
                            reason: (rejectInput[order.orderId] ?? "").trim(),
                          })
                        }
                      >
                        Reject
                      </Button>
                    </div>
                  </td>
                </tr>
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-gray-500">
            Showing page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button variant="secondary" disabled={currentPage <= 1} onClick={() => setPage((previous) => Math.max(1, previous - 1))}>
              Previous
            </Button>
            <Button disabled={currentPage >= totalPages} onClick={() => setPage((previous) => Math.min(totalPages, previous + 1))}>
              Next
            </Button>
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-gray-900">Rejected Orders History</h2>
        <p className="mt-1 text-sm text-gray-600">Tracks why and when orders were rejected.</p>
        <div className="mt-3 overflow-x-auto rounded-xl border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Rejected By</th>
                <th className="px-4 py-3">Rejected At</th>
                <th className="px-4 py-3">Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {rejectedOrders.map((order) => (
                <tr key={`rejected-${order.orderId}`} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">#{order.orderId}</td>
                  <td className="px-4 py-3 text-gray-700">{order.rejectedBy ?? order.status}</td>
                  <td className="px-4 py-3 text-gray-600">{order.rejectedAtUtc ? formatDate(order.rejectedAtUtc) : "-"}</td>
                  <td className="px-4 py-3 text-gray-700">{order.rejectionReason ?? "-"}</td>
                </tr>
              ))}
              {rejectedOrders.length === 0 ? (
                <tr>
                  <td className="px-4 py-4 text-sm text-gray-500" colSpan={4}>
                    No rejected orders yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

