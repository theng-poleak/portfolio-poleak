import type { LucideIcon } from "lucide-react";
import Link from "next/link";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const itemClass =
  "flex h-9 w-full items-center gap-3 rounded-lg px-2.5 text-sm whitespace-nowrap text-sidebar-foreground/85 outline-none transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring";

type SidebarItemProps = {
  icon: LucideIcon;
  label: string;
} & (
  | { href: string; active: boolean; onClick?: () => void }
  | { href?: undefined; active?: undefined; onClick: () => void }
);

export function SidebarItem({
  icon: Icon,
  label,
  href,
  active,
  onClick,
}: SidebarItemProps) {
  const content = (
    <>
      <Icon className="size-4.5 shrink-0" aria-hidden="true" />
      <span className="transition-opacity duration-150 sidebar-collapsed:opacity-0">
        {label}
      </span>
    </>
  );

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {href === undefined ? (
          <button
            type="button"
            onClick={onClick}
            className={itemClass}
            aria-label={label}
          >
            {content}
          </button>
        ) : (
          <Link
            href={href}
            onClick={onClick}
            aria-label={label}
            aria-current={active ? "page" : undefined}
            className={cn(
              itemClass,
              active && "bg-sidebar-accent font-medium text-sidebar-accent-foreground",
            )}
          >
            {content}
          </Link>
        )}
      </TooltipTrigger>
      <TooltipContent
        side="right"
        sideOffset={8}
        className="hidden sidebar-collapsed:flex"
      >
        {label}
      </TooltipContent>
    </Tooltip>
  );
}
