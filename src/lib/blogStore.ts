import { readFileSync } from "fs";
import path from "path";
import fallbackStore from "@/data/blog.json";
import type { BlogCategory, BlogPost } from "@/data/blog";
import { BLOG_PREVIEW_COUNT, selectByCategory, selectBySlug, selectPreview, selectRelated, sortPosts } from "@/lib/blog";

export type BlogStoreFile = {
  platform: string;
  store: string;
  generatedAt: string;
  categories: BlogCategory[];
  posts: BlogPost[];
};

const BLOG_JSON_PATH = path.join(process.cwd(), "src/data/blog.json");

function normalize(data: BlogStoreFile): BlogStoreFile {
  return {
    ...data,
    posts: sortPosts(data.posts as BlogPost[])
  };
}

export function loadBlogStore(): BlogStoreFile {
  try {
    const raw = readFileSync(BLOG_JSON_PATH, "utf8");
    return normalize(JSON.parse(raw) as BlogStoreFile);
  } catch {
    return normalize(fallbackStore as BlogStoreFile);
  }
}

export function listPosts(options?: { preview?: boolean; category?: string }) {
  const store = loadBlogStore();
  let posts = store.posts;
  if (options?.category) {
    posts = selectByCategory(posts, options.category);
  }
  if (options?.preview) {
    posts = selectPreview(posts, BLOG_PREVIEW_COUNT);
  }
  return {
    platform: store.platform,
    store: store.store,
    generatedAt: store.generatedAt,
    categories: store.categories,
    count: posts.length,
    posts
  };
}

export function getPostPayload(slug: string) {
  const store = loadBlogStore();
  const post = selectBySlug(store.posts, slug);
  if (!post) {
    return null;
  }
  return {
    platform: store.platform,
    store: store.store,
    post,
    related: selectRelated(store.posts, post)
  };
}
