"use client";

import Fuse from "fuse.js";
import { useRouter } from "next/navigation";
import { useMemo, useState, type ComponentProps } from "react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { searchCategories, type SearchItem } from "@/lib/search-types";

const EMPTY_QUERY_CATEGORIES = new Set(["Pages", "Projects"]);

type SearchDialogProps = Pick<ComponentProps<typeof Dialog>, "open" | "onOpenChange"> &
  Pick<ComponentProps<typeof DialogContent>, "onCloseAutoFocus"> & {
    items: SearchItem[];
  };

export function SearchDialog({
  items,
  open,
  onOpenChange,
  onCloseAutoFocus,
}: SearchDialogProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const fuse = useMemo(
    () =>
      new Fuse(items, {
        ignoreLocation: true,
        threshold: 0.35,
        keys: [
          { name: "title", weight: 3 },
          { name: "subtitle", weight: 2 },
          { name: "keywords", weight: 1 },
        ],
      }),
    [items],
  );

  const results = useMemo(() => {
    const trimmed = query.trim();
    return trimmed
      ? fuse.search(trimmed).map(({ item }) => item)
      : items.filter(({ category }) => EMPTY_QUERY_CATEGORIES.has(category));
  }, [fuse, items, query]);

  function handleOpenChange(next: boolean) {
    if (!next) setQuery("");
    onOpenChange?.(next);
  }

  function handleSelect(item: SearchItem) {
    handleOpenChange(false);
    router.push(item.href);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        onCloseAutoFocus={onCloseAutoFocus}
        showCloseButton={false}
        className="top-[20%] translate-y-0 gap-0 overflow-hidden p-0 sm:max-w-lg"
      >
        <DialogTitle className="sr-only">Search</DialogTitle>
        <DialogDescription className="sr-only">
          Search pages, projects, experience and skills.
        </DialogDescription>
        <Command shouldFilter={false} loop>
          <CommandInput
            value={query}
            onValueChange={setQuery}
            placeholder="Search the site..."
            aria-label="Search the site"
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            {searchCategories.map((category) => {
              const matches = results.filter((item) => item.category === category);
              if (matches.length === 0) return null;

              return (
                <CommandGroup key={category} heading={category}>
                  {matches.map((item) => (
                    <CommandItem
                      key={item.id}
                      value={item.id}
                      onSelect={() => handleSelect(item)}
                    >
                      <div className="min-w-0">
                        <p className="truncate">{item.title}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {item.subtitle}
                        </p>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              );
            })}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
