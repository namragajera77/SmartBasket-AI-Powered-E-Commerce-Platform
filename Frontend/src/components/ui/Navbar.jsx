import { useMemo, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Menu, Search, ShoppingCart, User, X } from "lucide-react";
import { useAuth } from "../../auth/AuthContext";
import { getRoleHomePath } from "../../auth/roleHome";
import { cn } from "../../utils/cn";
import { getCart } from "../../api/cartApi";
import { Button } from "./Button";

const navLinkClass = ({ isActive }) =>
  [
    "rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-blue-50 hover:text-blue-700",
    isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30" : "",
  ].join(" ");

export function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, role, email, logout } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  const cartQuery = useQuery({
    queryKey: ["navbar", "cart", role],
    queryFn: getCart,
    enabled: isAuthenticated && role === "Customer",
  });

  const cartCount = (cartQuery.data ?? []).reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  const roleLinks = {
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

  function handleSearchSubmit(event) {
    event.preventDefault();
    const query = searchText.trim();

    if (query.length === 0) {
      navigate("/products");
      return;
    }

    navigate(`/search?q=${encodeURIComponent(query)}`);
    setIsDrawerOpen(false);
  }

  function handleLogout() {
    logout();
    setIsProfileOpen(false);
    setIsDrawerOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/40 bg-white/70 backdrop-blur-xl">
      <div className="container-custom flex h-20 items-center justify-between gap-4">
        <Link
          to={getRoleHomePath(role)}
          className="shrink-0 text-xl font-extrabold tracking-tight text-blue-700 transition-all duration-200 hover:text-blue-800"
          onClick={() => setIsDrawerOpen(false)}
        >
          SmartBasket
        </Link>

        <form
          onSubmit={handleSearchSubmit}
          className="hidden w-full max-w-2xl md:block"
        >
          <div className="relative">
            <Search
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="search"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="Search products, brands, and smart recommendations"
              className="w-full rounded-full border border-slate-200 bg-white px-11 py-3 text-sm text-slate-700 shadow-sm outline-none transition-all duration-200 focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
            />
          </div>
        </form>

        <nav className="hidden items-center gap-2 lg:flex">
          {commonLinks.map((item) => (
            <NavLink key={item.to} to={item.to} className={navLinkClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {role === "Customer" ? (
            <Link
              to="/cart"
              className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition-all duration-200 hover:border-blue-200 hover:text-blue-700"
              aria-label="Cart"
            >
              <ShoppingCart size={18} />
              {cartCount > 0 ? (
                <span className="absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-[11px] font-bold text-white">
                  {cartCount}
                </span>
              ) : null}
            </Link>
          ) : null}

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
            <div className="relative">
              <button
                type="button"
                className="inline-flex h-11 items-center gap-2 rounded-full border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 transition-all duration-200 hover:border-blue-200 hover:text-blue-700"
                onClick={() => setIsProfileOpen((previous) => !previous)}
              >
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                  {(email ?? "U").slice(0, 1).toUpperCase()}
                </span>
                <User size={16} />
              </button>

              <div
                className={cn(
                  "absolute right-0 top-12 w-44 rounded-xl border border-slate-200 bg-white p-2 shadow-xl transition-all duration-200",
                  isProfileOpen
                    ? "pointer-events-auto translate-y-0 opacity-100"
                    : "pointer-events-none -translate-y-2 opacity-0",
                )}
              >
                <Link
                  to={getRoleHomePath(role)}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-blue-50 hover:text-blue-700"
                  onClick={() => setIsProfileOpen(false)}
                >
                  My Panel
                </Link>
                <button
                  type="button"
                  className="mt-1 w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 md:hidden"
          onClick={() => setIsDrawerOpen((previous) => !previous)}
          aria-label="Toggle navigation"
        >
          {isDrawerOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
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

        <aside
          className={cn(
            "fixed right-0 top-20 z-40 h-[calc(100vh-5rem)] w-80 overflow-y-auto border-l border-slate-200 bg-white p-4 shadow-2xl transition-transform duration-200",
            isDrawerOpen ? "translate-x-0" : "translate-x-full",
          )}
        >
          <form onSubmit={handleSearchSubmit} className="mb-4">
            <div className="relative">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="search"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                className="input-field pl-9"
                placeholder="Search..."
              />
            </div>
          </form>

          <div className="flex flex-col gap-2">
            {commonLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition-all hover:bg-blue-50 hover:text-blue-700"
                onClick={() => setIsDrawerOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}

            {role === "Customer" ? (
              <Link
                to="/cart"
                className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition-all hover:bg-blue-50 hover:text-blue-700"
                onClick={() => setIsDrawerOpen(false)}
              >
                Cart {cartCount > 0 ? `(${cartCount})` : ""}
              </Link>
            ) : null}

            {!isAuthenticated ? (
              <>
                <NavLink
                  to="/login"
                  className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition-all hover:bg-blue-50 hover:text-blue-700"
                  onClick={() => setIsDrawerOpen(false)}
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 transition-all hover:bg-blue-50 hover:text-blue-700"
                  onClick={() => setIsDrawerOpen(false)}
                >
                  Register
                </NavLink>
              </>
            ) : (
              <Button
                variant="secondary"
                className="mt-2"
                onClick={handleLogout}
              >
                Logout
              </Button>
            )}
          </div>
        </aside>
      </div>
    </header>
  );
}
