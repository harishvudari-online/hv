import Head from "next/head";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Newspaper } from "lucide-react";
import { BlogCard } from "@/components/BlogCard";
import { BlogStatus } from "@/components/BlogStatus";
import { SiteFrame } from "@/components/SiteFrame";
import { SiteHeader, ThemeToggle } from "@/components/SiteHeader";
import type { BlogCategoryId } from "@/data/blog";
import { useBlogList } from "@/hooks/useBlog";
import { getCategoryLabel } from "@/lib/blog";

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
  const { status, posts, categories } = useBlogList();
  const visiblePosts = useMemo(
    () => (category === "all" ? posts : posts.filter((post) => post.category === category)),
    [category, posts]
  );

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
            <h1>What's moving in AI</h1>
            <p className="lead">
              Short notes on the tools, models, chips, and job-market shifts I actually follow — what shipped, what it
              costs, and what it means if you build product interfaces.
            </p>
          </section>
          <div className="blog-filters" role="tablist" aria-label="Blog categories">
            <button
              className={`blog-filter ${category === "all" ? "is-active" : ""}`}
              onClick={() => setCategory("all")}
            >
              All
            </button>
            {categories.map((item) => (
              <button
                key={item.id}
                className={`blog-filter ${category === item.id ? "is-active" : ""}`}
                onClick={() => setCategory(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <BlogStatus status={status} />
          {status === "ok" ? (
            <>
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
            </>
          ) : null}
          <p className="blog-back">
            <Link href="/#blog">Back to homepage</Link>
          </p>
        </main>
      </SiteFrame>
    </>
  );
}
