import Image from "next/image";

type ProfilePhotoProps = {
  name: string;
  hasPhoto: boolean;
};

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export function ProfilePhoto({ name, hasPhoto }: ProfilePhotoProps) {
  const frameClass = "size-28 shrink-0 rounded-full border sm:size-32";

  if (hasPhoto) {
    return (
      <Image
        src="/me.jpg"
        alt={`Portrait of ${name}`}
        width={256}
        height={256}
        sizes="(min-width: 40rem) 128px, 112px"
        preload
        className={`${frameClass} object-cover`}
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={`${name} initials`}
      className={`${frameClass} flex items-center justify-center bg-muted text-3xl font-semibold text-muted-foreground`}
    >
      {getInitials(name)}
    </div>
  );
}
