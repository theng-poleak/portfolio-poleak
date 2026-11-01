export const skillLevels = ["strong", "working", "familiar"] as const;

export type SkillLevel = (typeof skillLevels)[number];

export const skillLevelDetails: Record<
  SkillLevel,
  { label: string; dots: number; description: string }
> = {
  strong: { label: "Strong", dots: 3, description: "Used heavily in real work" },
  working: { label: "Working", dots: 2, description: "Used on real projects" },
  familiar: { label: "Familiar", dots: 1, description: "Used lightly or learned" },
};

export type SkillProject = {
  slug: string;
  title: string;
};

export type SkillView = {
  name: string;
  level: SkillLevel;
  projects: SkillProject[];
};

export type SkillGroupView = {
  group: string;
  items: SkillView[];
};
