import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you are looking for does not exist.",
};

export default function NotFound() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 px-4 py-16 text-center">
      <p className="text-sm font-medium text-muted-foreground">404</p>
      <h1 className="text-2xl font-semibold tracking-tight">Page not found</h1>
      <p className="max-w-sm text-muted-foreground">
        This page doesn&apos;t exist, but the chat might have what you&apos;re looking
        for.
      </p>
      <Button asChild className="mt-2">
        <Link href="/">Back to chat</Link>
      </Button>
    </div>
  );
}
