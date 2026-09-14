import Head from "next/head";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/router";
import { Clock3, Newspaper } from "lucide-react";
import { BlogCard } from "@/components/BlogCard";
import { BlogFigure } from "@/components/BlogFigure";
import { BlogRichText } from "@/components/BlogRichText";
import { BlogStatus } from "@/components/BlogStatus";
import { SiteFrame } from "@/components/SiteFrame";
import { SiteHeader, ThemeToggle } from "@/components/SiteHeader";
import { useBlogPost } from "@/hooks/useBlog";
import { formatBlogDate, getCategoryLabel, selectFaq } from "@/lib/blog";

const navLabels = {
  home: "Home",
  skills: "Skills",
  experience: "Experience",
  projects: "Projects",
  blog: "Blog",
  contact: "Contact"
};

const SITE_ORIGIN = "https://harishvudari.online";

export default function BlogArticlePage() {
  const router = useRouter();
  const slug = typeof router.query.slug === "string" ? router.query.slug : "";
  const { status, post, related } = useBlogPost(slug);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const canonical = post ? `${SITE_ORIGIN}/blog/${post.slug}` : `${SITE_ORIGIN}/blog`;
  const categoryLabel = post ? getCategoryLabel(post.category) : "Blog";
  const ogImage = post?.image ? `${SITE_ORIGIN}${post.image.src}` : `${SITE_ORIGIN}/og-image.svg`;
  const faq = useMemo(() => (post ? selectFaq(post) : []), [post]);
  const jsonLd = useMemo(() => {
    if (!post) {
      return null;
    }
    const article = {
      "@type": "NewsArticle",
      "@id": `${canonical}#article`,
      headline: post.title,
      description: post.seo.metaDescription,
      datePublished: `${post.publishedAt}T00:00:00+00:00`,
      dateModified: `${post.publishedAt}T00:00:00+00:00`,
      inLanguage: "en-IN",
      url: canonical,
      mainEntityOfPage: canonical,
      image: [ogImage],
      keywords: post.seo.keywords.join(", "),
      articleSection: categoryLabel,
      wordCount: post.sections.flatMap((section) => section.paragraphs).join(" ").split(/\s+/).length,
      author: {
        "@type": "Person",
        name: "Harish Vudari",
        url: SITE_ORIGIN
      },
      publisher: {
        "@type": "Organization",
        name: "Harish Vudari",
        url: SITE_ORIGIN,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_ORIGIN}/og-image.svg`
        }
      },
      citation: post.sources.map((source) => source.url)
    };
    const breadcrumbs = {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_ORIGIN },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_ORIGIN}/blog` },
        {
          "@type": "ListItem",
          position: 3,
          name: categoryLabel,
          item: `${SITE_ORIGIN}/blog/category/${post.category}`
        },
        { "@type": "ListItem", position: 4, name: post.title, item: canonical }
      ]
    };
    const graph: object[] = [article, breadcrumbs];
    if (faq.length > 0) {
      graph.push({
        "@type": "FAQPage",
        mainEntity: faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer
          }
        }))
      });
    }
    return {
      "@context": "https://schema.org",
      "@graph": graph
    };
  }, [canonical, categoryLabel, faq, ogImage, post]);

  return (
    <>
      <Head>
        <title>{post?.seo.metaTitle ?? "AI News & Future Trends"}</title>
        {post ? (
          <>
            <meta name="description" content={post.seo.metaDescription} />
            <meta name="keywords" content={post.seo.keywords.join(", ")} />
            <meta name="robots" content="index, follow, max-image-preview:large" />
            <link rel="canonical" href={canonical} />
            <meta property="og:site_name" content="Harish Vudari" />
            <meta property="og:title" content={post.seo.metaTitle} />
            <meta property="og:description" content={post.seo.metaDescription} />
            <meta property="og:url" content={canonical} />
            <meta property="og:type" content="article" />
            <meta property="og:locale" content="en_IN" />
            <meta property="og:image" content={ogImage} />
            <meta property="og:image:alt" content={post.image?.alt ?? post.title} />
            <meta property="article:published_time" content={`${post.publishedAt}T00:00:00.000Z`} />
            <meta property="article:section" content={categoryLabel} />
            {post.tags.map((tag) => (
              <meta property="article:tag" content={tag} key={tag} />
            ))}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={post.seo.metaTitle} />
            <meta name="twitter:description" content={post.seo.metaDescription} />
            <meta name="twitter:image" content={ogImage} />
            {jsonLd ? (
              <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
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
                <nav className="blog-crumb" aria-label="Breadcrumb">
                  <Link href="/">Home</Link>
                  <span className="blog-crumb-sep" aria-hidden="true">
                    /
                  </span>
                  <Link href="/blog">Blog</Link>
                  <span className="blog-crumb-sep" aria-hidden="true">
                    /
                  </span>
                  <Link href={`/blog/category/${post.category}`}>{categoryLabel}</Link>
                </nav>
                <p className="eyebrow">
                  <Newspaper size={14} /> {categoryLabel}
                </p>
                <h1>{post.title}</h1>
                <p className="blog-article-meta">
                  <time dateTime={post.publishedAt}>{formatBlogDate(post.publishedAt)}</time>
                  <span>
                    <Clock3 size={13} /> {post.readingMinutes} min read
                  </span>
                </p>
                <p className="lead">
                  <BlogRichText text={post.excerpt} />
                </p>
                {post.image ? <BlogFigure image={post.image} priority /> : null}
                {post.sections.map((section) => (
                  <section key={section.heading ?? section.paragraphs[0]} className="blog-article-section">
                    {section.heading ? <h2>{section.heading}</h2> : null}
                    {section.image ? <BlogFigure image={section.image} /> : null}
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph}>
                        <BlogRichText text={paragraph} />
                      </p>
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
