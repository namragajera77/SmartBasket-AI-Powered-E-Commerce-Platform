import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { checkout } from "../../api/ordersApi";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { ErrorMessage } from "../../components/feedback/ErrorMessage";
import { useToast } from "../../components/feedback/ToastProvider";

export function CheckoutPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [shippingAddress, setShippingAddress] = useState("");

  const checkoutMutation = useMutation({
    mutationFn: () => checkout({ shippingAddress }),
    onSuccess: (order) => {
      queryClient.setQueryData(["cart"], []);
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });
      showToast({
        title: "Order placed",
        description: `Order #${order.orderId} created successfully.`,
        variant: "success",
      });
      navigate(`/orders/${order.orderId}`);
    },
    onError: (error) => {
      showToast({ title: "Checkout failed", description: error.message, variant: "error" });
    },
  });

  return (
    <div className="mx-auto max-w-3xl section-stack">
      <Card className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
            <p className="text-sm text-gray-600">Submit your shipping details to place the order.</p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600">
            <span className="rounded-full bg-blue-600 px-2 py-1 text-white">1</span>
            Shipping
            <span className="text-slate-300">/</span>
            <span className="rounded-full bg-slate-300 px-2 py-1 text-white">2</span>
            Confirmation
          </div>
        </div>

        <form
          className="space-y-5"
          onSubmit={(event) => {
            event.preventDefault();
            checkoutMutation.mutate();
          }}
        >
          <Input
            id="shippingAddress"
            label="Shipping Address"
            value={shippingAddress}
            onChange={(event) => setShippingAddress(event.target.value)}
            placeholder="Street, city, postal code"
          />

          <div className="rounded-2xl border border-orange-100 bg-orange-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-orange-600">Order Summary</p>
            <p className="mt-2 text-sm text-orange-900">Your cart items and total amount will be confirmed in the next step.</p>
          </div>

          {checkoutMutation.isError ? <ErrorMessage message={checkoutMutation.error.message} /> : null}

          <Button type="submit" className="w-full sm:w-auto" disabled={checkoutMutation.isPending || shippingAddress.trim().length < 8}>
            {checkoutMutation.isPending ? "Placing order..." : "Place Order"}
          </Button>
        </form>
      </Card>
    </div>
  );
}

