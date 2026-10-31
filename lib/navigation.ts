import {
  BriefcaseBusiness,
  FolderGit2,
  Mail,
  MessageSquare,
  Sparkles,
  UserRound,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
};

export const navItems: NavItem[] = [
  {
    href: "/",
    label: "Chat",
    description: "Ask the AI assistant anything about me",
    icon: MessageSquare,
  },
  {
    href: "/about",
    label: "About me",
    description: "Bio and background",
    icon: UserRound,
  },
  {
    href: "/skills",
    label: "Skills",
    description: "Hard and soft skills",
    icon: Sparkles,
  },
  {
    href: "/experience",
    label: "Experience",
    description: "Work timeline",
    icon: BriefcaseBusiness,
  },
  {
    href: "/projects",
    label: "Projects",
    description: "Things I have built",
    icon: FolderGit2,
  },
  { href: "/contact", label: "Contact", description: "How to reach me", icon: Mail },
];

export function isNavItemActive(pathname: string, href: string): boolean {
  return href === "/"
    ? pathname === "/"
    : pathname === href || pathname.startsWith(`${href}/`);
}
