import type { PaginatedResponse } from "./api";

export type UserRole = "Admin" | "Customer" | "Delivery";

export interface AuthSession {
  email: string;
  role: UserRole;
  token: string;
  refreshToken: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  refreshTokenExpiresAtUtc: string;
  email: string;
  role: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber?: string;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stockQuantity: number;
  categoryName: string;
  imageUrl?: string;
  createdAtUtc: string;
}

export interface ProductQuery {
  page?: number;
  pageSize?: number;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "price" | "createdDate" | "rating";
}

export type ProductPage = PaginatedResponse<Product>;

export interface ProductCreatePayload {
  name: string;
  description?: string;
  price: number;
  stockQuantity: number;
  categoryId: number;
  imageUrl?: string;
}

export interface ProductUpdatePayload extends ProductCreatePayload {
  isActive: boolean;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  createdAtUtc: string;
}

export interface CategoryCreatePayload {
  name: string;
  description?: string;
}

export interface CartItem {
  cartItemId: number;
  productId: number;
  productName: string;
  imageUrl?: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface AddToCartPayload {
  productId: number;
  quantity: number;
}

export interface UpdateCartPayload {
  quantity: number;
}

export interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Order {
  orderId: number;
  status: string;
  totalAmount: number;
  orderedAtUtc: string;
  shippingAddress?: string;
  deliveryBoyId?: number;
  deliveryOtp?: string;
  otpVerified?: boolean;
  rejectedBy?: string;
  rejectionReason?: string;
  rejectedAtUtc?: string;
  items: OrderItem[];
}

export interface CheckoutPayload {
  shippingAddress: string;
}

export interface AssignDeliveryPayload {
  deliveryBoyId: number;
}

export interface DeliveryUserOption {
  id: number;
  fullName: string;
  email: string;
}

export interface VerifyOtpPayload {
  otp: string;
}

export interface Review {
  reviewId: number;
  userName: string;
  rating: number;
  comment?: string;
  createdAtUtc: string;
}

export interface CreateReviewPayload {
  productId: number;
  rating: number;
  comment?: string;
}

export interface UpdateReviewPayload {
  rating: number;
  comment?: string;
}

export interface SmartSearchRequest {
  query: string;
}

export interface SmartSearchResult {
  productId: number;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  similarityScore: number;
}

export interface Recommendation {
  productId: number;
  name: string;
  price: number;
  imageUrl?: string;
  similarityScore: number;
}

export interface DescriptionRequest {
  productName: string;
  category: string;
  keywords?: string;
}

export interface DescriptionResponse {
  description: string;
}

export interface ReviewSummary {
  productId: number;
  summary: string;
  reviewCount: number;
}

