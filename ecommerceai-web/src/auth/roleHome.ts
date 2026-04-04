import type { UserRole } from "../types/domain";

export function getRoleHomePath(role: UserRole | null | undefined): string {
  switch (role) {
    case "Admin":
      return "/admin/dashboard";
    case "Customer":
      return "/products";
    case "Delivery":
      return "/delivery/orders";
    default:
      return "/";
  }
}
