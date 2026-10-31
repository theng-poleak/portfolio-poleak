"use client";

import { useSyncExternalStore } from "react";

export const SIDEBAR_STORAGE_KEY = "sidebar-state";

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function isCollapsed() {
  return document.documentElement.dataset.sidebar === "collapsed";
}

function toggleSidebar() {
  const next = isCollapsed() ? "expanded" : "collapsed";
  document.documentElement.dataset.sidebar = next;
  try {
    localStorage.setItem(SIDEBAR_STORAGE_KEY, next);
  } catch {
    // Storage can be unavailable (private mode); the state just won't persist.
  }
  listeners.forEach((listener) => listener());
}

export function useSidebar() {
  const collapsed = useSyncExternalStore(subscribe, isCollapsed, () => false);
  return { collapsed, toggle: toggleSidebar };
}
