import Link from "next/link";

import { parseInline, parseMarkdown, type MarkdownInline } from "@/lib/markdown";
import { cn } from "@/lib/utils";

const linkClass =
  "font-medium underline underline-offset-3 rounded-sm outline-none hover:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring";

function InlineNodes({ nodes }: { nodes: MarkdownInline[] }) {
  return nodes.map((node, index) => {
    switch (node.type) {
      case "text":
        return node.text;
      case "code":
        return (
          <code
            key={index}
            className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.9em]"
          >
            {node.text}
          </code>
        );
      case "strong":
        return (
          <strong key={index} className="font-semibold">
            <InlineNodes nodes={node.children} />
          </strong>
        );
      case "em":
        return (
          <em key={index}>
            <InlineNodes nodes={node.children} />
          </em>
        );
      case "link":
        return node.href.startsWith("/") ? (
          <Link key={index} href={node.href} className={linkClass}>
            <InlineNodes nodes={node.children} />
          </Link>
        ) : (
          <a
            key={index}
            href={node.href}
            target="_blank"
            rel="noreferrer"
            className={linkClass}
          >
            <InlineNodes nodes={node.children} />
          </a>
        );
    }
  });
}

function Inline({ text }: { text: string }) {
  return <InlineNodes nodes={parseInline(text)} />;
}

const headingClass = {
  1: "mt-6 text-xl font-semibold first:mt-0",
  2: "mt-6 text-lg font-semibold first:mt-0",
  3: "mt-4 text-base font-semibold first:mt-0",
};

type MarkdownProps = {
  source: string;
  className?: string;
};

export function Markdown({ source, className }: MarkdownProps) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-3 leading-7 wrap-anywhere", className)}>
      {parseMarkdown(source).map((block, index) => {
        switch (block.type) {
          case "heading": {
            const Heading = `h${block.level + 1}` as "h2" | "h3" | "h4";
            return (
              <Heading key={index} className={headingClass[block.level]}>
                <Inline text={block.text} />
              </Heading>
            );
          }
          case "paragraph":
            return (
              <p key={index}>
                <Inline text={block.text} />
              </p>
            );
          case "list": {
            const List = block.ordered ? "ol" : "ul";
            return (
              <List
                key={index}
                className={cn(
                  "flex flex-col gap-1.5 pl-6",
                  block.ordered ? "list-decimal" : "list-disc",
                )}
              >
                {block.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <Inline text={item} />
                  </li>
                ))}
              </List>
            );
          }
          case "quote":
            return (
              <blockquote key={index} className="border-l-2 pl-4 text-muted-foreground">
                <Inline text={block.text} />
              </blockquote>
            );
          case "code":
            return (
              <pre
                key={index}
                tabIndex={0}
                className="overflow-x-auto rounded-xl bg-muted p-4 font-mono text-sm leading-6 outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <code>{block.text}</code>
              </pre>
            );
          case "rule":
            return <hr key={index} className="my-2" />;
        }
      })}
    </div>
  );
}
