import "server-only";

import { getContent } from "@/lib/content";
import { navItems } from "@/lib/navigation";
import type { SearchItem } from "@/lib/search-types";

/** Flattens /content into the list the command palette searches on the client. */
export function buildSearchIndex(): SearchItem[] {
  const { profile, skills, experience, projects } = getContent();
  const { sections } = profile;

  const aboutFacts: [subtitle: string, values: string[]][] = [
    ["Focus area", sections.focusAreas],
    ["Currently", sections.currently],
    ["Languages", sections.languages],
    ["Location", profile.location ? [profile.location] : []],
    ["Availability", sections.availability],
  ];

  const aboutItems = aboutFacts.flatMap(([subtitle, values]) =>
    values.map((value): SearchItem => ({
      id: `about:${subtitle}:${value}`,
      category: "About",
      title: value,
      subtitle,
      keywords: [],
      href: "/about",
    })),
  );

  const pages = navItems.map(({ href, label, description }): SearchItem => ({
    id: `page:${href}`,
    category: "Pages",
    title: label,
    subtitle: description,
    keywords: [],
    href,
  }));

  const projectItems = projects.map((project): SearchItem => ({
    id: `project:${project.slug}`,
    category: "Projects",
    title: project.title,
    subtitle: project.description,
    keywords: project.tags,
    href: `/projects/${project.slug}`,
  }));

  const experienceItems = experience.map((entry): SearchItem => ({
    id: `experience:${entry.id}`,
    category: entry.type === "work" ? "Experience" : "About",
    title: entry.title,
    subtitle: entry.organization,
    keywords: entry.bullets,
    href: `${entry.type === "work" ? "/experience" : "/about"}#${entry.id}`,
  }));

  const hardSkills = skills.hard.flatMap((group) =>
    group.items.map((item): SearchItem => ({
      id: `skill:${item.name}`,
      category: "Skills",
      title: item.name,
      subtitle: group.group,
      keywords: [],
      href: "/skills",
    })),
  );

  const softSkills = skills.soft.map((skill): SearchItem => ({
    id: `skill:${skill.name}`,
    category: "Skills",
    title: skill.name,
    subtitle: skill.description,
    keywords: [],
    href: "/skills",
  }));

  return [
    ...pages,
    ...aboutItems,
    ...projectItems,
    ...experienceItems,
    ...hardSkills,
    ...softSkills,
  ];
}
