import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { HomePage } from "../features/home/Home";
import { LoginPage } from "../features/auth/Login";
import { RegisterPage } from "../features/auth/Register";
import { ProductsPage } from "../features/products/Products";
import { ProductDetailPage } from "../features/products/ProductDetail";
import { RoleGuard } from "./RoleGuard";
import { CartPage } from "../features/cart/CartPage";
import { CheckoutPage } from "../features/orders/CheckoutPage";
import { OrdersPage } from "../features/orders/OrdersPage";
import { OrderDetailsPage } from "../features/orders/OrderDetailsPage";
import { SmartSearchPage } from "../features/ai/SmartSearchPage";
import { AdminDashboardPage } from "../features/admin/AdminDashboardPage";
import { AdminCategoriesPage } from "../features/admin/AdminCategoriesPage";
import { AdminProductsPage } from "../features/admin/AdminProductsPage";
import { AdminOrdersPage } from "../features/admin/AdminOrdersPage";
import { AdminAiToolsPage } from "../features/ai/AdminAiToolsPage";
import { DeliveryOrdersPage } from "../features/delivery/DeliveryOrdersPage";
import { AdminPastDeliveriesPage } from "../features/admin/AdminPastDeliveriesPage";
import { DeliveryPastDeliveriesPage } from "../features/delivery/DeliveryPastDeliveriesPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
      {
        path: "products",
        element: <ProductsPage />,
      },
      {
        path: "products/:productId",
        element: <ProductDetailPage />,
      },
      {
        path: "search",
        element: <SmartSearchPage />,
      },
      {
        element: <RoleGuard roles={["Customer"]} />,
        children: [
          {
            path: "cart",
            element: <CartPage />,
          },
          {
            path: "checkout",
            element: <CheckoutPage />,
          },
          {
            path: "orders",
            element: <OrdersPage />,
          },
          {
            path: "orders/:orderId",
            element: <OrderDetailsPage />,
          },
        ],
      },
      {
        element: <RoleGuard roles={["Admin"]} />,
        children: [
          {
            path: "admin/dashboard",
            element: <AdminDashboardPage />,
          },
          {
            path: "admin/categories",
            element: <AdminCategoriesPage />,
          },
          {
            path: "admin/products",
            element: <AdminProductsPage />,
          },
          {
            path: "admin/orders",
            element: <AdminOrdersPage />,
          },
          {
            path: "admin/past-delivery",
            element: <AdminPastDeliveriesPage />,
          },
          {
            path: "admin/ai-tools",
            element: <AdminAiToolsPage />,
          },
        ],
      },
      {
        element: <RoleGuard roles={["Delivery"]} />,
        children: [
          {
            path: "delivery/orders",
            element: <DeliveryOrdersPage />,
          },
          {
            path: "delivery/past-delivery",
            element: <DeliveryPastDeliveriesPage />,
          },
        ],
      },
    ],
  },
]);

