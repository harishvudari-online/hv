export type ReferenceImage = {
  id: string;
  name: string;
  dataUrl: string;
};

export type Topic = {
  id: string;
  title: string;
  category: string;
  keywords: string[];
  style: string;
  tone: string;
  slideCount: number;
  ctaEnabled: boolean;
  postingTime: string;
  references: ReferenceImage[];
  createdAt: string;
};

export type Slide = {
  number: number;
  role: string;
  title: string;
  body: string;
  prompt: string;
  imageUrl: string;
  width: number;
  height: number;
};

export type QualityCheck = {
  label: string;
  pass: boolean;
};

export type PostStatus = "draft" | "approved" | "rejected" | "scheduled" | "published";

export type Analytics = {
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  reach: number;
  impressions: number;
  engagementRate: number;
};

export type Post = {
  id: string;
  topicId: string;
  title: string;
  research: string[];
  slides: Slide[];
  caption: string;
  hashtags: string[];
  cta: string;
  primaryKeyword: string;
  quality: QualityCheck[];
  status: PostStatus;
  scheduledFor: string;
  publishedAt?: string;
  instagramPostId?: string;
  analytics?: Analytics;
  createdAt: string;
};

export type Settings = {
  postingTime: string;
  approvalRequired: boolean;
  brandName: string;
  accountHandle: string;
};

export type InstapostState = {
  topics: Topic[];
  posts: Post[];
  settings: Settings;
};

export type TopicInput = {
  title: string;
  category: string;
  keywords: string;
  style: string;
  tone: string;
  slideCount: number;
  ctaEnabled: boolean;
  postingTime: string;
  references: ReferenceImage[];
};

const STORAGE_KEY = "instapost-dashboard-v1";
const BLOCKED_WORDS = ["scam", "hate", "kill"];

const seedTopic: Topic = {
  id: "topic-ai-jobs-2026",
  title: "AI Jobs in 2026",
  category: "Technology",
  keywords: ["AI jobs", "future of work", "AI skills"],
  style: "Modern tech, neon cards, bold number overlays",
  tone: "Professional",
  slideCount: 5,
  ctaEnabled: true,
  postingTime: "09:00",
  references: [],
  createdAt: "2026-10-05T04:00:00.000Z"
};

const seedSettings: Settings = {
  postingTime: "09:00",
  approvalRequired: true,
  brandName: "instapost",
  accountHandle: "@instapost"
};

export function createId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-4)}`;
}

export function normalizeTitle(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

export function splitKeywords(value: string) {
  return value
    .split(",")
    .map((keyword) => keyword.trim())
    .filter(Boolean)
    .slice(0, 8);
}

function clampSlides(value: number) {
  if (!Number.isFinite(value)) return 5;
  return Math.min(7, Math.max(3, Math.round(value)));
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function wrapLines(value: string, max = 24, limit = 4) {
  const words = value.trim().split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";
  words.forEach((word) => {
    const next = current ? `${current} ${word}` : word;
    if (next.length > max && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  });
  if (current) lines.push(current);
  return lines.slice(0, limit);
}

function hasBlockedLanguage(value: string) {
  const text = value.toLowerCase();
  return BLOCKED_WORDS.some((word) => new RegExp(`\\b${word}\\b`, "i").test(text));
}

function tagFrom(value: string) {
  const cleaned = value
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
  return cleaned ? `#${cleaned}` : "";
}

function slideCopy(topic: Topic) {
  const points = [
    {
      role: "Point",
      title: `What is changing in ${topic.category}`,
      body: `Lead with the clearest shift behind ${topic.title}.`
    },
    {
      role: "Point",
      title: topic.keywords[0] ? `Watch ${topic.keywords[0]}` : "The trend to watch",
      body: `Connect the slide to ${topic.keywords[0] || topic.category}.`
    },
    {
      role: "Point",
      title: topic.keywords[1] ? `Use ${topic.keywords[1]}` : "A practical next step",
      body: `Keep the ${topic.tone.toLowerCase()} tone and make the action obvious.`
    }
  ];
  const cta = {
    role: "CTA",
    title: topic.ctaEnabled ? "Save this and try one idea today" : "Remember this takeaway",
    body: topic.ctaEnabled ? "Ask people to save, share, or comment." : "Close on the lesson without a hard sell."
  };
  const cover = {
    role: "Cover",
    title: topic.title,
    body: "Hook cover with one clear promise."
  };
  const count = clampSlides(topic.slideCount);
  if (count < 5) {
    return [cover, ...points.slice(0, count - 2), cta];
  }
  const extras = Array.from({ length: count - 5 }, (_, index) => ({
    role: "Point",
    title: topic.keywords[index + 2] ? `Also cover ${topic.keywords[index + 2]}` : `Extra angle ${index + 1}`,
    body: `Add a new point about ${topic.title} without repeating an earlier slide.`
  }));
  return [cover, ...points, ...extras, cta];
}

export function buildSlides(topic: Topic, variant = 0): Slide[] {
  const referenceNote = topic.references.length
    ? `Match the uploaded references: ${topic.references.map((image) => image.name).join(", ")}.`
    : "No reference thumbnail is attached, so use the saved visual style.";
  return slideCopy(topic).map((slide, index) => {
    const next = {
      number: index + 1,
      role: slide.role,
      title: slide.title,
      body: slide.body,
      prompt: `${topic.style}. ${referenceNote} ${topic.tone} ${slide.role.toLowerCase()} slide.`,
      imageUrl: "",
      width: 1080,
      height: 1350
    };
    return { ...next, imageUrl: slideImageUrl(topic, next, variant) };
  });
}

export function slideImageUrl(topic: Topic, slide: Slide, variant = 0) {
  const palettes = [
    ["#071833", "#00c2ff"],
    ["#102018", "#3dd68c"],
    ["#24122f", "#d56bff"],
    ["#2b1a08", "#ffb020"]
  ];
  const [background, accent] = palettes[(slide.number + variant) % palettes.length];
  const titleLines = wrapLines(slide.title, 18, 4)
    .map((line, index) => {
      const y = 430 + index * 86;
      return `<text x="96" y="${y}" fill="#ffffff" font-size="64" font-family="Arial, sans-serif" font-weight="700">${escapeXml(line)}</text>`;
    })
    .join("");
  const bodyLines = wrapLines(slide.body, 42, 3)
    .map((line, index) => {
      const y = 860 + index * 42;
      return `<text x="96" y="${y}" fill="#d7f7ff" font-size="30" font-family="Arial, sans-serif">${escapeXml(line)}</text>`;
    })
    .join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350">
    <rect width="1080" height="1350" fill="${background}"/>
    <circle cx="900" cy="180" r="180" fill="${accent}" opacity="0.18"/>
    <rect x="64" y="64" width="952" height="1222" rx="48" fill="none" stroke="${accent}" stroke-width="8"/>
    <text x="96" y="180" fill="${accent}" font-size="34" font-family="Arial, sans-serif" font-weight="700">${escapeXml(topic.category.toUpperCase())}</text>
    <text x="96" y="270" fill="${accent}" font-size="92" font-family="Arial, sans-serif" font-weight="700">${String(slide.number).padStart(2, "0")}</text>
    ${titleLines}
    ${bodyLines}
    <text x="96" y="1180" fill="#ffffff" font-size="28" font-family="Arial, sans-serif">${escapeXml(topic.references.length ? `${topic.references.length} style reference${topic.references.length === 1 ? "" : "s"}` : "Style reference pending")}</text>
  </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export function buildQuality(topic: Topic, post: Pick<Post, "title" | "caption" | "hashtags" | "slides">, topics: Topic[]): QualityCheck[] {
  const text = `${post.title} ${post.caption} ${post.slides.map((slide) => `${slide.title} ${slide.body}`).join(" ")}`;
  const duplicateTopic = topics.filter((item) => normalizeTitle(item.title) === normalizeTitle(topic.title)).length > 1;
  return [
    { label: "No duplicate topic", pass: !duplicateTopic },
    { label: "Five carousel images generated", pass: post.slides.length === 5 && post.slides.every((slide) => slide.imageUrl.startsWith("data:image/")) },
    { label: "Caption generated", pass: post.caption.trim().length >= 40 },
    { label: "Hashtags generated", pass: post.hashtags.length >= 4 },
    { label: "Slide text is readable", pass: post.slides.every((slide) => slide.title.trim().length > 0 && slide.title.length <= 80) },
    { label: "Image dimensions are 1080×1350", pass: post.slides.every((slide) => slide.width === 1080 && slide.height === 1350) },
    { label: "No blocked language", pass: !hasBlockedLanguage(text) },
    { label: "Post matches the selected topic", pass: post.title === topic.title },
    { label: "Posting time is set", pass: /^([01]\d|2[0-3]):[0-5]\d$/.test(topic.postingTime) }
  ];
}

export function qualityPasses(checks: QualityCheck[]) {
  return checks.every((check) => check.pass);
}

function buildCaption(topic: Topic, research: string[]) {
  const keyword = topic.keywords[0] || topic.title;
  const cta = topic.ctaEnabled
    ? "Save this carousel and comment with the slide you want turned into tomorrow's post."
    : "Save this carousel for your next planning session.";
  return `${topic.title}\n\n${research[0]} The focus keyword is ${keyword}.\n\n${cta}`;
}

function buildHashtags(topic: Topic) {
  const tags = [topic.title, topic.category, ...topic.keywords, "Instagram carousel", "daily post"].map(tagFrom).filter(Boolean);
  return Array.from(new Set(tags)).slice(0, 8);
}

export function buildPost(topic: Topic, topics: Topic[], variant = 0, id = "post-ai-jobs-2026"): Post {
  const research = [
    `${topic.title} is queued as today's ${topic.category.toLowerCase()} carousel.`,
    `Useful angles: ${topic.keywords.join(", ") || topic.category}.`,
    `Visual direction: ${topic.style}.`,
    topic.references.length
      ? `${topic.references.length} reference thumbnail${topic.references.length === 1 ? "" : "s"} guide the image style.`
      : "Add reference thumbnails when you want the images to follow a specific look.",
    `Voice: ${topic.tone}.`
  ];
  const slides = buildSlides(topic, variant);
  const caption = buildCaption(topic, research);
  const hashtags = buildHashtags(topic);
  const cta = topic.ctaEnabled ? "Save this and apply one idea today." : "Keep the takeaway visible on the final slide.";
  const draft = {
    title: topic.title,
    caption,
    hashtags,
    slides
  };
  return {
    id,
    topicId: topic.id,
    title: topic.title,
    research,
    slides,
    caption,
    hashtags,
    cta,
    primaryKeyword: topic.keywords[0] || topic.title,
    quality: buildQuality(topic, draft, topics),
    status: "draft",
    scheduledFor: `Daily at ${topic.postingTime}`,
    createdAt: "2026-10-05T04:00:00.000Z"
  };
}

export const seedState: InstapostState = {
  topics: [seedTopic],
  posts: [buildPost(seedTopic, [seedTopic])],
  settings: seedSettings
};

export function loadState(): InstapostState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as InstapostState;
    if (!parsed || !Array.isArray(parsed.topics) || !Array.isArray(parsed.posts) || !parsed.settings) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveState(state: InstapostState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function latestPost(state: InstapostState, topicId?: string) {
  if (!topicId) return undefined;
  const matches = state.posts.filter((post) => post.topicId === topicId);
  return matches[matches.length - 1];
}

export function addTopic(state: InstapostState, input: TopicInput) {
  const title = input.title.trim();
  if (title.length < 3) return { state, error: "Add a topic title with at least 3 characters." };
  if (state.topics.some((topic) => normalizeTitle(topic.title) === normalizeTitle(title))) {
    return { state, error: "That topic already exists. Duplicate topics are blocked." };
  }
  const topic: Topic = {
    id: createId("topic"),
    title,
    category: input.category.trim() || "General",
    keywords: splitKeywords(input.keywords),
    style: input.style.trim() || "Modern, high contrast, bold headline",
    tone: input.tone.trim() || "Professional",
    slideCount: clampSlides(input.slideCount),
    ctaEnabled: input.ctaEnabled,
    postingTime: input.postingTime || state.settings.postingTime,
    references: input.references.slice(0, 6),
    createdAt: new Date().toISOString()
  };
  return { state: { ...state, topics: [topic, ...state.topics] }, topicId: topic.id };
}

export function removeTopic(state: InstapostState, topicId: string) {
  const published = state.posts.some((post) => post.topicId === topicId && post.status === "published");
  if (published) return { state, error: "Published topics stay in the calendar so analytics remain attached." };
  return {
    state: {
      ...state,
      topics: state.topics.filter((topic) => topic.id !== topicId),
      posts: state.posts.filter((post) => post.topicId !== topicId)
    }
  };
}

export function addReferences(state: InstapostState, topicId: string, references: ReferenceImage[]) {
  return {
    ...state,
    topics: state.topics.map((topic) =>
      topic.id === topicId ? { ...topic, references: [...topic.references, ...references].slice(0, 6) } : topic
    )
  };
}

export function removeReference(state: InstapostState, topicId: string, referenceId: string) {
  return {
    ...state,
    topics: state.topics.map((topic) =>
      topic.id === topicId ? { ...topic, references: topic.references.filter((image) => image.id !== referenceId) } : topic
    )
  };
}

export function generatePost(state: InstapostState, topicId: string, mode: "create" | "images" | "all" = "create") {
  const topic = state.topics.find((item) => item.id === topicId);
  if (!topic) return { state, error: "Choose a topic before generating." };
  const current = latestPost(state, topicId);
  if (mode === "create" && state.posts.some((item) => item.topicId === topicId && item.status !== "rejected")) {
    return { state, error: "This topic already has a post. Reject the current draft before creating another." };
  }
  if ((mode === "images" || mode === "all") && current && (current.status === "published" || current.status === "scheduled")) {
    return { state, error: "Reject or publish flow must be reset before regenerating a scheduled post." };
  }
  const variant = mode === "create" ? 0 : Date.now() % 4;
  const created = buildPost(topic, state.topics, variant, mode === "create" || !current ? createId("post") : current.id);
  created.createdAt = new Date().toISOString();
  if (mode === "images" && current) {
    created.caption = current.caption;
    created.status = "draft";
    created.quality = buildQuality(topic, created, state.topics);
  }
  const posts = mode === "create" ? [...state.posts, created] : state.posts.map((post) => (post.id === created.id ? created : post));
  return { state: { ...state, posts }, postId: created.id };
}

export function updateCaption(state: InstapostState, postId: string, caption: string) {
  return {
    ...state,
    posts: state.posts.map((post) => {
      if (post.id !== postId || post.status === "published") return post;
      const topic = state.topics.find((item) => item.id === post.topicId);
      if (!topic) return post;
      const next = { ...post, caption, status: post.status === "scheduled" ? post.status : "draft" as PostStatus };
      return { ...next, quality: buildQuality(topic, next, state.topics) };
    })
  };
}

export function setPostStatus(state: InstapostState, postId: string, status: PostStatus) {
  const post = state.posts.find((item) => item.id === postId);
  const topic = state.topics.find((item) => item.id === post?.topicId);
  if (!post || !topic) return { state, error: "The selected post could not be found." };
  if ((status === "approved" || status === "scheduled") && !qualityPasses(post.quality)) {
    return { state, error: "Resolve the failed quality checks before approving or scheduling." };
  }
  if (status === "scheduled" && state.settings.approvalRequired && post.status !== "approved" && post.status !== "scheduled") {
    return { state, error: "Approve the carousel before scheduling it." };
  }
  return {
    state: {
      ...state,
      posts: state.posts.map((item) =>
        item.id === postId
          ? { ...item, status, scheduledFor: status === "scheduled" ? `Daily at ${topic.postingTime}` : item.scheduledFor }
          : item
      )
    }
  };
}

export function publishPost(state: InstapostState, postId: string) {
  const post = state.posts.find((item) => item.id === postId);
  const topic = state.topics.find((item) => item.id === post?.topicId);
  if (!post || !topic) return { state, error: "The selected post could not be found." };
  if (!qualityPasses(post.quality)) return { state, error: "Quality checks must pass before publishing." };
  if (state.settings.approvalRequired && post.status !== "approved" && post.status !== "scheduled") {
    return { state, error: "Human approval is required before this post can be published." };
  }
  const reach = 4800 + (topic.title.length * 173) % 8000;
  const likes = Math.round(reach * 0.058);
  const comments = Math.max(12, Math.round(likes * 0.08));
  const shares = Math.max(8, Math.round(likes * 0.05));
  const saves = Math.max(20, Math.round(likes * 0.22));
  const impressions = Math.round(reach * 1.35);
  const analytics = {
    likes,
    comments,
    shares,
    saves,
    reach,
    impressions,
    engagementRate: Number((((likes + comments + shares + saves) / reach) * 100).toFixed(1))
  };
  return {
    state: {
      ...state,
      posts: state.posts.map((item) =>
        item.id === postId
          ? {
              ...item,
              status: "published" as PostStatus,
              publishedAt: new Date().toISOString(),
              instagramPostId: `local_${item.id}`,
              analytics
            }
          : item
      )
    }
  };
}

export function updateSettings(state: InstapostState, settings: Settings) {
  return { ...state, settings: { ...state.settings, ...settings, postingTime: settings.postingTime || state.settings.postingTime } };
}
