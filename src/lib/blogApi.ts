import type { BlogCategory, BlogPost } from "@/data/blog";

export type BlogListResponse = {
  platform: string;
  store: string;
  generatedAt: string;
  categories: BlogCategory[];
  count: number;
  posts: BlogPost[];
};

export type BlogPostResponse = {
  platform: string;
  store: string;
  post: BlogPost;
  related: BlogPost[];
};

export async function fetchBlogList(options?: { preview?: boolean; category?: string }): Promise<BlogListResponse> {
  const params = new URLSearchParams();
  if (options?.preview) {
    params.set("preview", "1");
  }
  if (options?.category) {
    params.set("category", options.category);
  }
  const query = params.toString();
  const response = await fetch(`/api/blog${query ? `?${query}` : ""}`);
  if (!response.ok) {
    throw new Error("Failed to load blog JSON via API");
  }
  return response.json();
}

export async function fetchBlogPost(slug: string): Promise<BlogPostResponse | null> {
  const response = await fetch(`/api/blog/${encodeURIComponent(slug)}`);
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error("Failed to load blog article via API");
  }
  return response.json();
}
