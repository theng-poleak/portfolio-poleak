"use client";

import { Menu, Search } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

import { FeedbackDialog } from "@/components/layout/feedback-dialog";
import { SettingsDialog } from "@/components/layout/settings-dialog";
import { SidebarContent, type ShellDialog } from "@/components/layout/sidebar";
import { SiteLogo } from "@/components/layout/site-logo";
import { SearchDialog } from "@/components/search/search-dialog";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { SearchItem } from "@/lib/search-types";

type AppShellProps = {
  siteName: string;
  searchItems: SearchItem[];
  children: ReactNode;
};

export function AppShell({ siteName, searchItems, children }: AppShellProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dialog, setDialog] = useState<ShellDialog | null>(null);
  const restoreFocusTo = useRef<HTMLElement | null>(null);

  const openDialog = useCallback((next: ShellDialog) => {
    restoreFocusTo.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setDrawerOpen(false);
    setDialog(next);
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (dialog === "search") {
          setDialog(null);
        } else {
          openDialog("search");
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [dialog, openDialog]);

  const handleDialogChange = (name: ShellDialog) => (open: boolean) => {
    setDialog(open ? name : null);
  };

  const handleCloseAutoFocus = (event: Event) => {
    event.preventDefault();
    restoreFocusTo.current?.focus();
  };

  return (
    <div className="flex h-dvh overflow-hidden">
      <a
        href="#main"
        className="sr-only z-50 rounded-lg bg-background px-3 py-2 focus:not-sr-only focus:absolute focus:top-2 focus:left-2"
      >
        Skip to content
      </a>

      <aside
        aria-label="Sidebar"
        className="hidden w-64 shrink-0 border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-200 ease-out sidebar-collapsed:w-14 md:block"
      >
        <SidebarContent siteName={siteName} onOpenDialog={openDialog} showToggle />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-12 shrink-0 items-center gap-1 border-b px-2 md:hidden">
          <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
            <SheetTrigger asChild>
              <Button type="button" variant="ghost" size="icon" aria-label="Open menu">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-72 max-w-[85vw] gap-0 border-sidebar-border bg-sidebar p-0 text-sidebar-foreground"
            >
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <SheetDescription className="sr-only">Site navigation</SheetDescription>
              <SidebarContent
                siteName={siteName}
                onOpenDialog={openDialog}
                onNavigate={() => setDrawerOpen(false)}
              />
            </SheetContent>
          </Sheet>
          <Link
            href="/"
            className="flex min-w-0 items-center gap-2 rounded-lg px-1 py-1 outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <SiteLogo />
            <span className="truncate text-sm font-semibold">{siteName}</span>
          </Link>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Search"
            className="ml-auto"
            onClick={() => openDialog("search")}
          >
            <Search />
          </Button>
        </header>

        <main
          id="main"
          tabIndex={-1}
          className="relative min-h-0 flex-1 overflow-y-auto outline-none"
        >
          {children}
        </main>
      </div>

      <SearchDialog
        items={searchItems}
        open={dialog === "search"}
        onOpenChange={handleDialogChange("search")}
        onCloseAutoFocus={handleCloseAutoFocus}
      />
      <SettingsDialog
        open={dialog === "settings"}
        onOpenChange={handleDialogChange("settings")}
        onCloseAutoFocus={handleCloseAutoFocus}
      />
      <FeedbackDialog
        open={dialog === "feedback"}
        onOpenChange={handleDialogChange("feedback")}
        onCloseAutoFocus={handleCloseAutoFocus}
      />
    </div>
  );
}
