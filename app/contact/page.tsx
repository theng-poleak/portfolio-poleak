import { Mail, MapPin, Phone, type LucideIcon } from "lucide-react";
import type { ComponentType, SVGProps } from "react";

import { GitHubIcon, LinkedInIcon, TelegramIcon } from "@/components/brand-icons";
import { CopyButton } from "@/components/copy-button";
import { PageContainer, PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { getContent } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

export function generateMetadata() {
  const { name } = getContent().profile;
  return pageMetadata({
    title: "Contact",
    description: `Get in touch with ${name} about roles and collaborations.`,
    path: "/contact",
  });
}

type ContactMethod = {
  label: string;
  value: string;
  href?: string;
  icon: LucideIcon | ComponentType<SVGProps<SVGSVGElement>>;
};

function displayUrl(url: string) {
  return url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
}

export default function ContactPage() {
  const { contact } = getContent();

  const methods: ContactMethod[] = [
    { label: "Email", value: contact.email, href: `mailto:${contact.email}`, icon: Mail },
    {
      label: "GitHub",
      value: displayUrl(contact.github),
      href: contact.github,
      icon: GitHubIcon,
    },
    {
      label: "LinkedIn",
      value: displayUrl(contact.linkedin),
      href: contact.linkedin,
      icon: LinkedInIcon,
    },
    ...(contact.telegram
      ? [
          {
            label: "Telegram",
            value: `@${contact.telegram.split("/").pop()}`,
            href: contact.telegram,
            icon: TelegramIcon,
          },
        ]
      : []),
    ...(contact.phone
      ? [
          {
            label: "Phone",
            value: contact.phone,
            href: `tel:${contact.phone.replace(/\s/g, "")}`,
            icon: Phone,
          },
        ]
      : []),
    ...(contact.location
      ? [{ label: "Location", value: contact.location, icon: MapPin }]
      : []),
  ];

  return (
    <PageContainer>
      <PageHeader title="Contact" description="The best ways to reach me." />
      <ul className="grid gap-3 sm:grid-cols-2">
        {methods.map(({ label, value, href, icon: Icon }) => (
          <li key={label}>
            <Card className="flex-row items-center gap-3 p-4">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                <Icon className="size-4" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground">{label}</p>
                {href ? (
                  <a
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer"
                    className="block truncate rounded-sm text-sm font-medium outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {value}
                  </a>
                ) : (
                  <p className="truncate text-sm font-medium">{value}</p>
                )}
              </div>
              <CopyButton value={value} label={label} />
            </Card>
          </li>
        ))}
      </ul>
    </PageContainer>
  );
}
