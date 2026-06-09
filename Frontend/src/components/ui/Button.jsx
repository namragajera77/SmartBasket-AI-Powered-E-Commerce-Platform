import { cn } from "../../utils/cn";

const baseClassName =
  "inline-flex cursor-pointer items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50";

const variantClassName = {
  primary:
    "bg-blue-600 text-white shadow-lg shadow-blue-600/25 hover:bg-blue-700",
  secondary:
    "border border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:text-blue-700",
  danger: "bg-red-500 text-white shadow-lg shadow-red-500/20 hover:bg-red-600",
};

export function Button({ children, className, variant = "primary", ...props }) {
  return (
    <button
      className={cn(baseClassName, variantClassName[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
}
