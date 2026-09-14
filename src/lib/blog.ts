import { BLOG_CATEGORIES, blogPosts, type BlogCategoryId, type BlogPost } from "@/data/blog";

export const BLOG_PREVIEW_COUNT = 6;

export function getAllPosts(): BlogPost[] {
  return [...blogPosts].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

export function getPreviewPosts(count = BLOG_PREVIEW_COUNT): BlogPost[] {
  return getAllPosts().slice(0, count);
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getPostsByCategory(category: BlogCategoryId): BlogPost[] {
  return getAllPosts().filter((post) => post.category === category);
}

export function getCategoryLabel(category: BlogCategoryId): string {
  return BLOG_CATEGORIES.find((item) => item.id === category)?.label ?? category;
}

export function formatBlogDate(isoDate: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(new Date(`${isoDate}T00:00:00`));
}

export function getRelatedPosts(post: BlogPost, count = 3): BlogPost[] {
  return getAllPosts()
    .filter((item) => item.slug !== post.slug)
    .sort((a, b) => {
      const aScore = Number(a.category === post.category) + a.tags.filter((tag) => post.tags.includes(tag)).length;
      const bScore = Number(b.category === post.category) + b.tags.filter((tag) => post.tags.includes(tag)).length;
      return bScore - aScore;
    })
    .slice(0, count);
}

export function assertBlogIntegrity(): void {
  const slugs = blogPosts.map((post) => post.slug);
  if (new Set(slugs).size !== slugs.length) {
    throw new Error("Duplicate blog slugs");
  }
  if (blogPosts.length < BLOG_PREVIEW_COUNT) {
    throw new Error(`Need at least ${BLOG_PREVIEW_COUNT} posts for the homepage preview`);
  }
}
