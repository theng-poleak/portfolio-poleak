import { Boxes, Code2, Container, Database, Server, type LucideIcon } from "lucide-react";

import { Card } from "@/components/ui/card";

const focusAreaIcons: { pattern: RegExp; icon: LucideIcon }[] = [
  { pattern: /microservice|architecture/i, icon: Boxes },
  { pattern: /api|backend/i, icon: Server },
  { pattern: /database|caching|sql/i, icon: Database },
  { pattern: /contain|docker|deploy/i, icon: Container },
];

function getFocusAreaIcon(area: string): LucideIcon {
  return focusAreaIcons.find(({ pattern }) => pattern.test(area))?.icon ?? Code2;
}

export function FocusAreaGrid({ areas }: { areas: string[] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {areas.map((area) => {
        const Icon = getFocusAreaIcon(area);

        return (
          <li key={area}>
            <Card className="flex-row items-center gap-3 p-4">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                <Icon className="size-4" aria-hidden="true" />
              </span>
              <p className="min-w-0 text-sm font-medium">{area}</p>
            </Card>
          </li>
        );
      })}
    </ul>
  );
}
