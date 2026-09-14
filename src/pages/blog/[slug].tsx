import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { ArrowLeft, Clock3, Newspaper } from "lucide-react";
import { BlogCard } from "@/components/BlogCard";
import { BlogFigure } from "@/components/BlogFigure";
import { BlogStatus } from "@/components/BlogStatus";
import { SiteFrame } from "@/components/SiteFrame";
import { SiteHeader, ThemeToggle } from "@/components/SiteHeader";
import { useBlogPost } from "@/hooks/useBlog";
import { formatBlogDate, getCategoryLabel } from "@/lib/blog";

const navLabels = {
  home: "Home",
  skills: "Skills",
  experience: "Experience",
  projects: "Projects",
  blog: "Blog",
  contact: "Contact"
};

export default function BlogArticlePage() {
  const router = useRouter();
  const slug = typeof router.query.slug === "string" ? router.query.slug : "";
  const { status, post, related } = useBlogPost(slug);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const canonical = post ? `https://harishvudari.online/blog/${post.slug}` : "https://harishvudari.online/blog";

  return (
    <>
      <Head>
        <title>{post?.seo.metaTitle ?? "AI News & Future Trends"}</title>
        {post ? (
          <>
            <meta name="description" content={post.seo.metaDescription} />
            <meta name="keywords" content={post.seo.keywords.join(", ")} />
            <link rel="canonical" href={canonical} />
            <meta property="og:title" content={post.seo.metaTitle} />
            <meta property="og:description" content={post.seo.metaDescription} />
            <meta property="og:url" content={canonical} />
            <meta property="og:type" content="article" />
            {post.image ? (
              <>
                <meta property="og:image" content={`https://harishvudari.online${post.image.src}`} />
                <meta name="twitter:image" content={`https://harishvudari.online${post.image.src}`} />
              </>
            ) : null}
          </>
        ) : null}
      </Head>
      <SiteFrame theme={theme}>
        <SiteHeader activeId="blog" labels={navLabels} variant="inner">
          <ThemeToggle theme={theme} onToggle={() => setTheme(theme === "dark" ? "light" : "dark")} />
        </SiteHeader>
        <main className="container blog-page">
          <BlogStatus
            status={status}
            loading="Loading this briefing…"
            empty="This briefing was not found."
            error="Could not load this briefing. Try again in a moment."
          />
          {post ? (
            <>
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
                {post.image ? <BlogFigure image={post.image} priority /> : null}
                {post.sections.map((section) => (
                  <section key={section.heading ?? section.paragraphs[0]} className="blog-article-section">
                    {section.heading ? <h2>{section.heading}</h2> : null}
                    {section.image ? <BlogFigure image={section.image} /> : null}
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
            </>
          ) : null}
        </main>
      </SiteFrame>
    </>
  );
}
