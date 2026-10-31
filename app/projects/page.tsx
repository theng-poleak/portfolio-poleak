import Link from "next/link";

import { PageContainer, PageHeader } from "@/components/page-header";
import { ProjectLinks } from "@/components/project-links";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getContent } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

export function generateMetadata() {
  const { name } = getContent().profile;
  return pageMetadata({
    title: "Projects",
    description: `Selected projects built by ${name}.`,
    path: "/projects",
  });
}

export default function ProjectsPage() {
  const { projects } = getContent();

  return (
    <PageContainer>
      <PageHeader title="Projects" description="A selection of things I have built." />
      <ul className="grid gap-4 sm:grid-cols-2">
        {projects.map((project) => (
          <li key={project.slug} className="flex">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>
                  <h2>
                    <Link
                      href={`/projects/${project.slug}`}
                      className="rounded-sm outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {project.title}
                    </Link>
                  </h2>
                </CardTitle>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <ul className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <li key={tag}>
                      <Badge variant="secondary">{tag}</Badge>
                    </li>
                  ))}
                </ul>
              </CardContent>
              {(project.repoUrl || project.demoUrl) && (
                <CardFooter>
                  <ProjectLinks project={project} />
                </CardFooter>
              )}
            </Card>
          </li>
        ))}
      </ul>
    </PageContainer>
  );
}
