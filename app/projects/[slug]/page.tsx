import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageContainer, PageHeader } from "@/components/page-header";
import { ProjectLinks } from "@/components/project-links";
import { Badge } from "@/components/ui/badge";
import { getContent, getProject } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

export function generateStaticParams() {
  return getContent().projects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  return pageMetadata({
    title: project.title,
    description: project.description,
    path: `/projects/${project.slug}`,
  });
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <PageContainer>
      <Link
        href="/projects"
        className="mb-6 inline-flex items-center gap-1.5 rounded-sm text-sm text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        All projects
      </Link>

      <PageHeader title={project.title} description={project.description} />

      <ul className="mb-6 flex flex-wrap gap-1.5">
        {project.tags.map((tag) => (
          <li key={tag}>
            <Badge variant="secondary">{tag}</Badge>
          </li>
        ))}
      </ul>

      <ProjectLinks project={project} />

      {project.highlights && project.highlights.length > 0 && (
        <section aria-labelledby="highlights" className="mt-10">
          <h2 id="highlights" className="mb-3 text-lg font-semibold">
            Highlights
          </h2>
          <ul className="flex list-disc flex-col gap-2 pl-5 leading-7">
            {project.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        </section>
      )}
    </PageContainer>
  );
}
