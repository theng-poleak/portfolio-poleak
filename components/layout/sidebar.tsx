"use client";

import { MessageCircleHeart, PanelLeft, Search, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { SidebarItem } from "@/components/layout/sidebar-button";
import { SiteLogo } from "@/components/layout/site-logo";
import { useSidebar } from "@/components/layout/use-sidebar";
import { Button } from "@/components/ui/button";
import { isNavItemActive, navItems } from "@/lib/navigation";

export type ShellDialog = "search" | "settings" | "feedback";

type SidebarContentProps = {
  siteName: string;
  onOpenDialog: (dialog: ShellDialog) => void;
  onNavigate?: () => void;
  showToggle?: boolean;
};

export function SidebarContent({
  siteName,
  onOpenDialog,
  onNavigate,
  showToggle = false,
}: SidebarContentProps) {
  const pathname = usePathname();
  const { collapsed, toggle } = useSidebar();

  return (
    <div className="flex h-full min-h-0 flex-col gap-2 overflow-hidden p-2">
      <div className="flex h-10 shrink-0 items-center gap-1 sidebar-collapsed:flex-col">
        <Link
          href="/"
          onClick={onNavigate}
          className="flex min-w-0 flex-1 items-center gap-2.5 rounded-lg px-1 py-1 outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring sidebar-collapsed:hidden"
        >
          <SiteLogo />
          <span className="truncate text-sm font-semibold">{siteName}</span>
        </Link>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Search"
          className="sidebar-collapsed:hidden"
          onClick={() => onOpenDialog("search")}
        >
          <Search />
        </Button>
        {showToggle && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!collapsed}
            onClick={toggle}
            className="sidebar-expanded:size-7"
          >
            <PanelLeft />
          </Button>
        )}
      </div>

      <nav
        aria-label="Main"
        className="flex min-h-0 flex-1 flex-col gap-1 overflow-x-hidden overflow-y-auto"
      >
        <div className="hidden sidebar-collapsed:block">
          <SidebarItem
            icon={Search}
            label="Search"
            onClick={() => onOpenDialog("search")}
          />
        </div>
        {navItems.map((item) => (
          <SidebarItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            active={isNavItemActive(pathname, item.href)}
            onClick={onNavigate}
          />
        ))}
      </nav>

      <div className="flex shrink-0 flex-col gap-1 border-t border-sidebar-border pt-2">
        <SidebarItem
          icon={Settings}
          label="Settings"
          onClick={() => onOpenDialog("settings")}
        />
        <SidebarItem
          icon={MessageCircleHeart}
          label="Feedback"
          onClick={() => onOpenDialog("feedback")}
        />
      </div>
    </div>
  );
}
