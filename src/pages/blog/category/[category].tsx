import Head from "next/head";
import Link from "next/link";
import type { GetStaticPaths, GetStaticProps } from "next";
import { useState } from "react";
import { Newspaper } from "lucide-react";
import { BlogCard } from "@/components/BlogCard";
import { SiteFrame } from "@/components/SiteFrame";
import { SiteHeader, ThemeToggle } from "@/components/SiteHeader";
import { BLOG_CATEGORIES, type BlogCategoryId, type BlogPost } from "@/data/blog";
import { getCategoryLabel, getPostsByCategory } from "@/lib/blog";

const navLabels = {
  home: "Home",
  skills: "Skills",
  experience: "Experience",
  projects: "Projects",
  blog: "Blog",
  contact: "Contact"
};

type CategoryPageProps = {
  category: BlogCategoryId;
  posts: BlogPost[];
};

export default function BlogCategoryPage({ category, posts }: CategoryPageProps) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const label = getCategoryLabel(category);

  return (
    <>
      <Head>
        <title>{label} | AI News & Future Trends</title>
        <meta name="description" content={`AI briefings in ${label}.`} />
        <link rel="canonical" href={`https://harishvudari.online/blog/category/${category}`} />
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
              <Link href="/blog">All briefings</Link> in the AI News & Future Trends archive.
            </p>
          </section>
          <div className="grid blog-grid">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </main>
      </SiteFrame>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: BLOG_CATEGORIES.map((item) => ({ params: { category: item.id } })),
  fallback: false
});

export const getStaticProps: GetStaticProps<CategoryPageProps> = async ({ params }) => {
  const category = params?.category as BlogCategoryId;
  if (!BLOG_CATEGORIES.some((item) => item.id === category)) {
    return { notFound: true };
  }
  return {
    props: {
      category,
      posts: getPostsByCategory(category)
    }
  };
};
