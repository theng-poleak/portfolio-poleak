"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, type PointerEvent } from "react";

import { LevelDots } from "@/components/skills/level-dots";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { SkillView } from "@/lib/skill-types";

const HOVER_CLOSE_DELAY_MS = 150;

const chipClass =
  "inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground";

function ProjectSkillChip({ skill }: { skill: SkillView }) {
  const [open, setOpen] = useState(false);
  const openedByHover = useRef(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  function handlePointerEnter(event: PointerEvent) {
    if (event.pointerType !== "mouse") return;
    clearTimeout(closeTimer.current);
    if (!open) openedByHover.current = true;
    setOpen(true);
  }

  function handlePointerLeave(event: PointerEvent) {
    if (event.pointerType !== "mouse" || !openedByHover.current) return;
    closeTimer.current = setTimeout(() => {
      openedByHover.current = false;
      setOpen(false);
    }, HOVER_CLOSE_DELAY_MS);
  }

  function handleOpenChange(next: boolean) {
    if (!next) openedByHover.current = false;
    setOpen(next);
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        className={`${chipClass} cursor-pointer outline-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring`}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onClick={(event) => {
          // A mouse click on a chip already opened by hover should keep it open.
          if (openedByHover.current) event.preventDefault();
        }}
      >
        {skill.name}
        <LevelDots level={skill.level} />
        <ChevronDown className="size-3 text-muted-foreground" aria-hidden="true" />
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-64 max-w-[calc(100vw-2rem)] gap-1.5"
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onOpenAutoFocus={(event) => {
          if (openedByHover.current) event.preventDefault();
        }}
        onCloseAutoFocus={(event) => {
          if (openedByHover.current) event.preventDefault();
        }}
      >
        <p className="text-xs text-muted-foreground">Used in:</p>
        <ul className="flex flex-col gap-1">
          {skill.projects.map((project) => (
            <li key={project.slug}>
              <Link
                href={`/projects/${project.slug}`}
                onClick={() => handleOpenChange(false)}
                className="rounded-sm font-medium outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
              >
                {project.title}
              </Link>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}

export function SkillChip({ skill }: { skill: SkillView }) {
  if (skill.projects.length > 0) {
    return <ProjectSkillChip skill={skill} />;
  }

  return (
    <span className={chipClass}>
      {skill.name}
      <LevelDots level={skill.level} />
    </span>
  );
}
