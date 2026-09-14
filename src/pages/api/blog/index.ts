import type { NextApiRequest, NextApiResponse } from "next";
import { getAllPosts, getPreviewPosts } from "@/lib/blog";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const posts = req.query.preview === "1" ? getPreviewPosts() : getAllPosts();
  res.status(200).json({
    platform: "AI News & Future Trends",
    count: posts.length,
    posts: posts.map((post) => ({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      category: post.category,
      publishedAt: post.publishedAt,
      readingMinutes: post.readingMinutes
    }))
  });
}
