import { NavLink } from "react-router-dom";
import type { ReactNode } from "react";
import {
  Boxes,
  BriefcaseBusiness,
  CircleCheckBig,
  LayoutDashboard,
  Package,
  Route,
  Sparkles,
  Truck,
} from "lucide-react";
import { cn } from "../../utils/cn";
import type { UserRole } from "../../types/domain";

type SidebarItem = {
  to: string;
  label: string;
  icon: ReactNode;
};

const adminItems: SidebarItem[] = [
  { to: "/admin/dashboard", label: "Dashboard", icon: <LayoutDashboard size={16} /> },
  { to: "/admin/categories", label: "Categories", icon: <Boxes size={16} /> },
  { to: "/admin/products", label: "Products", icon: <Package size={16} /> },
  { to: "/admin/orders", label: "Orders", icon: <BriefcaseBusiness size={16} /> },
  { to: "/admin/past-delivery", label: "Past Delivery", icon: <Truck size={16} /> },
  { to: "/admin/ai-tools", label: "AI Tools", icon: <Sparkles size={16} /> },
];

const deliveryItems: SidebarItem[] = [
  { to: "/delivery/orders", label: "Assigned Orders", icon: <Route size={16} /> },
  { to: "/delivery/past-delivery", label: "Past Deliveries", icon: <CircleCheckBig size={16} /> },
];

export function PanelSidebar({ role }: { role: UserRole | null }) {
  const items = role === "Admin" ? adminItems : role === "Delivery" ? deliveryItems : [];

  if (items.length === 0) {
    return null;
  }

  return (
    <aside className="hidden w-64 shrink-0 xl:block">
      <div className="glass-card sticky top-24 p-4">
        <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          {role} Panel
        </p>
        <div className="space-y-1">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                    : "text-slate-600 hover:bg-blue-50 hover:text-blue-700",
                )
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </aside>
  );
}
