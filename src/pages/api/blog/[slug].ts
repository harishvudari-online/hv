import type { NextApiRequest, NextApiResponse } from "next";
import { getPostPayload } from "@/lib/blogStore";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const slug = typeof req.query.slug === "string" ? req.query.slug : "";
  const payload = getPostPayload(slug);
  if (!payload) {
    res.status(404).json({ error: "Briefing not found" });
    return;
  }
  res.status(200).json(payload);
}
