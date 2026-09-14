import type { BlogCategoryId, BlogPost } from "@/data/blog";
import { BLOG_CATEGORIES } from "@/data/blog";

export const BLOG_PREVIEW_COUNT = 6;

export function sortPosts(posts: BlogPost[]): BlogPost[] {
  return [...posts].sort((a, b) => {
    if (a.publishedAt === b.publishedAt) {
      return 0;
    }
    return a.publishedAt < b.publishedAt ? 1 : -1;
  });
}

export function selectPreview(posts: BlogPost[], count = BLOG_PREVIEW_COUNT): BlogPost[] {
  return sortPosts(posts).slice(0, count);
}

export function selectBySlug(posts: BlogPost[], slug: string): BlogPost | undefined {
  return posts.find((post) => post.slug === slug);
}

export function selectByCategory(posts: BlogPost[], category: string): BlogPost[] {
  return sortPosts(posts).filter((post) => post.category === category);
}

export function getCategoryLabel(category: string): string {
  return BLOG_CATEGORIES.find((item) => item.id === category)?.label ?? category;
}

export function formatBlogDate(isoDate: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(new Date(`${isoDate}T00:00:00`));
}

export function selectRelated(posts: BlogPost[], post: BlogPost, count = 3): BlogPost[] {
  return sortPosts(posts)
    .filter((item) => item.slug !== post.slug)
    .sort((a, b) => {
      const aScore = Number(a.category === post.category) + a.tags.filter((tag) => post.tags.includes(tag)).length;
      const bScore = Number(b.category === post.category) + b.tags.filter((tag) => post.tags.includes(tag)).length;
      return bScore - aScore;
    })
    .slice(0, count);
}

export function isBlogCategoryId(value: string): value is BlogCategoryId {
  return BLOG_CATEGORIES.some((item) => item.id === value);
}

export type BlogFaqItem = {
  question: string;
  answer: string;
};

export function splitRichText(text: string): Array<{ type: "text"; value: string } | { type: "link"; label: string; href: string }> {
  const parts: Array<{ type: "text"; value: string } | { type: "link"; label: string; href: string }> = [];
  const pattern = /\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null = pattern.exec(text);
  while (match) {
    const index = match.index;
    if (index > lastIndex) {
      parts.push({ type: "text", value: text.slice(lastIndex, index) });
    }
    parts.push({ type: "link", label: match[1], href: match[2] });
    lastIndex = index + match[0].length;
    match = pattern.exec(text);
  }
  if (lastIndex < text.length) {
    parts.push({ type: "text", value: text.slice(lastIndex) });
  }
  return parts;
}

export function selectFaq(post: BlogPost): BlogFaqItem[] {
  return post.sections
    .filter((section) => section.heading?.toLowerCase() === "faq")
    .flatMap((section) => section.paragraphs)
    .map((paragraph) => {
      const splitAt = paragraph.indexOf("? ");
      if (splitAt === -1) {
        return null;
      }
      return {
        question: paragraph.slice(0, splitAt + 1).trim(),
        answer: paragraph.slice(splitAt + 2).trim()
      };
    })
    .filter((item): item is BlogFaqItem => Boolean(item?.question && item.answer));
}
