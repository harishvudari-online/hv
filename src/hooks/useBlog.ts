import { useEffect, useState } from "react";
import type { BlogCategory, BlogPost } from "@/data/blog";
import { fetchBlogList, fetchBlogPost } from "@/lib/blogApi";

type ListState = {
  status: "loading" | "ok" | "error";
  posts: BlogPost[];
  categories: BlogCategory[];
};

export function useBlogList(options?: { preview?: boolean; category?: string; enabled?: boolean }): ListState {
  const enabled = options?.enabled !== false;
  const preview = options?.preview;
  const category = options?.category;
  const [state, setState] = useState<ListState>({ status: "loading", posts: [], categories: [] });

  useEffect(() => {
    if (!enabled) {
      setState({ status: "loading", posts: [], categories: [] });
      return;
    }
    let cancelled = false;
    setState((prev) => ({ ...prev, status: "loading" }));
    fetchBlogList({ preview, category })
      .then((data) => {
        if (!cancelled) {
          setState({ status: "ok", posts: data.posts, categories: data.categories });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setState({ status: "error", posts: [], categories: [] });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [enabled, preview, category]);

  return state;
}

type PostState = {
  status: "loading" | "ok" | "empty" | "error";
  post: BlogPost | null;
  related: BlogPost[];
};

export function useBlogPost(slug: string): PostState {
  const [state, setState] = useState<PostState>({ status: "loading", post: null, related: [] });

  useEffect(() => {
    if (!slug) {
      setState({ status: "loading", post: null, related: [] });
      return;
    }
    let cancelled = false;
    setState({ status: "loading", post: null, related: [] });
    fetchBlogPost(slug)
      .then((data) => {
        if (cancelled) {
          return;
        }
        if (!data) {
          setState({ status: "empty", post: null, related: [] });
          return;
        }
        setState({ status: "ok", post: data.post, related: data.related });
      })
      .catch(() => {
        if (!cancelled) {
          setState({ status: "error", post: null, related: [] });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return state;
}
