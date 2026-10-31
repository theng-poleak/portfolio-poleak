import { skillLevelDetails, type SkillLevel } from "@/lib/skill-types";
import { cn } from "@/lib/utils";

const TOTAL_DOTS = 3;

export function LevelDots({ level }: { level: SkillLevel }) {
  const { label, dots } = skillLevelDetails[level];

  return (
    <>
      <span aria-hidden="true" className="flex items-center gap-0.5">
        {Array.from({ length: TOTAL_DOTS }, (_, index) => (
          <span
            key={index}
            className={cn(
              "size-1.5 rounded-full",
              index < dots ? "bg-foreground" : "bg-foreground/20",
            )}
          />
        ))}
      </span>
      <span className="sr-only">, level: {label}</span>
    </>
  );
}
