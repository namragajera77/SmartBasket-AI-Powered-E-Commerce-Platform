# SmartBasket E-Commerce Platform - Complete Project Documentation

## 1. Project Overview

SmartBasket is a full-stack, role-based e-commerce platform built with:

- Backend API in ASP.NET Core
- Frontend SPA in React + TypeScript
- MySQL relational database
- AI-assisted search, recommendations, and content generation

The platform supports three operational panels:

- Customer panel
- Admin panel
- Delivery panel

Primary goals of the product:

- End-to-end order lifecycle management
- Secure authentication and authorization
- Catalog and category management
- Delivery assignment and OTP verification
- Rejection workflows with history tracking
- AI-enhanced discovery and product operations

## 2. Current Repository Structure

```text
E-Commerce/
  Backend/                         # ASP.NET Core API
    AI/
    Controllers/
    Data/
    DTOs/
    Helpers/
    Middleware/
    Migrations/
    Models/
    Repositories/
    Services/
    Program.cs
    EcommerceAI.csproj
    .env.example
    appsettings.Local.example.json

  Frontend/                        # React + Vite + TypeScript app
    src/
      api/
      app/
      auth/
      components/
      features/
      layouts/
      routes/
      types/
      utils/
    package.json

  E-Commerce.sln
  README.md
  PROJECT_DOCUMENTATION.md
  .gitignore
```

## 3. Technology Stack

### Backend

- .NET 10 (`net10.0`)
- ASP.NET Core Web API
- Entity Framework Core 8.0.13
- Pomelo MySQL provider 8.0.3
- JWT authentication
- BCrypt password hashing
- Serilog logging
- Swashbuckle Swagger/OpenAPI
- Built-in rate limiting middleware

### Frontend

- React 18
- TypeScript 5.9
- Vite 5
- Tailwind CSS 3
- React Router 6
- TanStack React Query 5
- Axios
- Framer Motion
- Lucide React icons

### Database

- MySQL 8+
- EF Core migrations + startup seeding

## 4. Core Business Domains

The platform data model is centered around:

- Users and roles: Admin, Customer, Delivery
- Product catalog and categories
- Cart and cart items
- Orders and order items
- Reviews and ratings
- Refresh tokens
- Delivery verification (OTP)
- Rejection metadata (who, why, when)

Key backend model files:

- `Backend/Models/User.cs`
- `Backend/Models/Product.cs`
- `Backend/Models/Category.cs`
- `Backend/Models/CartItem.cs`
- `Backend/Models/Order.cs`
- `Backend/Models/OrderItem.cs`
- `Backend/Models/Review.cs`
- `Backend/Models/RefreshToken.cs`

## 5. Role-Based Access Design

### Customer

- Browse products and product details
- Add/update/remove cart items
- Checkout with shipping address
- Track own orders
- View OTP for assigned/out-for-delivery orders
- Reject own order (before delivery completion)
- View rejection history in order views
- Use AI smart search

### Admin

- Access dashboard summary
- Manage categories
- Manage products (CRUD + image upload)
- View all orders
- Assign delivery staff
- Reject orders with reason
- View rejected order history table
- View past deliveries
- Use AI tools (description generation, review summary)

### Delivery

- View assigned orders
- Mark order status transitions
- Verify OTP for delivery completion
- Reject assigned orders with reason
- View past deliveries

## 6. Backend Architecture

Layered structure:

- Controllers: HTTP endpoints and role guards
- Services: business logic
- Repositories: data access abstraction
- Data: EF Core DbContext and startup seeders
- DTOs: API contract objects
- Middleware: exception handling and response wrapping

Important startup and infrastructure details from `Program.cs`:

- Loads `.env` file at startup
- Adds optional local appsettings overrides
- Supports environment variable overrides
- Enables JWT authentication and role authorization
- Configures CORS for localhost frontend ports 5173 and 5174
- Enables Swagger
- Enables Serilog request logging
- Enables rate limiting (100 req/min per IP)
- Applies startup seed/repair tasks

## 7. Frontend Architecture

Frontend organization follows feature-first modules:

- `src/features/home`
- `src/features/products`
- `src/features/cart`
- `src/features/orders`
- `src/features/admin`
- `src/features/delivery`
- `src/features/ai`
- `src/features/auth`

Routing is centralized in:

- `Frontend/src/routes/router.tsx`

Layout and navigation:

- `Frontend/src/layouts/MainLayout.tsx`
- `Frontend/src/components/ui/Navbar.tsx`
- `Frontend/src/components/ui/PanelSidebar.tsx`

State and networking patterns:

- API calls in `src/api/*`
- React Query for server state caching/invalidation
- Auth session in `src/auth/AuthContext.tsx`

## 8. Frontend Route Map

### Public routes

- `/`
- `/login`
- `/register`
- `/products`
- `/products/:productId`
- `/search`

### Customer routes

- `/cart`
- `/checkout`
- `/orders`
- `/orders/:orderId`

### Admin routes

- `/admin/dashboard`
- `/admin/categories`
- `/admin/products`
- `/admin/orders`
- `/admin/past-delivery`
- `/admin/ai-tools`

### Delivery routes

- `/delivery/orders`
- `/delivery/past-delivery`

## 9. API Endpoint Inventory

All routes are rooted under `/api`.

### Auth (`/api/auth`)

- `POST /register`
- `POST /login`
- `POST /refresh`
- `POST /dev-reset-password` (development utility)

### Products (`/api/products`)

- `GET /`
- `GET /{id}`
- `POST /` (Admin)
- `PUT /{id}` (Admin)
- `DELETE /{id}` (Admin)
- `POST /upload-image` (Admin)

### Categories (`/api/categories`)

- `GET /`
- `GET /{id}`
- `POST /` (Admin)

### Cart (`/api/cart`) - Authenticated

- `GET /`
- `POST /`
- `PUT /{cartItemId}`
- `DELETE /{cartItemId}`

### Orders (`/api/orders`) - Authenticated

- `POST /checkout`
- `GET /my`
- `GET /my/{id}`
- `GET /` (Admin)
- `POST /{orderId}/assign-delivery` (Admin)
- `POST /{orderId}/reject` (Customer)
- `POST /{orderId}/reject-admin` (Admin)
- `GET /delivery-users` (Admin)

### Delivery (`/api/delivery`) - Delivery role

- `GET /orders`
- `POST /orders/{orderId}/status/{status}`
- `POST /orders/{orderId}/verify-otp`
- `POST /orders/{orderId}/reject`

### Reviews (`/api/reviews`)

- `GET /product/{productId}`
- `POST /` (Authenticated)
- `PUT /{reviewId}` (Authenticated)
- `DELETE /{reviewId}` (Authenticated)

### AI (`/api/ai`)

- `POST /generate-description`
- `GET /reviews-summary/{productId}`
- `POST /smart-search`
- `GET /recommendations/{productId}`

### Secure test endpoints (`/api/secure`)

- `GET /me`
- `GET /admin` (Admin)
- `GET /customer` (Customer)
- `GET /delivery` (Delivery)

## 10. Order Lifecycle and Rejection Workflow

### Typical order flow

1. Customer adds items to cart
2. Customer checks out
3. Order created with `Pending`
4. Admin assigns delivery user -> `Assigned`
5. Delivery marks `OutForDelivery`
6. Delivery verifies OTP -> `Delivered`

### Rejection support

Orders can be rejected by:

- Customer
- Admin
- Delivery

Rejection metadata is stored and returned by API:

- `RejectedBy`
- `RejectionReason`
- `RejectedAtUtc`

Rejection behaviors:

- Delivered orders cannot be rejected
- Already rejected orders cannot be rejected again
- Delivery assignment/OTP fields are reset on rejection
- Product quantities are restored to stock on rejection

## 11. Security and Configuration

### Credentials handling

Project uses local-only secret files and env variables.

Tracked safe templates:

- `Backend/.env.example`
- `Backend/appsettings.Local.example.json`

Local secret files (ignored by git):

- `Backend/.env`
- `Backend/appsettings.Local.json`
- `Backend/appsettings.Development.json` (ignored)
- `Backend/appsettings.json` (ignored)

### `.env` variables currently expected

- `ConnectionStrings__DefaultConnection`
- `Jwt__Key`
- `Jwt__Issuer`
- `Jwt__Audience`
- `Jwt__ExpiresInMinutes`
- `Jwt__RefreshTokenDays`
- `HuggingFace__ApiKey`
- `HuggingFace__Model`
- `HuggingFace__Endpoint`
- `HuggingFace__EmbeddingModel`
- `HuggingFace__EmbeddingFallbackModel`

### JWT security

- Bearer token auth
- Role-based authorization attributes
- Refresh token support

### Runtime protections

- Global exception middleware
- API response wrapper filter
- IP-based rate limiting

## 12. Local Development Setup

## Prerequisites

- .NET SDK 10+
- Node.js 18+
- npm 9+
- MySQL 8+

## Backend setup

```powershell
cd Backend
copy .env.example .env
# update .env values

dotnet restore
dotnet build
dotnet run
```

Backend default URLs:

- API: `http://localhost:5000`
- Swagger: `http://localhost:5000/swagger`
- Health: `http://localhost:5000/health`

## Frontend setup

```powershell
cd Frontend
npm install
npm run dev
```

Frontend development URL:

- `http://localhost:5173` (or Vite-assigned port)

## Production build

```powershell
cd Backend
dotnet build

cd ..\Frontend
npm run build
```

## 13. Logging and Observability

- Serilog console logging
- Rolling file logs in `Backend/logs/`
- API request logging enabled
- Swagger documentation enabled by default

## 14. Current Known Notes

- `POST /api/auth/dev-reset-password` exists for development support and should be removed or restricted for production.
- Frontend production bundle currently shows chunk-size warning; functionality is unaffected.
- Backend uses nullable-disabled compilation (`<Nullable>disable</Nullable>`), so nullable warnings exist in some files.

## 15. Suggested Production Hardening Checklist

1. Disable or remove development reset-password endpoint.
2. Rotate all secrets used during local testing.
3. Add CI pipeline for backend build, frontend build, and lint/test checks.
4. Add environment-specific deployment configs.
5. Enable HTTPS and strict CORS in production.
6. Add API versioning and standardized error codes.

## 16. Quick Project Summary

SmartBasket is a complete role-based commerce platform with operational depth:

- Public storefront + account access
- Customer purchase and order tracking
- Admin operational control panel
- Delivery execution and OTP verification
- AI-assisted search and recommendations
- Rejection lifecycle with historical traceability

This repository is structured for active feature development and can be moved toward production with security hardening and CI/CD setup.
