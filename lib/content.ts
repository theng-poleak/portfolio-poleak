import "server-only";

import { readFileSync } from "node:fs";
import path from "node:path";

import { z } from "zod";

const profileFrontmatterSchema = z.object({
  name: z.string().min(1),
  headline: z.string().min(1),
});

const skillsSchema = z.object({
  hard: z.array(
    z.object({ group: z.string().min(1), items: z.array(z.string().min(1)) }),
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
    repoUrl: z.url(),
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

export type Profile = z.infer<typeof profileFrontmatterSchema> & { bio: string };
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
  return { ...frontmatter, bio: match[2].trim() };
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

  cached = content;
  return content;
}

export function getProject(slug: string): Project | undefined {
  return getContent().projects.find((project) => project.slug === slug);
}
