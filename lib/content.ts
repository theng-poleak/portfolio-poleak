import "server-only";

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import { z } from "zod";

import { parseMarkdown } from "@/lib/markdown";
import { skillLevels } from "@/lib/skill-types";

const profileFrontmatterSchema = z.object({
  name: z.string().min(1),
  preferredName: z.string().min(1).optional(),
  headline: z.string().min(1),
  location: z.string().min(1).optional(),
});

const skillsSchema = z.object({
  hard: z.array(
    z.object({
      group: z.string().min(1),
      items: z.array(
        z.object({
          name: z.string().min(1),
          level: z.enum(skillLevels),
          projects: z.array(z.string().min(1)).optional(),
        }),
      ),
    }),
  ),
  soft: z.array(z.object({ name: z.string().min(1), description: z.string().min(1) })),
});

const experienceSchema = z.array(
  z.object({
    id: z.string().min(1),
    type: z.enum(["work", "school"]),
    title: z.string().min(1),
    organization: z.string().min(1),
    start: z.string().min(1),
    end: z.string().min(1),
    bullets: z.array(z.string().min(1)),
    projectSlug: z.string().min(1).optional(),
  }),
);

const projectsSchema = z.array(
  z.object({
    slug: z.string().regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and hyphens"),
    title: z.string().min(1),
    description: z.string().min(1),
    tags: z.array(z.string().min(1)),
    repoUrl: z.url().optional(),
    demoUrl: z.url().optional(),
    highlights: z.array(z.string().min(1)).optional(),
  }),
);

const contactSchema = z.object({
  email: z.email(),
  github: z.url(),
  linkedin: z.url(),
  phone: z.string().min(1).optional(),
  location: z.string().min(1).optional(),
});

export type ProfileSections = {
  intro: string;
  focusAreas: string[];
  currently: string[];
  education: string[];
  languages: string[];
  availability: string[];
  beyondCode: string;
};

export type Profile = z.infer<typeof profileFrontmatterSchema> & {
  bio: string;
  sections: ProfileSections;
};
export type Skills = z.infer<typeof skillsSchema>;
export type Experience = z.infer<typeof experienceSchema>[number];
export type Project = z.infer<typeof projectsSchema>[number];
export type Contact = z.infer<typeof contactSchema>;

export type Content = {
  profile: Profile;
  skills: Skills;
  experience: Experience[];
  projects: Project[];
  contact: Contact;
};

function readContentFile(fileName: string): string {
  return readFileSync(path.join(process.cwd(), "content", fileName), "utf8");
}

function parseOrThrow<T>(schema: z.ZodType<T>, value: unknown, fileName: string): T {
  const result = schema.safeParse(value);
  if (!result.success) {
    throw new Error(`Invalid content/${fileName}:\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}

function readJson<T>(schema: z.ZodType<T>, fileName: string): T {
  return parseOrThrow(schema, JSON.parse(readContentFile(fileName)), fileName);
}

function splitSections(body: string): Map<string, string> {
  const sections = new Map<string, string>();
  for (const part of body.split(/^## /m).slice(1)) {
    const lineEnd = part.indexOf("\n");
    const heading = lineEnd === -1 ? part : part.slice(0, lineEnd);
    const text = lineEnd === -1 ? "" : part.slice(lineEnd + 1);
    sections.set(heading.trim().toLowerCase(), text.trim());
  }
  return sections;
}

function listItems(markdown = ""): string[] {
  return parseMarkdown(markdown).flatMap((block) =>
    block.type === "list" ? block.items : [],
  );
}

function parseProfileSections(body: string): ProfileSections {
  const sections = splitSections(body);
  return {
    intro: sections.get("intro") ?? "",
    focusAreas: listItems(sections.get("focus areas")),
    currently: listItems(sections.get("currently")),
    education: listItems(sections.get("education")),
    languages: listItems(sections.get("languages")),
    availability: listItems(sections.get("availability")),
    beyondCode: sections.get("beyond code") ?? "",
  };
}

function readProfile(): Profile {
  const raw = readContentFile("profile.md").replace(/\r\n/g, "\n");
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) {
    throw new Error("Invalid content/profile.md: missing frontmatter block");
  }

  const fields = Object.fromEntries(
    match[1].split("\n").flatMap((line) => {
      const separator = line.indexOf(":");
      if (separator === -1) return [];
      const key = line.slice(0, separator).trim();
      const value = line
        .slice(separator + 1)
        .trim()
        .replace(/^"(.*)"$/, "$1");
      return [[key, value]];
    }),
  );

  const frontmatter = parseOrThrow(profileFrontmatterSchema, fields, "profile.md");
  const bio = match[2].trim();
  return { ...frontmatter, bio, sections: parseProfileSections(bio) };
}

function assertSkillsAreConsistent({ skills, projects }: Content) {
  const slugs = new Set(projects.map(({ slug }) => slug));
  const skillNames = new Set<string>();

  for (const { items } of skills.hard) {
    for (const { name, projects: skillProjects = [] } of items) {
      if (skillNames.has(name)) {
        throw new Error(`Invalid content/skills.json: duplicate skill "${name}"`);
      }
      skillNames.add(name);

      for (const slug of skillProjects) {
        if (!slugs.has(slug)) {
          throw new Error(
            `Invalid content/skills.json: "${name}" links to unknown project "${slug}"`,
          );
        }
      }
    }
  }

  for (const { slug, tags } of projects) {
    for (const tag of tags) {
      if (!skillNames.has(tag)) {
        throw new Error(
          `Invalid content/projects.json: "${slug}" has tag "${tag}", which is not a skill in skills.json`,
        );
      }
    }
  }
}

function assertContentIsConsistent({ experience, projects }: Content) {
  const slugs = new Set<string>();
  for (const { slug } of projects) {
    if (slugs.has(slug)) {
      throw new Error(`Invalid content/projects.json: duplicate slug "${slug}"`);
    }
    slugs.add(slug);
  }

  for (const { id, projectSlug } of experience) {
    if (projectSlug && !slugs.has(projectSlug)) {
      throw new Error(
        `Invalid content/experience.json: "${id}" links to unknown project "${projectSlug}"`,
      );
    }
  }
}

let cached: Content | undefined;

/** Loads and validates everything in /content. Pages prerender through this, so bad content fails the build. */
export function getContent(): Content {
  if (cached) return cached;

  const content: Content = {
    profile: readProfile(),
    skills: readJson(skillsSchema, "skills.json"),
    experience: readJson(experienceSchema, "experience.json"),
    projects: readJson(projectsSchema, "projects.json"),
    contact: readJson(contactSchema, "contact.json"),
  };
  assertContentIsConsistent(content);
  assertSkillsAreConsistent(content);

  cached = content;
  return content;
}

export function publicFileExists(fileName: string): boolean {
  return existsSync(path.join(process.cwd(), "public", fileName));
}

export function getProject(slug: string): Project | undefined {
  return getContent().projects.find((project) => project.slug === slug);
}
