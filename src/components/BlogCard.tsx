import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { BlogPost } from "@/data/blog";
import { formatBlogDate, getCategoryLabel } from "@/lib/blog";

type BlogCardProps = {
  post: BlogPost;
  featured?: boolean;
};

export function BlogCard({ post, featured = false }: BlogCardProps) {
  return (
    <article className={`card card--elevated blog-card ${featured ? "blog-card--featured" : ""}`}>
      <div className="blog-card-meta">
        <span className="period-pill">{getCategoryLabel(post.category)}</span>
        <time dateTime={post.publishedAt}>{formatBlogDate(post.publishedAt)}</time>
      </div>
      <h3>
        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
      </h3>
      <p>{post.excerpt}</p>
      <div className="blog-card-footer">
        <span>{post.readingMinutes} min read</span>
        <Link href={`/blog/${post.slug}`} className="blog-card-link">
          Read article <ArrowUpRight size={14} />
        </Link>
      </div>
    </article>
  );
}
