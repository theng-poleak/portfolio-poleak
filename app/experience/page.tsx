import { ArrowRight, BriefcaseBusiness, GraduationCap } from "lucide-react";
import Link from "next/link";

import { PageContainer, PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { getContent } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

export function generateMetadata() {
  const { name } = getContent().profile;
  return pageMetadata({
    title: "Experience",
    description: `Work and education history of ${name}.`,
    path: "/experience",
  });
}

const typeBadges = {
  work: { label: "Work", icon: BriefcaseBusiness },
  school: { label: "School", icon: GraduationCap },
};

export default function ExperiencePage() {
  const { experience } = getContent();

  return (
    <PageContainer>
      <PageHeader title="Experience" description="Where I have worked and studied." />
      <ol className="ml-1 border-l">
        {experience.map((entry) => {
          const { label, icon: Icon } = typeBadges[entry.type];

          return (
            <li
              key={entry.id}
              id={entry.id}
              className="relative scroll-mt-8 pb-10 pl-6 last:pb-0"
            >
              <span
                aria-hidden="true"
                className="absolute top-2 -left-[5px] size-2.5 rounded-full bg-muted-foreground ring-4 ring-background"
              />
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <Badge variant="outline">
                  <Icon aria-hidden="true" />
                  {label}
                </Badge>
                <p className="text-sm text-muted-foreground">
                  {entry.start} – {entry.end}
                </p>
              </div>
              <h2 className="mt-2 font-semibold">{entry.title}</h2>
              <p className="text-muted-foreground">{entry.organization}</p>
              <ul className="mt-3 flex list-disc flex-col gap-1.5 pl-5 text-sm leading-6">
                {entry.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
              {entry.projectSlug && (
                <Link
                  href={`/projects/${entry.projectSlug}`}
                  className="mt-3 inline-flex items-center gap-1 rounded-sm text-sm font-medium outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
                >
                  View project
                  <span className="sr-only">for {entry.title}</span>
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </PageContainer>
  );
}
