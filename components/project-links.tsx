import { ExternalLink } from "lucide-react";

import { GitHubIcon } from "@/components/brand-icons";
import { Button } from "@/components/ui/button";
import type { Project } from "@/lib/content";

type ProjectLinksProps = {
  project: Pick<Project, "title" | "repoUrl" | "demoUrl">;
};

export function ProjectLinks({ project }: ProjectLinksProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" size="sm" asChild>
        <a href={project.repoUrl} target="_blank" rel="noreferrer">
          <GitHubIcon />
          GitHub
          <span className="sr-only">repository for {project.title}</span>
        </a>
      </Button>
      {project.demoUrl && (
        <Button variant="outline" size="sm" asChild>
          <a href={project.demoUrl} target="_blank" rel="noreferrer">
            <ExternalLink aria-hidden="true" />
            Demo
            <span className="sr-only">of {project.title}</span>
          </a>
        </Button>
      )}
    </div>
  );
}
