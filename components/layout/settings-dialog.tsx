"use client";

import { Monitor, Moon, Sun, type LucideIcon } from "lucide-react";
import { useTheme } from "next-themes";
import type { ComponentProps } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const themes: { value: string; label: string; icon: LucideIcon }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

type SettingsDialogProps = Pick<ComponentProps<typeof Dialog>, "open" | "onOpenChange"> &
  Pick<ComponentProps<typeof DialogContent>, "onCloseAutoFocus">;

export function SettingsDialog({
  open,
  onOpenChange,
  onCloseAutoFocus,
}: SettingsDialogProps) {
  const { theme, setTheme } = useTheme();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onCloseAutoFocus={onCloseAutoFocus}>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Choose how the site looks.</DialogDescription>
        </DialogHeader>
        <fieldset className="grid grid-cols-3 gap-2">
          <legend className="sr-only">Theme</legend>
          {themes.map(({ value, label, icon: Icon }) => (
            <label
              key={value}
              className="flex cursor-pointer flex-col items-center gap-1.5 rounded-lg border p-3 text-sm transition-colors hover:bg-accent has-checked:border-foreground/40 has-checked:bg-accent has-focus-visible:ring-2 has-focus-visible:ring-ring"
            >
              <input
                type="radio"
                name="theme"
                value={value}
                checked={theme === value}
                onChange={() => setTheme(value)}
                className="sr-only"
              />
              <Icon className="size-4.5" aria-hidden="true" />
              {label}
            </label>
          ))}
        </fieldset>
      </DialogContent>
    </Dialog>
  );
}
