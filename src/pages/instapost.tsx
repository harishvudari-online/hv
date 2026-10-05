import Head from "next/head";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  ChartBar,
  CircleCheck,
  CircleAlert,
  Images,
  RefreshCcw,
  Send,
  ShieldCheck,
  Sparkles,
  Trash2
} from "lucide-react";
import { SiteFrame } from "@/components/SiteFrame";
import { SiteHeader, ThemeToggle } from "@/components/SiteHeader";
import {
  addReferences,
  addTopic,
  generatePost,
  latestPost,
  loadState,
  publishPost,
  qualityPasses,
  removeReference,
  removeTopic,
  saveState,
  seedState,
  setPostStatus,
  updateCaption,
  updateSettings,
  type InstapostState,
  type Post,
  type ReferenceImage,
  type Topic
} from "@/lib/instapost";

const navLabels = {
  home: "Home",
  skills: "Skills",
  experience: "Experience",
  projects: "Projects",
  blog: "Blog",
  instapost: "instapost",
  contact: "Contact"
};

const tabs = [
  ["today", "Today's Post"],
  ["calendar", "Content Calendar"],
  ["topics", "Topics"],
  ["references", "Reference Images"],
  ["generated", "AI Generated Posts"],
  ["scheduled", "Scheduled Posts"],
  ["published", "Published Posts"],
  ["analytics", "Analytics"],
  ["settings", "Settings"]
] as const;

type TabId = (typeof tabs)[number][0];

const emptyForm = {
  title: "",
  category: "Technology",
  keywords: "",
  style: "Modern, high contrast, bold headline",
  tone: "Professional",
  slideCount: 5,
  ctaEnabled: true,
  postingTime: "09:00"
};

function pipelineFor(post?: Post) {
  const approved = post?.status === "approved" || post?.status === "scheduled" || post?.status === "published";
  return [
    { label: "Research", state: post ? "done" : "waiting" },
    { label: "Content", state: post?.slides.length ? "done" : "waiting" },
    { label: "Images", state: post?.slides.every((slide) => slide.imageUrl) ? "done" : "waiting" },
    { label: "SEO", state: post && post.caption && post.hashtags.length ? "done" : "waiting" },
    { label: "Quality", state: post && qualityPasses(post.quality) ? "done" : post ? "active" : "waiting" },
    { label: "Approval", state: approved ? "done" : post ? "active" : "waiting" },
    { label: "Publish", state: post?.status === "published" ? "done" : "waiting" }
  ];
}

async function readReference(file: File): Promise<ReferenceImage> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read that image."));
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(file);
  });
  const resized = await new Promise<string>((resolve, reject) => {
    const image = new Image();
    image.onerror = () => reject(new Error("Could not preview that image."));
    image.onload = () => {
      const scale = Math.min(1, 720 / Math.max(image.width, image.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));
      const context = canvas.getContext("2d");
      if (!context) {
        reject(new Error("Could not prepare that image."));
        return;
      }
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", 0.82));
    };
    image.src = dataUrl;
  });
  return { id: `ref-${file.name}-${file.size}`, name: file.name, dataUrl: resized };
}

export default function InstapostPage() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [tab, setTab] = useState<TabId>("today");
  const [state, setState] = useState<InstapostState>(seedState);
  const [hydrated, setHydrated] = useState(false);
  const [activeTopicId, setActiveTopicId] = useState(seedState.topics[0]?.id ?? "");
  const [form, setForm] = useState(emptyForm);
  const [caption, setCaption] = useState(seedState.posts[0]?.caption ?? "");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = loadState();
    if (saved) {
      setState(saved);
      setActiveTopicId(saved.topics[0]?.id ?? "");
      const savedPost = latestPost(saved, saved.topics[0]?.id);
      setCaption(savedPost?.caption ?? "");
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveState(state);
  }, [hydrated, state]);

  const topic = state.topics.find((item) => item.id === activeTopicId) ?? state.topics[0];
  const post = latestPost(state, topic?.id);
  const published = state.posts.filter((item) => item.status === "published");
  const scheduled = state.posts.filter((item) => item.status === "scheduled");
  const analytics = useMemo(() => {
    return published.reduce(
      (total, item) => ({
        likes: total.likes + (item.analytics?.likes ?? 0),
        comments: total.comments + (item.analytics?.comments ?? 0),
        saves: total.saves + (item.analytics?.saves ?? 0),
        reach: total.reach + (item.analytics?.reach ?? 0)
      }),
      { likes: 0, comments: 0, saves: 0, reach: 0 }
    );
  }, [published]);

  useEffect(() => {
    setCaption(post?.caption ?? "");
  }, [post?.id, post?.caption]);

  function flash(message: string, failed = false) {
    setNotice(failed ? "" : message);
    setError(failed ? message : "");
  }

  function apply(result: { state: InstapostState; error?: string; topicId?: string }, success: string) {
    if (result.error) {
      flash(result.error, true);
      return;
    }
    setState(result.state);
    if (result.topicId) setActiveTopicId(result.topicId);
    flash(success);
  }

  function onCreateTopic(event: FormEvent) {
    event.preventDefault();
    const result = addTopic(state, { ...form, references: [] });
    if (result.error) {
      flash(result.error, true);
      return;
    }
    setState(result.state);
    if (result.topicId) setActiveTopicId(result.topicId);
    setForm({ ...emptyForm, postingTime: state.settings.postingTime });
    flash("Topic saved. Duplicate topics stay blocked.");
  }

  async function onUpload(files: FileList | null) {
    if (!topic || !files?.length) return;
    try {
      const references = await Promise.all(Array.from(files).slice(0, 6).map(readReference));
      setState(addReferences(state, topic.id, references));
      flash("Reference thumbnails saved for this topic.");
    } catch (uploadError) {
      flash(uploadError instanceof Error ? uploadError.message : "Could not upload that image.", true);
    }
  }

  return (
    <>
      <Head>
        <title>instapost dashboard</title>
        <meta
          name="description"
          content="Plan topics, generate a five-image Instagram carousel, approve it, and schedule the daily instapost workflow."
        />
        <link rel="canonical" href="https://harishvudari.online/instapost" />
      </Head>
      <SiteFrame theme={theme}>
        <SiteHeader activeId="instapost" labels={navLabels} variant="inner">
          <ThemeToggle theme={theme} onToggle={() => setTheme(theme === "dark" ? "light" : "dark")} />
        </SiteHeader>
        <main className="container instapost-page">
          <section className="instapost-hero">
            <div>
              <p className="eyebrow">
                <Images size={14} /> instapost
              </p>
              <h1>Daily Instagram carousel dashboard</h1>
              <p className="lead">
                Add a reference topic, attach thumbnail style references, generate five carousel images, edit the
                caption, pass quality checks, then approve and schedule it. Publishing stays behind human approval.
              </p>
            </div>
            <article className="card instapost-hero-card card--elevated">
              <div className="instapost-hero-card-top">
                <span className="instapost-live-dot" />
                Approval mode {state.settings.approvalRequired ? "on" : "off"}
              </div>
              <strong>{topic?.title ?? "No topic selected"}</strong>
              <p>
                {post
                  ? `${post.slides.length} slides · ${post.status} · ${post.scheduledFor}`
                  : "Generate today's carousel after choosing a topic."}
              </p>
            </article>
          </section>

          <div className="instapost-tabs" role="tablist" aria-label="instapost dashboard">
            {tabs.map(([id, label]) => (
              <button
                key={id}
                className={`instapost-tab ${tab === id ? "is-active" : ""}`}
                type="button"
                onClick={() => setTab(id)}
              >
                {label}
              </button>
            ))}
          </div>
          {error ? <p className="instapost-message">{error}</p> : null}
          {notice ? <p className="instapost-message instapost-message--ok">{notice}</p> : null}

          {tab === "today" ? (
            <section className="instapost-stack">
              <div className="instapost-pipeline">
                {pipelineFor(post).map((step) => (
                  <article key={step.label} className="card">
                    <div className={`instapost-status ${step.state === "done" ? "instapost-status--done" : ""} ${step.state === "active" ? "instapost-status--active" : ""}`}>
                      {step.state}
                    </div>
                    <h3>{step.label}</h3>
                  </article>
                ))}
              </div>
              {topic && post ? (
                <>
                  <div className="instapost-slide-grid">
                    {post.slides.map((slide) => (
                      <article key={slide.number} className="instapost-slide-preview">
                        {/* Generated carousel files are inline SVG data URLs. */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={slide.imageUrl} alt={`${slide.role}: ${slide.title}`} />
                        <strong>
                          {slide.number}. {slide.role}
                        </strong>
                        <p>{slide.prompt}</p>
                      </article>
                    ))}
                  </div>
                  <div className="instapost-dashboard-grid">
                    <article className="card card--elevated">
                      <h2>Caption and hashtags</h2>
                      <label className="instapost-field">
                        Caption
                        <textarea value={caption} onChange={(event) => setCaption(event.target.value)} rows={6} disabled={post.status === "published"} />
                      </label>
                      <div className="instapost-actions">
                        <button
                          className="btn btn--primary"
                          type="button"
                          onClick={() => {
                            setState(updateCaption(state, post.id, caption));
                            flash("Caption saved. Approval was reset if this draft had already been approved.");
                          }}
                          disabled={post.status === "published"}
                        >
                          Save caption
                        </button>
                      </div>
                      <div className="instapost-tags">
                        {post.hashtags.map((tag) => (
                          <span key={tag}>{tag}</span>
                        ))}
                      </div>
                    </article>
                    <article className="card card--elevated">
                      <h2>Quality gate</h2>
                      <ul className="instapost-checklist">
                        {post.quality.map((check) => (
                          <li key={check.label}>
                            {check.pass ? <CircleCheck size={15} /> : <CircleAlert className="is-fail" size={15} />} {check.label}
                          </li>
                        ))}
                      </ul>
                      <div className="instapost-actions">
                        <button className="btn btn--ghost" type="button" onClick={() => apply(generatePost(state, topic.id, "images"), "Carousel images regenerated.")}>
                          <RefreshCcw size={15} /> Regenerate images
                        </button>
                        <button className="btn btn--primary" type="button" onClick={() => apply(setPostStatus(state, post.id, "approved"), "Carousel approved.")}>
                          <ShieldCheck size={15} /> Approve
                        </button>
                        <button className="btn btn--ghost" type="button" onClick={() => apply(setPostStatus(state, post.id, "rejected"), "Carousel rejected. You can generate a new one.")}>
                          Reject
                        </button>
                        <button className="btn btn--ghost" type="button" onClick={() => apply(setPostStatus(state, post.id, "scheduled"), `Scheduled for ${topic.postingTime}.`)}>
                          Schedule {topic.postingTime}
                        </button>
                        <button className="btn btn--primary" type="button" onClick={() => apply(publishPost(state, post.id), "Post recorded locally. Instagram Graph API credentials are still required for a live publish.")}>
                          <Send size={15} /> Publish record
                        </button>
                      </div>
                    </article>
                    <article className="card card--elevated">
                      <h2>Research notes</h2>
                      <ul>
                        {post.research.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                      <p>Primary keyword: {post.primaryKeyword}</p>
                      <p>CTA: {post.cta}</p>
                    </article>
                  </div>
                </>
              ) : topic ? (
                <div className="card">
                  <p>No carousel yet for {topic.title}.</p>
                  <button className="btn btn--primary" type="button" onClick={() => apply(generatePost(state, topic.id), "Today's carousel generated.")}>
                    <Sparkles size={15} /> Generate 5-slide carousel
                  </button>
                </div>
              ) : (
                <div className="card">
                  <p>Add a topic, then generate the daily carousel.</p>
                  <button className="btn btn--primary" type="button" onClick={() => setTab("topics")}>
                    Add a topic
                  </button>
                </div>
              )}
              {topic && post?.status === "rejected" ? (
                <button className="btn btn--primary" type="button" onClick={() => apply(generatePost(state, topic.id), "A new carousel is ready for review.")}>
                  <Sparkles size={15} /> Generate another carousel
                </button>
              ) : null}
            </section>
          ) : null}

          {tab === "calendar" ? (
            <section className="card card--elevated">
              <h2>
                <CalendarDays size={16} /> Content calendar
              </h2>
              <div className="instapost-calendar">
                {state.topics.map((item) => {
                  const itemPost = latestPost(state, item.id);
                  return (
                    <button key={item.id} type="button" onClick={() => { setActiveTopicId(item.id); setTab("today"); }}>
                      <strong>{item.postingTime.slice(0, 5)}</strong>
                      <span>{item.title}</span>
                      <small>{itemPost?.status ?? "queued"}</small>
                    </button>
                  );
                })}
              </div>
              {state.topics.length === 0 ? <p>No topics are queued yet.</p> : null}
            </section>
          ) : null}

          {tab === "topics" ? (
            <section className="instapost-split">
              <form className="card card--elevated instapost-form" onSubmit={onCreateTopic}>
                <h2>Add topic</h2>
                <label className="instapost-field">
                  Topic
                  <input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required />
                </label>
                <label className="instapost-field">
                  Category
                  <input value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} />
                </label>
                <label className="instapost-field">
                  Keywords
                  <input value={form.keywords} onChange={(event) => setForm({ ...form, keywords: event.target.value })} placeholder="AI jobs, AI careers, future of work" />
                </label>
                <label className="instapost-field">
                  Visual style
                  <input value={form.style} onChange={(event) => setForm({ ...form, style: event.target.value })} />
                </label>
                <label className="instapost-field">
                  Tone
                  <input value={form.tone} onChange={(event) => setForm({ ...form, tone: event.target.value })} />
                </label>
                <label className="instapost-field">
                  Slides
                  <input type="number" min={3} max={7} value={form.slideCount} onChange={(event) => setForm({ ...form, slideCount: Number(event.target.value) })} />
                </label>
                <p>Approval expects 5 slides. Another count is saved, but the quality gate will block it.</p>
                <label className="instapost-check">
                  <input type="checkbox" checked={form.ctaEnabled} onChange={(event) => setForm({ ...form, ctaEnabled: event.target.checked })} />
                  Include CTA slide
                </label>
                <label className="instapost-field">
                  Posting time
                  <input type="time" value={form.postingTime} onChange={(event) => setForm({ ...form, postingTime: event.target.value })} />
                </label>
                <button className="btn btn--primary" type="submit">Save topic</button>
              </form>
              <div className="instapost-topic-list">
                {state.topics.map((item) => (
                  <article key={item.id} className={`card ${item.id === topic?.id ? "is-active" : ""}`}>
                    <button type="button" className="instapost-topic-select" onClick={() => { setActiveTopicId(item.id); setTab("today"); }}>
                      <strong>{item.title}</strong>
                      <span>{item.category} · {item.references.length} references · {latestPost(state, item.id)?.status ?? "queued"}</span>
                    </button>
                    <button
                      className="instapost-icon-button"
                      type="button"
                      aria-label={`Remove ${item.title}`}
                      onClick={() => apply(removeTopic(state, item.id), "Topic removed.")}
                    >
                      <Trash2 size={15} />
                    </button>
                  </article>
                ))}
              </div>
            </section>
          ) : null}

          {tab === "references" && topic ? (
            <section className="card card--elevated">
              <h2>Reference thumbnails for {topic.title}</h2>
              <label className="btn btn--ghost instapost-upload">
                Upload images
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(event) => {
                    void onUpload(event.target.files);
                    event.target.value = "";
                  }}
                />
              </label>
              <div className="instapost-reference-grid">
                {topic.references.map((image) => (
                  <figure key={image.id}>
                    {/* Uploaded references are resized data URLs stored in the browser. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={image.dataUrl} alt={image.name} />
                    <figcaption>{image.name}</figcaption>
                    <button type="button" onClick={() => { setState(removeReference(state, topic.id, image.id)); flash("Reference removed."); }}>
                      Remove
                    </button>
                  </figure>
                ))}
              </div>
              {topic.references.length === 0 ? <p>Upload one or more thumbnails. New image generation will name them in the slide prompt.</p> : null}
            </section>
          ) : null}

          {tab === "generated" ? <PostList title="AI generated posts" posts={state.posts} topics={state.topics} onOpen={(topicId) => { setActiveTopicId(topicId); setTab("today"); }} /> : null}
          {tab === "scheduled" ? <PostList title="Scheduled posts" posts={scheduled} topics={state.topics} onOpen={(topicId) => { setActiveTopicId(topicId); setTab("today"); }} empty="Nothing is scheduled yet. Approve a carousel first." /> : null}
          {tab === "published" ? <PostList title="Published posts" posts={published} topics={state.topics} onOpen={(topicId) => { setActiveTopicId(topicId); setTab("today"); }} empty="No local publish records yet." /> : null}

          {tab === "analytics" ? (
            <section className="instapost-metrics">
              <article className="card card--elevated"><ChartBar size={18} /><span>Reach</span><strong>{analytics.reach}</strong></article>
              <article className="card card--elevated"><span>Likes</span><strong>{analytics.likes}</strong></article>
              <article className="card card--elevated"><span>Comments</span><strong>{analytics.comments}</strong></article>
              <article className="card card--elevated"><span>Saves</span><strong>{analytics.saves}</strong></article>
              {published.length === 0 ? <p>Analytics appear after a post is approved and the local publish record is created.</p> : null}
            </section>
          ) : null}

          {tab === "settings" ? (
            <form
              key={`${hydrated}-${state.settings.approvalRequired}-${state.settings.postingTime}`}
              className="card card--elevated instapost-form"
              onSubmit={(event) => {
                event.preventDefault();
                const data = new FormData(event.currentTarget);
                setState(updateSettings(state, {
                  postingTime: String(data.get("postingTime") || "09:00"),
                  approvalRequired: data.get("approvalRequired") === "on",
                  brandName: String(data.get("brandName") || "instapost"),
                  accountHandle: String(data.get("accountHandle") || "@instapost")
                }));
                flash("Workflow settings saved.");
              }}
            >
              <h2>Workflow settings</h2>
              <label className="instapost-field">
                Daily posting time
                <input name="postingTime" type="time" defaultValue={state.settings.postingTime} />
              </label>
              <label className="instapost-field">
                Brand
                <input name="brandName" defaultValue={state.settings.brandName} />
              </label>
              <label className="instapost-field">
                Account handle
                <input name="accountHandle" defaultValue={state.settings.accountHandle} />
              </label>
              <label className="instapost-check">
                <input name="approvalRequired" type="checkbox" defaultChecked={state.settings.approvalRequired} />
                Require human approval before scheduling or publishing
              </label>
              <button className="btn btn--primary" type="submit">Save settings</button>
              <div className="instapost-integration-list">
                <span>Instagram Graph API not connected</span>
                <span>Business or Creator account required</span>
                <span>Server credentials stay out of the browser</span>
                <span>Scheduler target {state.settings.postingTime}</span>
              </div>
            </form>
          ) : null}
        </main>
      </SiteFrame>
    </>
  );
}

function PostList({
  title,
  posts,
  topics,
  onOpen,
  empty
}: {
  title: string;
  posts: Post[];
  topics: Topic[];
  onOpen: (topicId: string) => void;
  empty?: string;
}) {
  return (
    <section className="instapost-stack">
      <h2>{title}</h2>
      {posts.length === 0 ? <p className="card">{empty ?? "No generated posts yet."}</p> : null}
      {posts.map((post) => {
        const topic = topics.find((item) => item.id === post.topicId);
        return (
          <button key={post.id} className="card instapost-post-row" type="button" onClick={() => onOpen(post.topicId)}>
            <strong>{post.title}</strong>
            <span>{post.status}</span>
            <span>{topic?.postingTime}</span>
            <span>{post.instagramPostId ?? post.scheduledFor}</span>
          </button>
        );
      })}
    </section>
  );
}
