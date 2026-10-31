import { PageContainer, PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getContent } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

export function generateMetadata() {
  const { name } = getContent().profile;
  return pageMetadata({
    title: "Skills",
    description: `Technical and soft skills of ${name}.`,
    path: "/skills",
  });
}

export default function SkillsPage() {
  const { skills } = getContent();

  return (
    <PageContainer>
      <PageHeader title="Skills" description="What I work with and how I work." />

      <section aria-labelledby="hard-skills" className="mb-10">
        <h2 id="hard-skills" className="mb-4 text-lg font-semibold">
          Hard skills
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {skills.hard.map((group) => (
            <Card key={group.group}>
              <CardHeader>
                <CardTitle>
                  <h3>{group.group}</h3>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <li key={item}>
                      <Badge variant="secondary">{item}</Badge>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section aria-labelledby="soft-skills">
        <h2 id="soft-skills" className="mb-2 text-lg font-semibold">
          Soft skills
        </h2>
        <dl className="divide-y">
          {skills.soft.map((skill) => (
            <div key={skill.name} className="py-3">
              <dt className="font-medium">{skill.name}</dt>
              <dd className="mt-0.5 text-muted-foreground">{skill.description}</dd>
            </div>
          ))}
        </dl>
      </section>
    </PageContainer>
  );
}
