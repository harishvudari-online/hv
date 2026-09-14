import Head from "next/head";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Newspaper } from "lucide-react";
import { BlogCard } from "@/components/BlogCard";
import { SiteFrame } from "@/components/SiteFrame";
import { SiteHeader, ThemeToggle } from "@/components/SiteHeader";
import { BLOG_CATEGORIES, type BlogCategoryId } from "@/data/blog";
import { getAllPosts, getCategoryLabel } from "@/lib/blog";

const navLabels = {
  home: "Home",
  skills: "Skills",
  experience: "Experience",
  projects: "Projects",
  blog: "Blog",
  contact: "Contact"
};

export default function BlogIndexPage() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [category, setCategory] = useState<BlogCategoryId | "all">("all");
  const posts = useMemo(() => getAllPosts(), []);
  const visiblePosts = category === "all" ? posts : posts.filter((post) => post.category === category);

  return (
    <>
      <Head>
        <title>AI News & Future Trends</title>
        <meta
          name="description"
          content="Editorial briefings on AI tools, models, chips, pricing, jobs, and the future of work from Harish Vudari."
        />
        <link rel="canonical" href="https://harishvudari.online/blog" />
      </Head>
      <SiteFrame theme={theme}>
        <SiteHeader activeId="blog" labels={navLabels} variant="inner">
          <ThemeToggle theme={theme} onToggle={() => setTheme(theme === "dark" ? "light" : "dark")} />
        </SiteHeader>
        <main className="container blog-page">
          <section className="blog-hero">
            <p className="eyebrow">
              <Newspaper size={14} /> AI News & Future Trends
            </p>
            <h1>Auto-blogging briefings on the AI stack</h1>
            <p className="lead">
              Original analysis of AI tools, models, chips, pricing, jobs, and what could happen next. The homepage
              preview shows the latest six. This page lists every briefing.
            </p>
          </section>
          <div className="blog-filters" role="tablist" aria-label="Blog categories">
            <button
              className={`blog-filter ${category === "all" ? "is-active" : ""}`}
              onClick={() => setCategory("all")}
            >
              All
            </button>
            {BLOG_CATEGORIES.map((item) => (
              <button
                key={item.id}
                className={`blog-filter ${category === item.id ? "is-active" : ""}`}
                onClick={() => setCategory(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <p className="blog-count">
            {visiblePosts.length} {visiblePosts.length === 1 ? "briefing" : "briefings"}
            {category !== "all" ? ` in ${getCategoryLabel(category)}` : ""}
          </p>
          <div className="grid blog-grid">
            {visiblePosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
          {visiblePosts.length === 0 ? <p className="blog-empty">No briefings in this category yet.</p> : null}
          <p className="blog-back">
            <Link href="/#blog">Back to homepage preview</Link>
          </p>
        </main>
      </SiteFrame>
    </>
  );
}
