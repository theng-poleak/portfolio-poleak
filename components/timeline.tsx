import { ArrowRight } from "lucide-react";
import Link from "next/link";

import type { Experience } from "@/lib/content";

type TimelineProps = {
  entries: Experience[];
  headingLevel: "h2" | "h3";
};

export function Timeline({ entries, headingLevel: Heading }: TimelineProps) {
  return (
    <ol className="ml-1 border-l">
      {entries.map((entry) => {
        const dates = [entry.start, entry.end].filter(Boolean).join(" – ");

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
            {dates && <p className="text-sm text-muted-foreground">{dates}</p>}
            <Heading className="mt-1 font-semibold first:mt-0">{entry.title}</Heading>
            <p className="text-muted-foreground">{entry.organization}</p>
            {entry.bullets.length > 0 && (
              <ul className="mt-3 flex list-disc flex-col gap-1.5 pl-5 text-sm leading-6">
                {entry.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            )}
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
  );
}
