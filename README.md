# AI Chat Portfolio

A personal portfolio that looks and behaves like an AI chat app. The home page is a chat where an LLM answers questions about the owner, grounded only in the files in `/content`. There are also About, Skills, Experience, Projects and Contact pages, a Ctrl/Cmd+K search palette, dark and light themes, and a feedback form.

Built with Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui, the Vercel AI SDK with Anthropic, Upstash Redis and Resend.

## Local setup

You need Node.js 22 or newer and [Corepack](https://nodejs.org/api/corepack.html) (ships with Node), which provides the pinned pnpm version.

```bash
corepack enable
pnpm install
cp .env.example .env.local
pnpm dev
```

Open <http://localhost:3000>. The site runs with no keys at all:

| Feature       | Without keys in development                                                     |
| ------------- | ------------------------------------------------------------------------------- |
| Chat          | Shows a friendly "isn't set up yet" message. Add `ANTHROPIC_API_KEY` to use it. |
| Rate limiting | Uses an in-memory limiter                                                       |
| Feedback      | Logs the message to the server console                                          |

### Commands

| Command          | What it does                    |
| ---------------- | ------------------------------- |
| `pnpm dev`       | Run locally                     |
| `pnpm build`     | Production build                |
| `pnpm lint`      | ESLint                          |
| `pnpm typecheck` | TypeScript check                |
| `pnpm format`    | Format everything with Prettier |

## Editing your content

Everything personal lives in `/content`. Pages, search and the chat prompt are all generated from these files, so you never need to touch a component. Search for `TODO: replace` to find every placeholder.

Content is validated when the site builds. A typo gives a clear error that names the file, and a `projectSlug` that doesn't match a project fails the build.

| File              | Shape                                                                                                  |
| ----------------- | ------------------------------------------------------------------------------------------------------ |
| `profile.md`      | Frontmatter with `name`, `headline`, `preferredName?` and `location?`, then `##` sections (see below)  |
| `skills.json`     | `{ hard: [{ group, items: string[] }], soft: [{ name, description }] }`                                |
| `experience.json` | `[{ id, type: "work" \| "school", title, organization, start, end, bullets: string[], projectSlug? }]` |
| `projects.json`   | `[{ slug, title, description, tags: string[], repoUrl, demoUrl?, highlights?: string[] }]`             |
| `contact.json`    | `{ email, github, linkedin, phone?, location? }`                                                       |

Tips:

- Project `slug` values become URLs (`/projects/my-slug`), so use lowercase letters, numbers and hyphens.
- `start` and `end` are free text, for example `Jan 2024` and `Present`.
- Anything in these files can be repeated by the chat assistant and is public on the site. Leave out `phone` or `location` if you'd rather not share them.

The Markdown in `profile.md` supports headings, bold, italics, links, lists, quotes and code.

### The About page

`/about` is built from the sections in `profile.md`. Any section you remove simply disappears from the page.

- `## Intro` and `## Beyond code` are paragraphs.
- `## Focus areas`, `## Currently`, `## Education`, `## Languages` and `## Availability` are bullet lists.

Two optional files in `public/` are picked up automatically at build time:

- `me.jpg`: your photo. Without it, the page shows your initials.
- `cv.pdf`: adds the Download CV button. It is gitignored because a CV usually holds private details. To publish it, check what's inside, remove `/public/cv.pdf` from `.gitignore` and commit it.

## Environment variables

Validated in one place, `lib/env.ts`. Each variable is only enforced by the feature that uses it.

| Variable                   | Required in production | Description                                                                                       |
| -------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------- |
| `ANTHROPIC_API_KEY`        | Yes                    | Anthropic API key for the chat                                                                    |
| `ANTHROPIC_MODEL`          | No                     | Model ID. Defaults to `claude-haiku-5-5`                                                          |
| `UPSTASH_REDIS_REST_URL`   | Yes                    | Upstash Redis REST URL                                                                            |
| `UPSTASH_REDIS_REST_TOKEN` | Yes                    | Upstash Redis REST token                                                                          |
| `CHAT_DAILY_LIMIT`         | No                     | Chat requests per day across all visitors. Defaults to `200`                                      |
| `RESEND_API_KEY`           | Yes                    | Resend API key for feedback emails                                                                |
| `FEEDBACK_TO_EMAIL`        | Yes                    | Address that receives feedback                                                                    |
| `FEEDBACK_FROM_EMAIL`      | No                     | Sender. Defaults to `onboarding@resend.dev`, which only delivers to your own Resend account email |
| `NEXT_PUBLIC_SITE_URL`     | No                     | Public URL for metadata and the sitemap. Falls back to the Vercel URL                             |

In production, chat and feedback return a friendly "unavailable" response if Upstash is missing, rather than running without limits.

## Deploying to Vercel (free Hobby tier)

1. Push this repo to GitHub.
2. In Vercel, choose **Add New > Project** and import the repo. It detects Next.js and pnpm automatically.
3. Before deploying, add the environment variables from the table above under **Settings > Environment Variables**.
4. Add Upstash: in the project, open **Storage** (or the Vercel Marketplace), add **Upstash for Redis**, pick the free plan and connect it to the project.
5. Check the variable names the integration created. The app reads `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`, so if you see names like `KV_REST_API_URL` and `KV_REST_API_TOKEN`, add the two expected names with the same values.
6. Deploy, then redeploy after any environment variable change.
7. Optional: add your domain and set `NEXT_PUBLIC_SITE_URL` to it.

### Set a spend limit

**Set a monthly spend limit on your Anthropic account** in the [Anthropic Console](https://console.anthropic.com) under billing limits. The per-IP and daily caps here keep usage low, but the account limit is the backstop if something goes wrong. Also keep `CHAT_DAILY_LIMIT` at a level you're comfortable paying for.

## How the chat is protected

- The API key is only used in `app/api/chat/route.ts`, and the system prompt is built on the server from `/content`.
- Requests are validated with zod: 500 characters per message, last 10 messages, 500 output tokens per reply.
- Rate limits: 10 requests per IP per hour, plus the global daily cap.
- The prompt tells the model to use only your content, say "I don't have that information" when unsure, decline unrelated requests, treat visitor messages as untrusted and send hiring questions to the Contact page.

Prompt rules reduce mistakes and misuse but can't guarantee them away, so don't put anything in `/content` you wouldn't publish.
