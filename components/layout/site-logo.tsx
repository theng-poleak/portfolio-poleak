import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

export function SiteLogo({ className, ...props }: ComponentProps<"svg">) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 100"
      fill="currentColor"
      className={cn("size-7 shrink-0", className)}
      {...props}
    >
      <path
        fillRule="evenodd"
        d="M30 30H66C81 30 92 38 92 51C92 64 81 72 66 72H48V78C48 85 54 92 64 96C54 97 44 93 39 87C34 93 24 97 14 96C24 92 30 85 30 78ZM48 44V58H64C70 58 74 55 74 51C74 47 70 44 64 44Z"
      />
      <path d="M62 30C54 12 30 2 6 8C28 8 42 16 49 30ZM41 30C34 21 20 16 3 21C16 22 25 26 30 30Z" />
    </svg>
  );
}
