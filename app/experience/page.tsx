import { PageContainer, PageHeader } from "@/components/page-header";
import { Timeline } from "@/components/timeline";
import { getContent } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";

export function generateMetadata() {
  const { name } = getContent().profile;
  return pageMetadata({
    title: "Experience",
    description: `Work history of ${name}.`,
    path: "/experience",
  });
}

export default function ExperiencePage() {
  const work = getContent().experience.filter(({ type }) => type === "work");

  return (
    <PageContainer>
      <PageHeader title="Experience" description="Where I have worked." />
      <Timeline entries={work} headingLevel="h2" />
    </PageContainer>
  );
}
