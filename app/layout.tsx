import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { AppShell } from "@/components/layout/app-shell";
import { SidebarScript } from "@/components/layout/sidebar-script";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Portfolio",
  description: "An AI chat portfolio.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <SidebarScript />
      </head>
      <body className="h-full">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <TooltipProvider delayDuration={300}>
            <AppShell siteName="Poleak">{children}</AppShell>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
