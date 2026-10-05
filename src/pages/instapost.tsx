import Head from "next/head";
import { useMemo, useState } from "react";
import {
  BarChart3,
  Bot,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Database,
  FileImage,
  Hash,
  ImagePlus,
  Instagram,
  Layers3,
  Megaphone,
  RefreshCcw,
  Rocket,
  Search,
  Send,
  Settings2,
  ShieldCheck,
  Sparkles,
  Wand2
} from "lucide-react";
import { motion } from "framer-motion";
import { SiteFrame } from "@/components/SiteFrame";
import { SiteHeader, ThemeToggle } from "@/components/SiteHeader";

const navLabels = {
  home: "Home",
  skills: "Skills",
  experience: "Experience",
  projects: "Projects",
  blog: "Blog",
  instapost: "instapost",
  contact: "Contact"
};

const topics = [
  {
    id: "ai-jobs-2026",
    title: "AI Jobs in 2026",
    category: "Technology",
    keywords: ["AI jobs", "automation", "future skills"],
    style: "Modern tech, neon cards, bold number overlays",
    postingTime: "09:00 AM",
    referenceCount: 4,
    status: "Ready for approval",
    duplicateRisk: "Low"
  },
  {
    id: "personal-finance-ai",
    title: "AI tools for personal finance",
    category: "Finance",
    keywords: ["AI finance", "budgeting", "automation"],
    style: "Clean finance dashboard, green accents, data widgets",
    postingTime: "11:30 AM",
    referenceCount: 3,
    status: "Research queued",
    duplicateRisk: "Low"
  },
  {
    id: "creator-workflows",
    title: "Creator workflow automation",
    category: "Creators",
    keywords: ["creator tools", "content system", "daily posts"],
    style: "Minimal creator desk, soft gradients, practical UI",
    postingTime: "06:00 PM",
    referenceCount: 5,
    status: "Images regenerating",
    duplicateRisk: "Medium"
  }
];

const pipeline = [
  { label: "Research", detail: "Topic facts, sources, angles", icon: Search, state: "done" },
  { label: "Content", detail: "5-slide story arc generated", icon: Bot, state: "done" },
  { label: "Images", detail: "Reference style applied", icon: FileImage, state: "done" },
  { label: "SEO", detail: "Caption, CTA, hashtags", icon: Hash, state: "done" },
  { label: "Quality", detail: "Duplicate and format checks", icon: ShieldCheck, state: "done" },
  { label: "Approval", detail: "Human review required in V1", icon: CheckCircle2, state: "active" },
  { label: "Publish", detail: "Instagram Graph API handoff", icon: Send, state: "waiting" }
];

const slides = [
  {
    number: "01",
    title: "AI Is Changing Jobs Faster Than You Think",
    body: "Hook cover with a clear promise and bold visual contrast.",
    prompt: "Futuristic office, human + AI collaboration, premium tech thumbnail"
  },
  {
    number: "02",
    title: "5 Roles Most Exposed",
    body: "Summarize repetitive workflows and why they are vulnerable.",
    prompt: "Split-panel job cards with automation indicators"
  },
  {
    number: "03",
    title: "Why Companies Adopt AI",
    body: "Show cost, speed, quality, and customer-experience drivers.",
    prompt: "Executive dashboard with adoption metrics and glowing charts"
  },
  {
    number: "04",
    title: "New Jobs AI Creates",
    body: "Introduce agent operators, AI product owners, and prompt QA.",
    prompt: "New career map with connected nodes and role badges"
  },
  {
    number: "05",
    title: "What To Learn Now",
    body: "CTA slide with skills and a save/share action.",
    prompt: "Learning roadmap, checklist, bold CTA footer"
  }
];

const qualityChecks = [
  "No duplicate topic in calendar",
  "Five carousel images planned",
  "Caption and hashtags generated",
  "Readable text-safe slide layout",
  "Instagram carousel requirements met",
  "Manual approval before publishing"
];

const calendarItems = [
  { day: "Mon", title: "AI Jobs in 2026", status: "Approval" },
  { day: "Tue", title: "AI finance tools", status: "Research" },
  { day: "Wed", title: "Creator workflow automation", status: "Images" },
  { day: "Thu", title: "Prompt systems for teams", status: "Queued" }
];

const agentRoles = [
  "Research Agent",
  "Content Agent",
  "Image Agent",
  "SEO Agent",
  "Quality Agent",
  "Publishing Agent"
];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 }
};

function statusClass(state: string) {
  if (state === "done") return "instapost-status instapost-status--done";
  if (state === "active") return "instapost-status instapost-status--active";
  return "instapost-status";
}

export default function InstapostPage() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [activeTopicId, setActiveTopicId] = useState(topics[0].id);
  const selectedTopic = useMemo(
    () => topics.find((topic) => topic.id === activeTopicId) ?? topics[0],
    [activeTopicId]
  );

  return (
    <>
      <Head>
        <title>instapost Instagram Automation Dashboard</title>
        <meta
          name="description"
          content="instapost dashboard for planning, generating, approving, scheduling, and publishing Instagram carousel content."
        />
        <link rel="canonical" href="https://harishvudari.online/instapost" />
      </Head>
      <SiteFrame theme={theme}>
        <SiteHeader activeId="instapost" labels={navLabels} variant="inner">
          <ThemeToggle theme={theme} onToggle={() => setTheme(theme === "dark" ? "light" : "dark")} />
        </SiteHeader>

        <main className="container instapost-page">
          <motion.section
            className="instapost-hero"
            initial="hidden"
            animate="show"
            transition={{ staggerChildren: 0.08 }}
          >
            <motion.div variants={fadeUp}>
              <p className="eyebrow">
                <Instagram size={14} /> instapost
              </p>
              <h1>Instagram AI content automation dashboard</h1>
              <p className="lead">
                Plan daily topics, attach reference thumbnails, generate a five-slide carousel, run SEO and quality
                checks, approve the post, then schedule publishing through the Instagram Graph API.
              </p>
              <div className="instapost-actions">
                <a className="btn btn--primary" href="#instapost-preview">
                  <Sparkles size={15} /> Preview today&apos;s post
                </a>
                <a className="btn btn--ghost" href="#instapost-settings">
                  <Settings2 size={15} /> Configure workflow
                </a>
              </div>
            </motion.div>
            <motion.div className="card instapost-hero-card card--elevated" variants={fadeUp}>
              <div className="instapost-hero-card-top">
                <span className="instapost-live-dot" />
                Daily automation plan
              </div>
              <strong>Generate - Approve - Schedule</strong>
              <p>
                V1 keeps a human approval gate before publish. Fully automatic posting can be enabled after Meta API
                credentials, quality thresholds, and analytics feedback are verified.
              </p>
            </motion.div>
          </motion.section>

          <section className="grid instapost-metrics" aria-label="instapost summary">
            <article className="card card--elevated">
              <Bot size={18} />
              <span>Agents</span>
              <strong>6</strong>
              <p>Research, content, image, SEO, quality, publishing</p>
            </article>
            <article className="card card--elevated">
              <Layers3 size={18} />
              <span>Carousel slides</span>
              <strong>5</strong>
              <p>Cover, three value slides, and CTA</p>
            </article>
            <article className="card card--elevated">
              <CalendarDays size={18} />
              <span>Next schedule</span>
              <strong>{selectedTopic.postingTime}</strong>
              <p>Daily queue with duplicate prevention</p>
            </article>
            <article className="card card--elevated">
              <ShieldCheck size={18} />
              <span>Quality gate</span>
              <strong>Pass</strong>
              <p>Manual approval required before publish</p>
            </article>
          </section>

          <section className="section instapost-pipeline" aria-label="automation pipeline">
            {pipeline.map((step) => {
              const Icon = step.icon;
              return (
                <article key={step.label} className="card">
                  <div className={statusClass(step.state)}>
                    <Icon size={16} />
                    {step.state}
                  </div>
                  <h3>{step.label}</h3>
                  <p>{step.detail}</p>
                </article>
              );
            })}
          </section>

          <section className="instapost-dashboard-grid">
            <article className="card card--elevated instapost-topic-card">
              <div className="instapost-card-heading">
                <div>
                  <p className="eyebrow">
                    <ImagePlus size={14} /> Topic intake
                  </p>
                  <h2>Reference topics and thumbnails</h2>
                </div>
                <span className="instapost-pill">{selectedTopic.referenceCount} refs</span>
              </div>

              <div className="instapost-topic-list" role="listbox" aria-label="Reference topics">
                {topics.map((topic) => (
                  <button
                    key={topic.id}
                    className={`instapost-topic-button ${activeTopicId === topic.id ? "is-active" : ""}`}
                    onClick={() => setActiveTopicId(topic.id)}
                    type="button"
                  >
                    <span>{topic.title}</span>
                    <small>{topic.status}</small>
                  </button>
                ))}
              </div>

              <dl className="instapost-detail-list">
                <div>
                  <dt>Category</dt>
                  <dd>{selectedTopic.category}</dd>
                </div>
                <div>
                  <dt>Keywords</dt>
                  <dd>{selectedTopic.keywords.join(", ")}</dd>
                </div>
                <div>
                  <dt>Visual style</dt>
                  <dd>{selectedTopic.style}</dd>
                </div>
                <div>
                  <dt>Duplicate risk</dt>
                  <dd>{selectedTopic.duplicateRisk}</dd>
                </div>
              </dl>

              <div className="instapost-reference-grid" aria-label="Reference thumbnail placeholders">
                {Array.from({ length: selectedTopic.referenceCount }).map((_, index) => (
                  <span key={index}>
                    <FileImage size={16} />
                    Ref {index + 1}
                  </span>
                ))}
              </div>
            </article>

            <article id="instapost-preview" className="card card--elevated instapost-preview-card">
              <div className="instapost-card-heading">
                <div>
                  <p className="eyebrow">
                    <Wand2 size={14} /> Generated carousel
                  </p>
                  <h2>{selectedTopic.title}</h2>
                </div>
                <span className="instapost-pill">Draft</span>
              </div>

              <div className="instapost-slide-grid">
                {slides.map((slide) => (
                  <article key={slide.number} className="instapost-slide-card">
                    <span>{slide.number}</span>
                    <h3>{slide.title}</h3>
                    <p>{slide.body}</p>
                    <small>{slide.prompt}</small>
                  </article>
                ))}
              </div>

              <div className="instapost-caption-box">
                <p className="eyebrow">
                  <Megaphone size={14} /> Caption + SEO
                </p>
                <p>
                  AI is changing work faster than most people expect. Here are the roles most exposed, the jobs being
                  created, and the skills worth learning now. Save this carousel before your next career planning session.
                </p>
                <div className="instapost-tags">
                  <span>#AIJobs</span>
                  <span>#FutureOfWork</span>
                  <span>#AICareers</span>
                  <span>#Automation</span>
                  <span>#CareerGrowth</span>
                </div>
              </div>
            </article>

            <aside className="card card--elevated instapost-approval-card">
              <p className="eyebrow">
                <CheckCircle2 size={14} /> Approval gate
              </p>
              <h2>Ready for review</h2>
              <p>
                The first production version should pause here so a human can approve, edit, regenerate, or schedule the
                carousel before it reaches Instagram.
              </p>

              <div className="instapost-button-stack">
                <button type="button" className="btn btn--primary">
                  <CheckCircle2 size={15} /> Approve draft
                </button>
                <button type="button" className="btn btn--ghost">
                  <RefreshCcw size={15} /> Regenerate images
                </button>
              </div>

              <ul className="instapost-checklist">
                {qualityChecks.map((check) => (
                  <li key={check}>
                    <CheckCircle2 size={15} /> {check}
                  </li>
                ))}
              </ul>
            </aside>
          </section>

          <section id="instapost-settings" className="instapost-bottom-grid">
            <article className="card card--elevated">
              <p className="eyebrow">
                <Clock3 size={14} /> Scheduler
              </p>
              <h2>Daily content calendar</h2>
              <div className="instapost-calendar">
                {calendarItems.map((item) => (
                  <div key={item.day}>
                    <strong>{item.day}</strong>
                    <span>{item.title}</span>
                    <small>{item.status}</small>
                  </div>
                ))}
              </div>
            </article>

            <article className="card card--elevated">
              <p className="eyebrow">
                <Rocket size={14} /> Publishing setup
              </p>
              <h2>Instagram Graph API handoff</h2>
              <p>
                Production publishing should upload approved carousel media, create a media container, publish it, and
                store the Instagram post ID for analytics tracking.
              </p>
              <div className="instapost-integration-list">
                <span>Meta app credentials</span>
                <span>Business/Creator account</span>
                <span>Cloud storage URLs</span>
                <span>Vercel Cron at 09:00</span>
              </div>
            </article>

            <article className="card card--elevated">
              <p className="eyebrow">
                <BarChart3 size={14} /> Analytics
              </p>
              <h2>Feedback loop</h2>
              <div className="instapost-analytics">
                <span>
                  <strong>8.4%</strong>
                  Engagement
                </span>
                <span>
                  <strong>12.7k</strong>
                  Reach
                </span>
                <span>
                  <strong>842</strong>
                  Saves
                </span>
              </div>
            </article>

            <article className="card card--elevated">
              <p className="eyebrow">
                <Database size={14} /> Agent system
              </p>
              <h2>Maintainable workflow</h2>
              <div className="instapost-agent-list">
                {agentRoles.map((role) => (
                  <span key={role}>{role}</span>
                ))}
              </div>
            </article>
          </section>
        </main>
      </SiteFrame>
    </>
  );
}
