import { UserRound } from "lucide-react";

import { Markdown } from "@/components/markdown";
import { PageContainer } from "@/components/page-header";
import { getContent } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

export function generateMetadata() {
  const { name } = getContent().profile;
  return pageMetadata({
    title: "About me",
    description: `Learn more about ${name}: background, interests and what they are looking for.`,
    path: "/about",
  });
}

export default function AboutPage() {
  const { profile } = getContent();

  return (
    <PageContainer>
      <header className="mb-8 flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
        <div
          role="img"
          aria-label="Photo placeholder"
          className="flex size-28 shrink-0 items-center justify-center rounded-full border bg-muted text-muted-foreground"
        >
          <UserRound className="size-12" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            {profile.name}
          </h1>
          <p className="mt-1 text-muted-foreground">{profile.headline}</p>
        </div>
      </header>
      <Markdown source={profile.bio} />
    </PageContainer>
  );
}
