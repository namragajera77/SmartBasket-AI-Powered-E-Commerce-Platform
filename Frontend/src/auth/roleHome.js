export function getRoleHomePath(role) {
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
