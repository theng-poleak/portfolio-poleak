import "server-only";

import type { Metadata } from "next";

import { getContent } from "@/lib/content";

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
};

export function pageMetadata({ title, description, path }: PageMetadataInput): Metadata {
  const { name } = getContent().profile;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: `${name} | Portfolio`,
      title: `${title} | ${name}`,
      description,
      url: path,
    },
  };
}
