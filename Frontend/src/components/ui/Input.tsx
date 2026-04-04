import type { InputHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
}

export function Input({ className, label, hint, id, ...props }: InputProps) {
  return (
    <div className="flex w-full flex-col gap-2">
      {label ? (
        <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wide text-gray-600">
          {label}
        </label>
      ) : null}
      <input
        id={id}
        className={cn(
          "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100",
          className,
        )}
        {...props}
      />
      {hint ? <span className="text-xs text-gray-500">{hint}</span> : null}
    </div>
  );
}

