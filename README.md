
# SmartBasket E-Commerce Platform

AI-powered e-commerce platform with three role-based panels:
- Customer panel
- Admin panel
- Delivery panel

This repository contains:
- ASP.NET Core backend API (`EcommerceAI`)
- React + Vite frontend (`ecommerceai-web`)

## Overview

SmartBasket is a full-stack commerce system focused on practical operations:
- Product and category management
- Cart and checkout flow
- Order assignment and delivery tracking
- OTP-based delivery verification
- Rejection workflows with history
- AI-assisted search and admin tools

## Panels and Current Features

### Home / Public
- Home page
- Product catalog browsing
- Product details
- Login / Register

### Customer Panel
- Add/update/remove cart items
- Checkout with shipping address
- My orders list and order details
- See delivery OTP for assigned/out-for-delivery orders
- Reject order (only before delivered)
- View rejection history (who/when/reason)
- AI Smart Search

### Admin Panel
- Dashboard
- Category management
- Product CRUD
- Product image upload
- Order operations and delivery assignment
- Assignment lock for already assigned/out-for-delivery/delivered/rejected orders
- Admin reject order with reason
- Rejected orders history table
- Past Delivery page
- AI tools (description generation, review summary)

### Delivery Panel
- Assigned deliveries list
- Mark order as out for delivery
- OTP verification for delivery completion
- Reject assigned delivery with reason
- Past Delivery page

## Tech Stack

### Backend
- .NET 10 (ASP.NET Core Web API)
- Entity Framework Core + Pomelo MySQL
- JWT authentication + refresh token rotation
- BCrypt password hashing
- Serilog logging
- Swagger/OpenAPI
- Rate limiting and global exception middleware

### Frontend
- React 18 + TypeScript
- Vite
- React Router
- TanStack React Query
- Axios
- Tailwind CSS

## Project Structure

```text
E-Commerce/
  EcommerceAI/              # Backend API
  ecommerceai-web/          # Frontend app
  E-Commerce.sln
  CURRENT_FEATURES.md
```

## Prerequisites

- .NET SDK 10.x
- Node.js 18+
- npm 9+
- MySQL 8+

## Configuration

Important: do not commit credentials.

Create local backend config files if missing:
- `EcommerceAI/appsettings.json`
- `EcommerceAI/appsettings.Development.json`

Use a connection string format like:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Port=3306;Database=smartbasket_dev;User=YOUR_USER;Password=YOUR_PASSWORD;SslMode=none;AllowPublicKeyRetrieval=True;TreatTinyAsBoolean=false"
  },
  "Jwt": {
    "Key": "your-long-random-secret-key",
    "Issuer": "SmartBasket",
    "Audience": "SmartBasketClient"
  }
}
```

For frontend, create:
- `ecommerceai-web/.env.local`

Example:

```env
VITE_API_URL=http://localhost:5000
```

## Run Locally

### 1) Backend

```powershell
cd EcommerceAI
dotnet restore
dotnet build
dotnet run
```

Backend default:
- API: `http://localhost:5000`
- Swagger: `http://localhost:5000/swagger`

If port 5000 is already in use:

```powershell
Get-NetTCPConnection -LocalPort 5000 -State Listen | Select-Object OwningProcess
Stop-Process -Id <PID> -Force
```

### 2) Frontend

```powershell
cd ecommerceai-web
npm install
npm run dev
```

Frontend default:
- `http://localhost:5174`

## Build Commands

### Backend

```powershell
cd EcommerceAI
dotnet build
```

### Frontend

```powershell
cd ecommerceai-web
npm run build
```

## Security Notes

- Keep secrets in local config/env files only.
- `.gitignore` is configured to block credentials, logs, and build artifacts.
- If any secret file was previously tracked, remove it from Git index/history before pushing.

## API Notes

Core auth endpoints:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`

Order and delivery operations are role-protected via JWT claims.

## Status

The project is currently set up with:
- MySQL-backed API
- Working role-based routing in frontend
- Admin/Customer/Delivery operational flows
- Rejection history visible in admin and customer views

For detailed feature inventory, see `CURRENT_FEATURES.md`.
