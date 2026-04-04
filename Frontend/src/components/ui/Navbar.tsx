import { useMemo, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { getRoleHomePath } from "../../auth/roleHome";
import type { UserRole } from "../../types/domain";
import { cn } from "../../utils/cn";
import { Button } from "./Button";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    "rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 hover:scale-105",
    isActive ? "bg-blue-50 text-blue-600 shadow-sm" : "",
  ].join(" ");

export function Navbar() {
  const { isAuthenticated, role, logout } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const roleLinks: Record<UserRole, Array<{ to: string; label: string }>> = {
    Admin: [
      { to: "/admin/dashboard", label: "Dashboard" },
      { to: "/admin/categories", label: "Categories" },
      { to: "/admin/products", label: "Products" },
      { to: "/admin/orders", label: "Orders" },
      { to: "/admin/past-delivery", label: "Past Delivery" },
      { to: "/admin/ai-tools", label: "AI Tools" },
    ],
    Customer: [
      { to: "/cart", label: "Cart" },
      { to: "/checkout", label: "Checkout" },
      { to: "/orders", label: "My Orders" },
      { to: "/search", label: "AI Search" },
    ],
    Delivery: [
      { to: "/delivery/orders", label: "Deliveries" },
      { to: "/delivery/past-delivery", label: "Past Delivery" },
    ],
  };

  const activeLinks = role ? roleLinks[role] : [];
  const commonLinks = useMemo(
    () => [
      { to: "/", label: "Home" },
      { to: "/products", label: "Products" },
      ...activeLinks,
    ],
    [activeLinks],
  );

  function handleLogout() {
    logout();
    setIsDrawerOpen(false);
  }

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/90 shadow-md backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:px-6 lg:px-8">
        <Link
          to={getRoleHomePath(role)}
          className="text-xl font-bold text-blue-600 transition-all duration-200 hover:scale-105 hover:text-blue-700"
          onClick={() => setIsDrawerOpen(false)}
        >
          EcommerceAI
        </Link>

        <div className="hidden w-2/5 md:block">
          <input
            type="search"
            placeholder="Search products, brands, and ideas"
            className="w-full rounded-full border border-gray-300 bg-white px-4 py-2 text-sm shadow-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
          />
        </div>

        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 transition-all duration-200 hover:bg-blue-50"
          onClick={() => setIsDrawerOpen((previous) => !previous)}
          aria-label="Toggle navigation"
        >
          {isDrawerOpen ? "X" : "="}
        </button>

        <nav className="hidden items-center gap-4 md:flex">
          {commonLinks.map((item) => (
            <NavLink key={item.to} to={item.to} className={navLinkClass}>
              {item.label}
            </NavLink>
          ))}

          {!isAuthenticated ? (
            <>
              <NavLink to="/login" className={navLinkClass}>
                Login
              </NavLink>
              <NavLink to="/register" className={navLinkClass}>
                Register
              </NavLink>
            </>
          ) : (
              <Button variant="secondary" className="px-3 py-1.5 text-xs" onClick={handleLogout}>
              Logout
            </Button>
          )}
        </nav>
      </div>

      <div
        className={cn(
          "md:hidden",
          isDrawerOpen ? "pointer-events-auto" : "pointer-events-none",
        )}
      >
        <div
          className={cn(
            "fixed inset-0 z-30 bg-gray-900/30 transition-opacity duration-200",
            isDrawerOpen ? "opacity-100" : "opacity-0",
          )}
          onClick={() => setIsDrawerOpen(false)}
          aria-hidden="true"
        />
        <div
          className={cn(
            "fixed right-0 top-16 z-40 h-[calc(100vh-4rem)] w-72 overflow-y-auto border-l border-gray-200 bg-white p-4 shadow-xl transition-transform duration-200",
            isDrawerOpen ? "translate-x-0" : "translate-x-full",
          )}
        >
          <div className="flex flex-col gap-2">
            {commonLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-blue-50 hover:text-blue-600"
                onClick={() => setIsDrawerOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}

            {!isAuthenticated ? (
              <>
                <NavLink
                  to="/login"
                  className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-blue-50 hover:text-blue-600"
                  onClick={() => setIsDrawerOpen(false)}
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-blue-50 hover:text-blue-600"
                  onClick={() => setIsDrawerOpen(false)}
                >
                  Register
                </NavLink>
              </>
            ) : (
              <Button variant="secondary" className="mt-2" onClick={handleLogout}>
                Logout
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

