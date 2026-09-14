import type { NextApiRequest, NextApiResponse } from "next";
import { listPosts } from "@/lib/blogStore";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const preview = req.query.preview === "1";
  const category = typeof req.query.category === "string" ? req.query.category : undefined;
  res.status(200).json(listPosts({ preview, category }));
}
