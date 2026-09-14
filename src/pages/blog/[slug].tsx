import Head from "next/head";
import Link from "next/link";
import type { GetStaticPaths, GetStaticProps } from "next";
import { useState } from "react";
import { ArrowLeft, Clock3, Newspaper } from "lucide-react";
import { BlogCard } from "@/components/BlogCard";
import { SiteFrame } from "@/components/SiteFrame";
import { SiteHeader, ThemeToggle } from "@/components/SiteHeader";
import type { BlogPost } from "@/data/blog";
import { formatBlogDate, getAllPosts, getCategoryLabel, getPostBySlug, getRelatedPosts } from "@/lib/blog";

const navLabels = {
  home: "Home",
  skills: "Skills",
  experience: "Experience",
  projects: "Projects",
  blog: "Blog",
  contact: "Contact"
};

type BlogArticlePageProps = {
  post: BlogPost;
  related: BlogPost[];
};

export default function BlogArticlePage({ post, related }: BlogArticlePageProps) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const canonical = `https://harishvudari.online/blog/${post.slug}`;

  return (
    <>
      <Head>
        <title>{post.seo.metaTitle}</title>
        <meta name="description" content={post.seo.metaDescription} />
        <meta name="keywords" content={post.seo.keywords.join(", ")} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={post.seo.metaTitle} />
        <meta property="og:description" content={post.seo.metaDescription} />
        <meta property="og:url" content={canonical} />
        <meta property="og:type" content="article" />
      </Head>
      <SiteFrame theme={theme}>
        <SiteHeader activeId="blog" labels={navLabels} variant="inner">
          <ThemeToggle theme={theme} onToggle={() => setTheme(theme === "dark" ? "light" : "dark")} />
        </SiteHeader>
        <main className="container blog-page">
          <article className="blog-article">
            <p className="blog-crumb">
              <Link href="/blog">
                <ArrowLeft size={14} /> All briefings
              </Link>
            </p>
            <p className="eyebrow">
              <Newspaper size={14} /> {getCategoryLabel(post.category)}
            </p>
            <h1>{post.title}</h1>
            <p className="blog-article-meta">
              <time dateTime={post.publishedAt}>{formatBlogDate(post.publishedAt)}</time>
              <span>
                <Clock3 size={13} /> {post.readingMinutes} min read
              </span>
            </p>
            <p className="lead">{post.excerpt}</p>
            {post.sections.map((section) => (
              <section key={section.heading ?? section.paragraphs[0]} className="blog-article-section">
                {section.heading ? <h2>{section.heading}</h2> : null}
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </section>
            ))}
            {post.sources.length > 0 ? (
              <section className="blog-sources">
                <h2>Sources</h2>
                <ul>
                  {post.sources.map((source) => (
                    <li key={source.url}>
                      <a href={source.url} target="_blank" rel="noreferrer">
                        {source.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
            <div className="blog-tags">
              {post.tags.map((tag) => (
                <span key={tag} className="badge">
                  {tag}
                </span>
              ))}
            </div>
          </article>
          {related.length > 0 ? (
            <section className="section">
              <h3 className="section-title">More briefings</h3>
              <div className="grid blog-grid">
                {related.map((item) => (
                  <BlogCard key={item.slug} post={item} />
                ))}
              </div>
            </section>
          ) : null}
        </main>
      </SiteFrame>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: getAllPosts().map((post) => ({ params: { slug: post.slug } })),
  fallback: false
});

export const getStaticProps: GetStaticProps<BlogArticlePageProps> = async ({ params }) => {
  const slug = typeof params?.slug === "string" ? params.slug : "";
  const post = getPostBySlug(slug);
  if (!post) {
    return { notFound: true };
  }
  return {
    props: {
      post,
      related: getRelatedPosts(post)
    }
  };
};
