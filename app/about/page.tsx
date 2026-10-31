import { Download, FolderGit2, MapPin, MessageSquare } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { FocusAreaGrid } from "@/components/about/focus-area-grid";
import { ProfilePhoto } from "@/components/about/profile-photo";
import { QuickFacts } from "@/components/about/quick-facts";
import { Markdown } from "@/components/markdown";
import { PageContainer } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getContent, publicFileExists } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

export function generateMetadata() {
  const { name, headline, location } = getContent().profile;
  return pageMetadata({
    title: "About me",
    description: [`${name}: ${headline}.`, location && `Based in ${location}.`]
      .filter(Boolean)
      .join(" "),
    path: "/about",
  });
}

type AboutSectionProps = {
  id: string;
  title: string;
  children: ReactNode;
};

function AboutSection({ id, title, children }: AboutSectionProps) {
  return (
    <section aria-labelledby={id} className="mt-10">
      <h2 id={id} className="mb-3 text-lg font-semibold">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function AboutPage() {
  const { profile } = getContent();
  const { sections } = profile;

  return (
    <PageContainer>
      <header className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
        <ProfilePhoto name={profile.name} hasPhoto={publicFileExists("me.jpg")} />
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            {profile.name}
          </h1>
          <p className="mt-1 text-muted-foreground">{profile.headline}</p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            {profile.location && (
              <Badge variant="outline">
                <MapPin aria-hidden="true" />
                {profile.location}
              </Badge>
            )}
            {sections.availability.length > 0 && (
              <Badge variant="secondary" className="h-auto max-w-full whitespace-normal">
                Available for {sections.availability.join(", ").toLowerCase()}
              </Badge>
            )}
          </div>
        </div>
      </header>

      {sections.intro && <Markdown source={sections.intro} className="mt-8" />}

      <nav aria-label="Next steps" className="mt-6 flex flex-wrap gap-2">
        <Button asChild>
          <Link href="/">
            <MessageSquare aria-hidden="true" />
            Ask my AI
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/projects">
            <FolderGit2 aria-hidden="true" />
            View projects
          </Link>
        </Button>
        {publicFileExists("cv.pdf") && (
          <Button variant="outline" asChild>
            <a href="/cv.pdf" download={`${profile.name.replace(/\s+/g, "-")}-CV.pdf`}>
              <Download aria-hidden="true" />
              Download CV
            </a>
          </Button>
        )}
      </nav>

      {sections.focusAreas.length > 0 && (
        <AboutSection id="what-i-do" title="What I do">
          <FocusAreaGrid areas={sections.focusAreas} />
        </AboutSection>
      )}

      <AboutSection id="quick-facts" title="Quick facts">
        <QuickFacts profile={profile} />
      </AboutSection>

      {sections.beyondCode && (
        <AboutSection id="beyond-code" title="Beyond code">
          <Markdown source={sections.beyondCode} />
        </AboutSection>
      )}
    </PageContainer>
  );
}
