export function SiteLogo({ name }: { name: string }) {
  return (
    <span
      aria-hidden="true"
      className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-foreground text-sm font-semibold text-background"
    >
      {name.charAt(0).toUpperCase()}
    </span>
  );
}
