import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCart, removeCartItem, updateCartItem } from "../../api/cartApi";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { PageSkeleton } from "../../components/feedback/PageSkeleton";
import { ErrorMessage } from "../../components/feedback/ErrorMessage";
import { EmptyState } from "../../components/feedback/EmptyState";
import { useToast } from "../../components/feedback/ToastProvider";
import { formatCurrency } from "../../utils/http";

export function CartPage() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const cartQuery = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
  });

  const updateMutation = useMutation({
    mutationFn: ({ cartItemId, quantity }: { cartItemId: number; quantity: number }) =>
      updateCartItem(cartItemId, { quantity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      showToast({ title: "Cart updated", variant: "success" });
    },
    onError: (error) => {
      showToast({ title: "Cart update failed", description: error.message, variant: "error" });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (cartItemId: number) => removeCartItem(cartItemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      showToast({ title: "Item removed", variant: "success" });
    },
    onError: (error) => {
      showToast({ title: "Remove failed", description: error.message, variant: "error" });
    },
  });

  if (cartQuery.isLoading) {
    return <PageSkeleton rows={4} />;
  }

  if (cartQuery.isError) {
    return <ErrorMessage message={cartQuery.error.message} />;
  }

  const items = cartQuery.data ?? [];
  const total = items.reduce((sum, item) => sum + item.subtotal, 0);

  if (items.length === 0) {
    return <EmptyState title="Cart is empty" message="Add products to your cart to start checkout." />;
  }

  return (
    <div className="section-stack">
      <Card>
        <h1 className="text-2xl font-bold text-gray-900">Your Cart</h1>
        <p className="mt-1 text-sm text-gray-600">Review selected items and continue to checkout.</p>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
        <div className="space-y-4">
          {items.map((item) => (
            <Card key={item.cartItemId} className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{item.productName}</h2>
                <p className="text-sm text-gray-500">{formatCurrency(item.price)} each</p>
                <p className="text-sm font-semibold text-gray-800">Subtotal: {formatCurrency(item.subtotal)}</p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  disabled={updateMutation.isPending}
                  onClick={() => updateMutation.mutate({ cartItemId: item.cartItemId, quantity: Math.max(1, item.quantity - 1) })}
                >
                  -
                </Button>
                <span className="w-10 text-center text-sm font-semibold">{item.quantity}</span>
                <Button
                  variant="secondary"
                  disabled={updateMutation.isPending}
                  onClick={() => updateMutation.mutate({ cartItemId: item.cartItemId, quantity: item.quantity + 1 })}
                >
                  +
                </Button>
                <Button variant="secondary" disabled={removeMutation.isPending} onClick={() => removeMutation.mutate(item.cartItemId)}>
                  Remove
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <Card className="h-fit space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Order Summary</h3>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Items</span>
            <span>{items.length}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Total</span>
            <span className="font-semibold text-gray-900">{formatCurrency(total)}</span>
          </div>
          <Link to="/checkout" className="block">
            <Button className="w-full">Proceed To Checkout</Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}

