import { PageContainer, PageHeader } from "@/components/page-header";
import { LevelLegend } from "@/components/skills/level-legend";
import { SkillGroups } from "@/components/skills/skill-groups";
import { Card } from "@/components/ui/card";
import { getContent } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import type { SkillGroupView } from "@/lib/skill-types";

export function generateMetadata() {
  const { name } = getContent().profile;
  return pageMetadata({
    title: "Skills",
    description: `Technical and soft skills of ${name}, with the projects where each was used.`,
    path: "/skills",
  });
}

function getSkillGroups(): SkillGroupView[] {
  const { skills, projects } = getContent();
  const titles = new Map(projects.map(({ slug, title }) => [slug, title]));

  return skills.hard
    .filter(({ items }) => items.length > 0)
    .map(({ group, items }) => ({
      group,
      items: items.map(({ name, level, projects: slugs = [] }) => ({
        name,
        level,
        projects: slugs.map((slug) => ({ slug, title: titles.get(slug) ?? slug })),
      })),
    }));
}

export default function SkillsPage() {
  const { skills } = getContent();

  return (
    <PageContainer>
      <PageHeader title="Skills" description="What I work with and how I work." />

      <section aria-labelledby="hard-skills" className="mb-10">
        <h2 id="hard-skills" className="mb-3 text-lg font-semibold">
          Hard skills
        </h2>
        <LevelLegend />
        <SkillGroups groups={getSkillGroups()} />
      </section>

      <section aria-labelledby="soft-skills">
        <h2 id="soft-skills" className="mb-3 text-lg font-semibold">
          Soft skills
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {skills.soft.map((skill) => (
            <li key={skill.name} className="flex">
              <Card className="w-full gap-1 p-4">
                <h3 className="text-sm font-medium">{skill.name}</h3>
                <p className="text-sm leading-6 text-muted-foreground">
                  {skill.description}
                </p>
              </Card>
            </li>
          ))}
        </ul>
      </section>
    </PageContainer>
  );
}
