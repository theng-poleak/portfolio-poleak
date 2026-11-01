import { BriefcaseBusiness, Languages, MapPin } from "lucide-react";

import { Card } from "@/components/ui/card";
import type { Profile } from "@/lib/content";

function getFacts(profile: Profile) {
  const { location, sections } = profile;

  return [
    { label: "Currently", icon: BriefcaseBusiness, values: sections.currently },
    { label: "Languages", icon: Languages, values: sections.languages },
    { label: "Location", icon: MapPin, values: location ? [location] : [] },
  ].filter(({ values }) => values.length > 0);
}

export function QuickFacts({ profile }: { profile: Profile }) {
  return (
    <Card className="p-4">
      <dl className="grid gap-5 sm:grid-cols-2">
        {getFacts(profile).map(({ label, icon: Icon, values }) => (
          <div key={label} className="flex min-w-0 gap-3">
            <Icon
              className="mt-0.5 size-4 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
            <div className="min-w-0">
              <dt className="text-xs text-muted-foreground">{label}</dt>
              {values.map((value) => (
                <dd key={value} className="mt-0.5 text-sm font-medium">
                  {value}
                </dd>
              ))}
            </div>
          </div>
        ))}
      </dl>
    </Card>
  );
}
