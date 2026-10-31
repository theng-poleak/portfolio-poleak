import { LevelDots } from "@/components/skills/level-dots";
import { skillLevelDetails, skillLevels } from "@/lib/skill-types";

export function LevelLegend() {
  return (
    <section aria-label="Skill levels" className="mb-6 text-sm text-muted-foreground">
      <ul className="flex flex-wrap gap-x-5 gap-y-2">
        {skillLevels.map((level) => (
          <li key={level} className="flex items-center gap-2">
            <LevelDots level={level} />
            <span>
              <span className="font-medium text-foreground">
                {skillLevelDetails[level].label}
              </span>
              : {skillLevelDetails[level].description}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-2">Hover or tap a skill with an arrow to see where it was used.</p>
    </section>
  );
}
