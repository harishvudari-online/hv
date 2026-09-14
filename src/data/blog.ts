export const BLOG_CATEGORIES = [
  { id: "tools", label: "AI Tools" },
  { id: "models", label: "AI Models" },
  { id: "pricing", label: "AI Pricing" },
  { id: "chips", label: "AI Chips" },
  { id: "jobs", label: "AI Jobs" },
  { id: "future", label: "Future AI" },
  { id: "companies", label: "AI Companies" },
  { id: "research", label: "AI Research" }
] as const;

export type BlogCategoryId = (typeof BLOG_CATEGORIES)[number]["id"];

export type BlogSource = {
  title: string;
  url: string;
};

export type BlogSection = {
  heading?: string;
  paragraphs: string[];
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: BlogCategoryId;
  tags: string[];
  publishedAt: string;
  readingMinutes: number;
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
  sources: BlogSource[];
  sections: BlogSection[];
};

export type BlogCategory = {
  id: BlogCategoryId;
  label: string;
};
