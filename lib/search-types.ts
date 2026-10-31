export const searchCategories = ["Pages", "Projects", "Experience", "Skills"] as const;

export type SearchCategory = (typeof searchCategories)[number];

export type SearchItem = {
  id: string;
  category: SearchCategory;
  title: string;
  subtitle: string;
  keywords: string[];
  href: string;
};
