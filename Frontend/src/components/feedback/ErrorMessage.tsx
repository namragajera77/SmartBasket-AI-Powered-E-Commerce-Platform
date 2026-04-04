interface ErrorMessageProps {
  title?: string;
  message: string;
}

export function ErrorMessage({ title = "Something went wrong", message }: ErrorMessageProps) {
  return (
    <div className="rounded-xl border border-red-200 bg-gradient-to-r from-red-50 to-rose-50 p-4 shadow-sm transition-all duration-200">
      <h3 className="text-sm font-semibold text-red-700">{title}</h3>
      <p className="mt-1 text-sm text-red-600">{message}</p>
    </div>
  );
}

