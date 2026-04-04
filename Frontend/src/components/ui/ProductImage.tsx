import { useMemo, useState } from "react";
import { resolveApiAssetUrl } from "../../utils/http";
import { cn } from "../../utils/cn";

interface ProductImageProps {
  src?: string | null;
  alt: string;
  className?: string;
}

const fallbackSvg = encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900"><rect width="1200" height="900" fill="#F3F4F6"/><rect x="450" y="290" width="300" height="220" rx="28" fill="#E5E7EB"/><circle cx="540" cy="365" r="36" fill="#D1D5DB"/><path d="M495 470l80-80 54 54 48-48 84 84" fill="none" stroke="#9CA3AF" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"/><text x="50%" y="620" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="42" fill="#9CA3AF">Product Image</text></svg>'
);

const fallbackSrc = `data:image/svg+xml;charset=utf-8,${fallbackSvg}`;

export function ProductImage({ src, alt, className }: ProductImageProps) {
  const resolved = useMemo(() => resolveApiAssetUrl(src), [src]);
  const [hasError, setHasError] = useState(false);

  return (
    <img
      src={!resolved || hasError ? fallbackSrc : resolved}
      alt={alt}
      className={cn("h-full w-full object-cover", className)}
      loading="lazy"
      onError={() => setHasError(true)}
    />
  );
}

