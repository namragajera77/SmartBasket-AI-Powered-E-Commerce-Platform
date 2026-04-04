# EcommerceAI Unified Feature Document

Last updated: 2026-04-04

This document is the single source of truth for current implemented features across Home, Customer, Admin, and Delivery panels.

## 1. Public + Home Experience

### Home Page
- Public landing page is available for all users.
- Top navigation includes Home, Products, and role-specific links after login.
- Mobile drawer navigation is implemented.
- Global search input is visible in navbar UI.

### Public Routes
- Login
- Register
- Products listing
- Product details

## 2. Customer Panel

### Shopping
- Browse products with pagination/filtering/sorting.
- View product details.
- Add product to cart.
- Update/remove cart items.

### Checkout and Orders
- Checkout with shipping address.
- Cart is cleared after successful checkout.
- View My Orders list.
- View Order Details page.

### Delivery OTP and Order Control
- Customer sees delivery OTP when status is Assigned/OutForDelivery and OTP is pending.
- Customer can reject order only when not delivered.
- If order is rejected, customer can see rejection history:
	- Rejected by
	- Rejected at
	- Rejection reason

### Customer AI
- AI Search page is available to customer.

## 3. Admin Panel

### Dashboard
- Admin dashboard route is available.
- Dashboard metrics are populated from live API data.

### Category Management
- List categories.
- Create categories.

### Product Management
- Create, update, delete products.
- Product table with pagination.
- Image upload and image URL handling.
- AI product description assistance.

### Order Operations
- View active order operations list.
- Assign delivery user by picker or ID.
- Assignment lock for assigned, out-for-delivery, delivered, and rejected orders.
- Reject order as admin with reason.
- View OTP and verification status.

### Rejection History (Admin)
- Dedicated rejected-orders history section is visible.
- Shows:
	- Order ID
	- Rejected by
	- Rejected at
	- Rejection reason

### Past Delivery (Admin)
- Delivered orders are separated from active operations.
- Admin Past Delivery page is available.

### Admin AI Tools
- Generate product descriptions.
- Summarize reviews.
- Product ID helper/list is available for AI tools.

## 4. Delivery Panel

### Active Delivery Operations
- View assigned deliveries.
- Mark order OutForDelivery.
- Verify delivery OTP to complete delivery.

### Delivery Rejection
- Delivery user can reject assigned delivery with reason.
- Rejected delivery updates order rejection metadata.

### Past Delivery (Delivery)
- Delivered orders are moved to Delivery Past Delivery page.

## 5. Backend Platform Features

### Authentication and Authorization
- Register (Customer default role).
- Login with JWT.
- Refresh token with rotation.
- Role-based authorization for Admin, Customer, Delivery.

### Auth Reliability
- Supports legacy non-BCrypt password records on login.
- Automatically upgrades legacy password storage to BCrypt after successful login.

### Orders, Rejection, and Tracking
- Admin/customer/delivery rejection flows implemented.
- Rejection metadata persisted on order:
	- RejectedBy
	- RejectionReason
	- RejectedAtUtc
- Delivered orders cannot be rejected.

### API/Infra
- Standard API response wrapper.
- Global exception middleware.
- Rate limiting enabled.
- Swagger with JWT support.
- Serilog console + rolling file logging.
- MySQL integration via EF Core.

## 6. Route Overview (Frontend)

### Public
- /
- /login
- /register
- /products
- /products/:productId
- /search

### Customer
- /cart
- /checkout
- /orders
- /orders/:orderId

### Admin
- /admin/dashboard
- /admin/categories
- /admin/products
- /admin/orders
- /admin/past-delivery
- /admin/ai-tools

### Delivery
- /delivery/orders
- /delivery/past-delivery

## 7. Current Local Runtime

- Backend API: http://localhost:5000
- Swagger: http://localhost:5000/swagger
- Frontend dev server: http://localhost:5174

