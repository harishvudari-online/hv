import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { Newspaper } from "lucide-react";
import { BlogCard } from "@/components/BlogCard";
import { BlogStatus } from "@/components/BlogStatus";
import { SiteFrame } from "@/components/SiteFrame";
import { SiteHeader, ThemeToggle } from "@/components/SiteHeader";
import { useBlogList } from "@/hooks/useBlog";
import { getCategoryLabel, isBlogCategoryId } from "@/lib/blog";

const navLabels = {
  home: "Home",
  skills: "Skills",
  experience: "Experience",
  projects: "Projects",
  blog: "Blog",
  contact: "Contact"
};

export default function BlogCategoryPage() {
  const router = useRouter();
  const categoryParam = typeof router.query.category === "string" ? router.query.category : "";
  const category = isBlogCategoryId(categoryParam) ? categoryParam : undefined;
  const ready = router.isReady;
  const { status, posts } = useBlogList({ category, enabled: ready && Boolean(category) });
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const label = category ? getCategoryLabel(category) : "Category";
  const viewStatus = !ready ? "loading" : category ? status : "empty";

  return (
    <>
      <Head>
        <title>{label} | AI News & Future Trends</title>
        <meta name="description" content={`AI briefings in ${label}.`} />
        {category ? (
          <link rel="canonical" href={`https://harishvudari.online/blog/category/${category}`} />
        ) : null}
      </Head>
      <SiteFrame theme={theme}>
        <SiteHeader activeId="blog" labels={navLabels} variant="inner">
          <ThemeToggle theme={theme} onToggle={() => setTheme(theme === "dark" ? "light" : "dark")} />
        </SiteHeader>
        <main className="container blog-page">
          <section className="blog-hero">
            <p className="eyebrow">
              <Newspaper size={14} /> {label}
            </p>
            <h1>{label} briefings</h1>
            <p className="lead">
              <Link href="/blog">All briefings</Link> loaded from the JSON blog store through the API.
            </p>
          </section>
          <BlogStatus status={viewStatus} empty="Unknown category." />
          {viewStatus === "ok" ? (
            <div className="grid blog-grid">
              {posts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          ) : null}
        </main>
      </SiteFrame>
    </>
  );
}
