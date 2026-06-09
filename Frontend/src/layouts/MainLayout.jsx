import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../auth/AuthContext";
import { Navbar } from "../components/ui/Navbar";
import { PanelSidebar } from "../components/ui/PanelSidebar";

export function MainLayout() {
  const { role } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <main className="container-custom py-8">
        <div className="flex gap-6">
          <PanelSidebar role={role} />
          <motion.div
            key={role ?? "guest"}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="min-w-0 flex-1"
          >
            <Outlet />
          </motion.div>
        </div>
      </main>
      <footer className="border-t border-slate-200/80 bg-white/70 py-8 backdrop-blur-md">
        <div className="container-custom grid gap-4 text-sm text-slate-500 md:grid-cols-2">
          <p className="font-semibold text-slate-800">
            SmartBasket Commerce Cloud
          </p>
          <p className="md:text-right">
            AI search, role-based workflows, and premium checkout built for
            scale.
          </p>
        </div>
      </footer>
    </div>
  );
}
