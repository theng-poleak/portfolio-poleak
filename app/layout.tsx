import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { ChatSessionProvider } from "@/components/chat/chat-session";
import { AppShell } from "@/components/layout/app-shell";
import { SidebarScript } from "@/components/layout/sidebar-script";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getContent } from "@/lib/content";
import { buildSearchIndex } from "@/lib/search";
import { siteUrl } from "@/lib/site";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export function generateMetadata(): Metadata {
  const { name, headline } = getContent().profile;
  const description = `Chat with an AI assistant to learn about ${name}: ${headline}.`;

  return {
    metadataBase: new URL(siteUrl),
    title: { default: `${name} | Portfolio`, template: `%s | ${name}` },
    description,
    openGraph: {
      type: "website",
      siteName: `${name} | Portfolio`,
      title: `${name} | Portfolio`,
      description,
    },
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  const { profile } = getContent();

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
            <ChatSessionProvider>
              <AppShell siteName={profile.name} searchItems={buildSearchIndex()}>
                {children}
              </AppShell>
            </ChatSessionProvider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
