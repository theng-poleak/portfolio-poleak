"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

const TYPE_MS = 45;
const DELETE_MS = 25;
const HOLD_MS = 8000;
const PAUSE_MS = 500;

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function useReducedMotion() {
  return useSyncExternalStore(
    subscribeToReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false,
  );
}

function pickNextIndex(count: number, current: number) {
  const offset = 1 + Math.floor(Math.random() * (count - 1));
  return (current + offset) % count;
}

/** Types the first greeting, then swaps to a random other one every so often. */
export function TypingGreeting({ greetings }: { greetings: string[] }) {
  const reducedMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [length, setLength] = useState(0);
  const [deleting, setDeleting] = useState(false);

  const greeting = greetings[index];

  useEffect(() => {
    if (reducedMotion) return;

    let step: () => void;
    let delay: number;
    if (deleting && length > 0) {
      step = () => setLength(length - 1);
      delay = DELETE_MS;
    } else if (deleting) {
      step = () => {
        setDeleting(false);
        setIndex(pickNextIndex(greetings.length, index));
      };
      delay = PAUSE_MS;
    } else if (length < greeting.length) {
      step = () => setLength(length + 1);
      delay = TYPE_MS;
    } else if (greetings.length > 1) {
      step = () => setDeleting(true);
      delay = HOLD_MS;
    } else {
      return;
    }

    const timer = setTimeout(step, delay);
    return () => clearTimeout(timer);
  }, [reducedMotion, deleting, length, index, greeting, greetings]);

  const visibleLength = reducedMotion ? greetings[0].length : length;
  const shown = reducedMotion ? greetings[0] : greeting;

  return (
    <h1 className="mx-auto grid w-full max-w-3xl text-2xl font-semibold tracking-tight md:text-3xl">
      <span className="sr-only">{greetings[0]}</span>
      {greetings.map((text) => (
        <span
          key={text}
          aria-hidden="true"
          className="invisible col-start-1 row-start-1 self-end"
        >
          {text}
        </span>
      ))}
      <span aria-hidden="true" className="col-start-1 row-start-1 self-end">
        {shown.slice(0, visibleLength)}
        {!reducedMotion && (
          <span className="relative">
            <span className="absolute top-[0.1em] h-[1em] w-0.5 animate-pulse bg-foreground" />
          </span>
        )}
        <span className="invisible">{shown.slice(visibleLength)}</span>
      </span>
    </h1>
  );
}
