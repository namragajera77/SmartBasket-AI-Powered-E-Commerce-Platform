import { Outlet } from "react-router-dom";
import { Navbar } from "../components/ui/Navbar";

export function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-6 md:px-6 lg:px-8">
        <Outlet />
      </main>
      <footer className="border-t border-gray-200 bg-white/80 py-8 backdrop-blur-sm">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 text-sm text-gray-500 md:grid-cols-2 md:px-6 lg:px-8">
          <p className="font-semibold text-gray-700">EcommerceAI</p>
          <p className="md:text-right">Production-ready commerce with AI search, recommendations, and automation.</p>
        </div>
      </footer>
    </div>
  );
}

