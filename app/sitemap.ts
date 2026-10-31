import type { MetadataRoute } from "next";

import { getContent } from "@/lib/content";
import { navItems } from "@/lib/navigation";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = navItems.map(({ href }) => ({ url: `${siteUrl}${href}` }));
  const projects = getContent().projects.map(({ slug }) => ({
    url: `${siteUrl}/projects/${slug}`,
  }));

  return [...pages, ...projects];
}
