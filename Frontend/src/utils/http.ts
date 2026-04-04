const apiBaseUrl = import.meta.env.VITE_API_URL ?? "";

export function resolveApiAssetUrl(path?: string | null): string {
  if (!path) {
    return "";
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  if (path.startsWith("data:")) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${apiBaseUrl.replace(/\/$/, "")}${normalizedPath}`;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatDate(value: string): string {
  return new Date(value).toLocaleString();
}

