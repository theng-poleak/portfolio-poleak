"use client";

import { useState } from "react";

import { SkillChip } from "@/components/skills/skill-chip";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SkillGroupView } from "@/lib/skill-types";

const ALL_GROUPS = "All";

export function SkillGroups({ groups }: { groups: SkillGroupView[] }) {
  const [selected, setSelected] = useState(ALL_GROUPS);
  const visibleGroups =
    selected === ALL_GROUPS ? groups : groups.filter(({ group }) => group === selected);

  return (
    <>
      <div
        role="group"
        aria-label="Filter by group"
        className="mb-4 flex flex-wrap gap-2"
      >
        {[ALL_GROUPS, ...groups.map(({ group }) => group)].map((name) => (
          <Button
            key={name}
            type="button"
            size="sm"
            variant={selected === name ? "default" : "outline"}
            aria-pressed={selected === name}
            className="rounded-full"
            onClick={() => setSelected(name)}
          >
            {name}
          </Button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {visibleGroups.map((group) => (
          <Card key={group.group}>
            <CardHeader>
              <CardTitle>
                <h3>{group.group}</h3>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-wrap gap-2">
                {group.items.map((skill) => (
                  <li key={skill.name}>
                    <SkillChip skill={skill} />
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
