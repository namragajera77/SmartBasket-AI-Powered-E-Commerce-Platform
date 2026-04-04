import type { ButtonHTMLAttributes, PropsWithChildren } from "react";
import { cn } from "../../utils/cn";

type ButtonVariant = "primary" | "secondary" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, PropsWithChildren {
  variant?: ButtonVariant;
}

const baseClassName =
  "inline-flex cursor-pointer items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50";

const variantClassName: Record<ButtonVariant, string> = {
  primary: "bg-blue-600 text-white hover:bg-blue-700",
  secondary: "border border-gray-300 bg-white text-gray-700 hover:border-blue-500 hover:text-blue-600",
  danger: "bg-red-500 text-white hover:bg-red-600",
};

export function Button({ children, className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button className={cn(baseClassName, variantClassName[variant], className)} {...props}>
      {children}
    </button>
  );
}

