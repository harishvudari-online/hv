import Head from "next/head";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useScroll,
  useSpring
} from "framer-motion";
import {
  Briefcase,
  BrainCircuit,
  Building2,
  Coffee,
  Cloud,
  Database,
  Flame,
  FileText,
  Globe2,
  GraduationCap,
  Home as HomeIcon,
  Languages,
  Link2,
  Layers3,
  Mail,
  MessageCircle,
  Moon,
  Puzzle,
  Rocket,
  SendHorizontal,
  Sparkles,
  Sun,
  TrendingUp,
  UserCircle2,
  Users,
  Wrench,
  Zap
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { track } from "@vercel/analytics";
import { content } from "@/data/content";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 }
};

const navItems = [
  { id: "home", label: "Home", icon: HomeIcon },
  { id: "skills", label: "Skills", icon: Wrench },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "projects", label: "Projects", icon: Rocket },
  { id: "contact", label: "Contact", icon: Mail }
];

const skillIcons: Record<string, LucideIcon> = {
  Frontend: Wrench,
  "Backend Languages": Briefcase,
  Databases: Database,
  "Tools & Cloud": Cloud,
  "AI Tools": BrainCircuit
};

const iconMotionMap: Record<
  string,
  { whileHover: Record<string, number>; transition?: Record<string, number | string> }
> = {
  Frontend: { whileHover: { rotate: -12, scale: 1.08 }, transition: { duration: 0.22 } },
  "Backend Languages": { whileHover: { y: -2, rotate: 6, scale: 1.06 }, transition: { duration: 0.2 } },
  Databases: { whileHover: { scale: 1.1, y: -1 }, transition: { duration: 0.2 } },
  "Tools & Cloud": { whileHover: { x: 2, y: -2, scale: 1.08 }, transition: { duration: 0.22 } },
  "AI Tools": { whileHover: { rotate: 16, scale: 1.12 }, transition: { duration: 0.24 } }
};

type TitleMotionType =
  | "rise"
  | "tilt"
  | "pulse"
  | "slide"
  | "pop"
  | "drift"
  | "spin-in";

const titleIconMotions: Record<TitleMotionType, { initial: Record<string, number>; animate: Record<string, number>; transition: Record<string, number | string> }> = {
  rise: {
    initial: { opacity: 0, y: 8, scale: 0.9 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { duration: 0.35, ease: "easeOut" }
  },
  tilt: {
    initial: { opacity: 0, rotate: -14, scale: 0.92 },
    animate: { opacity: 1, rotate: 0, scale: 1 },
    transition: { duration: 0.38, ease: "easeOut" }
  },
  pulse: {
    initial: { opacity: 0, scale: 0.82 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.34, ease: "easeOut" }
  },
  slide: {
    initial: { opacity: 0, x: -10, scale: 0.94 },
    animate: { opacity: 1, x: 0, scale: 1 },
    transition: { duration: 0.36, ease: "easeOut" }
  },
  pop: {
    initial: { opacity: 0, scale: 0.76, y: 4 },
    animate: { opacity: 1, scale: 1, y: 0 },
    transition: { duration: 0.32, ease: "easeOut" }
  },
  drift: {
    initial: { opacity: 0, x: 8, y: 4, scale: 0.9 },
    animate: { opacity: 1, x: 0, y: 0, scale: 1 },
    transition: { duration: 0.38, ease: "easeOut" }
  },
  "spin-in": {
    initial: { opacity: 0, rotate: 20, scale: 0.86 },
    animate: { opacity: 1, rotate: 0, scale: 1 },
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

function SectionTitle({ icon: Icon, title, motionType }: { icon: LucideIcon; title: string; motionType: TitleMotionType }) {
  const motionPreset = titleIconMotions[motionType];
  return (
    <h3 className="section-title">
      <motion.span
        className="section-title-icon"
        initial={motionPreset.initial}
        whileInView={motionPreset.animate}
        viewport={{ once: true, amount: 0.6 }}
        transition={motionPreset.transition}
      >
        <Icon size={18} />
      </motion.span>
      {title}
    </h3>
  );
}

export default function Home() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [locale, setLocale] = useState<"en" | "zh" | "es" | "fr" | "de" | "ja">("en");
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isHeroIllustrationLoaded, setIsHeroIllustrationLoaded] = useState(false);
  const [isLoaderCycleComplete, setIsLoaderCycleComplete] = useState(false);
  const [loaderItemIndex, setLoaderItemIndex] = useState(0);
  const [activeSection, setActiveSection] = useState("home");
  const [showHireChip, setShowHireChip] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [headlineIndex, setHeadlineIndex] = useState(0);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const languageMenuRef = useRef<HTMLDivElement | null>(null);
  const data = locale === "zh" ? content.zh : content.en;
  const localizedNav = {
    en: { home: "Home", skills: "Skills", experience: "Experience", projects: "Projects", contact: "Contact", language: "Language" },
    zh: { home: "首页", skills: "技能", experience: "经验", projects: "项目", contact: "联系", language: "语言" },
    es: { home: "Inicio", skills: "Habilidades", experience: "Experiencia", projects: "Proyectos", contact: "Contacto", language: "Idioma" },
    fr: { home: "Accueil", skills: "Compétences", experience: "Expérience", projects: "Projets", contact: "Contact", language: "Langue" },
    de: { home: "Start", skills: "Fähigkeiten", experience: "Erfahrung", projects: "Projekte", contact: "Kontakt", language: "Sprache" },
    ja: { home: "ホーム", skills: "スキル", experience: "経験", projects: "プロジェクト", contact: "連絡先", language: "言語" }
  } as const;
  const headlineVariants = [
    "Senior UI Engineer (10+ Years)",
    "Angular + React Specialist",
    "Frontend Architecture & Performance Lead"
  ];
  const languageOptions = [
    { value: "en", label: "English", flag: "🇺🇸" },
    { value: "zh", label: "Chinese", flag: "🇨🇳" },
    { value: "es", label: "Spanish", flag: "🇪🇸" },
    { value: "fr", label: "French", flag: "🇫🇷" },
    { value: "de", label: "German", flag: "🇩🇪" },
    { value: "ja", label: "Japanese", flag: "🇯🇵" }
  ] as const;
  const loaderItems = [
    { text: "creator", icon: Sparkles },
    { text: "passionate", icon: Flame },
    { text: "introvert", icon: UserCircle2 },
    { text: "lazy sometimes", icon: Coffee }
  ] as const;
  const { scrollYProgress } = useScroll();
  const progressScaleX = useSpring(scrollYProgress, {
    stiffness: 130,
    damping: 25,
    restDelta: 0.001
  });
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const cursorSmoothX = useSpring(cursorX, { stiffness: 95, damping: 22 });
  const cursorSmoothY = useSpring(cursorY, { stiffness: 95, damping: 22 });
  const stepperVariants = {
    hidden: { opacity: 0, x: -20 },
    show: (index: number) => ({
      opacity: 1,
      x: 0,
      transition: { duration: 0.45, delay: index * 0.09 }
    })
  };
  const handleCtaClick = (label: string, placement: "hero" | "final" | "floating") => {
    track("cta_click", {
      label,
      placement
    });
  };

  useEffect(() => {
    const onMove = (event: MouseEvent) => {
      cursorX.set(event.clientX - 140);
      cursorY.set(event.clientY - 140);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [cursorX, cursorY]);

  useEffect(() => {
    const onScroll = () => {
      setShowHireChip(window.scrollY > 420);
      setIsScrolled(window.scrollY > 28);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      setHeadlineIndex((prev) => (prev + 1) % headlineVariants.length);
    }, 2600);
    return () => window.clearInterval(id);
  }, [headlineVariants.length]);

  useEffect(() => {
    if (!isPageLoading) return;
    const rotateId = window.setInterval(() => {
      setLoaderItemIndex((prev) => (prev + 1) % loaderItems.length);
    }, 1000);
    const cycleId = window.setTimeout(() => {
      setIsLoaderCycleComplete(true);
    }, loaderItems.length * 1000);
    return () => {
      window.clearInterval(rotateId);
      window.clearTimeout(cycleId);
    };
  }, [isPageLoading, loaderItems.length]);

  useEffect(() => {
    if (isHeroIllustrationLoaded && isLoaderCycleComplete) {
      setIsPageLoading(false);
    }
  }, [isHeroIllustrationLoaded, isLoaderCycleComplete]);

  useEffect(() => {
    const onDocumentClick = (event: MouseEvent) => {
      if (!languageMenuRef.current?.contains(event.target as Node)) {
        setLanguageMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocumentClick);
    return () => document.removeEventListener("mousedown", onDocumentClick);
  }, []);

  useEffect(() => {
    const sections = navItems
      .map((item) => document.getElementById(item.id))
      .filter((section): section is HTMLElement => Boolean(section));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.45 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => sections.forEach((section) => observer.unobserve(section));
  }, []);
  const personJsonLd = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "Person",
      name: data.hero.name,
      jobTitle: data.hero.role,
      url: data.seo.url,
      sameAs: [data.hero.linkedin],
      email: data.hero.email,
      telephone: data.hero.phone,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Hyderabad",
        addressCountry: "IN"
      },
      knowsAbout: data.hero.badges
    }),
    [data]
  );

  return (
    <>
      <Head>
        <title>{data.seo.title}</title>
        <meta name="description" content={data.seo.description} />
        <meta name="keywords" content={data.seo.keywords.join(", ")} />
        <meta property="og:title" content={data.seo.title} />
        <meta property="og:description" content={data.seo.description} />
        <meta property="og:url" content={data.seo.url} />
        <meta property="og:image" content={`${data.seo.url}/og-image.svg`} />
        <meta name="twitter:image" content={`${data.seo.url}/og-image.svg`} />
        <meta name="twitter:title" content={data.seo.title} />
        <meta name="twitter:description" content={data.seo.description} />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </Head>
      <div className={`page page--${theme}`}>
        <AnimatePresence>
          {isPageLoading ? (
            <motion.div
              className="page-loader"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <div className="page-loader-card">
                <div className="page-loader-item">
                  {(() => {
                    const Icon = loaderItems[loaderItemIndex]?.icon ?? Sparkles;
                    return <Icon size={15} />;
                  })()}
                  <p>
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={loaderItemIndex}
                        className="page-loader-trailing"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.25 }}
                      >
                        {loaderItems[loaderItemIndex]?.text}
                      </motion.span>
                    </AnimatePresence>
                  </p>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
        <motion.div className="cursor-glow" style={{ x: cursorSmoothX, y: cursorSmoothY }} />
        <motion.div className="scroll-progress" style={{ scaleX: progressScaleX }} />
        <div className="bg-mesh" />
        <div className="bg-noise" />
        <div className="bg-glow bg-glow--one" />
        <div className="bg-glow bg-glow--two" />
        <header className={`topbar container ${isScrolled ? "topbar--scrolled" : ""}`}>
          <span className="brand">harishvudari.online</span>
          <nav className="nav-pills">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={activeSection === item.id ? "is-active" : ""}
              >
                {activeSection === item.id ? (
                  <motion.span
                    layoutId="nav-active-indicator"
                    className="nav-active-indicator"
                    transition={{ type: "spring", stiffness: 320, damping: 26 }}
                  />
                ) : null}
                <item.icon size={14} />
                <span className="nav-text">
                  {localizedNav[locale][item.id as keyof (typeof localizedNav)[typeof locale]] ?? item.label}
                </span>
              </a>
            ))}
          </nav>
          <div className="topbar-tools">
            <div className="lang-menu" ref={languageMenuRef}>
              <button
                className={`lang-menu-trigger ${languageMenuOpen ? "is-open" : ""}`}
                onClick={() => setLanguageMenuOpen((prev) => !prev)}
                aria-label="Select language"
                aria-expanded={languageMenuOpen}
                aria-haspopup="menu"
              >
                <Languages size={13} />
                <span className="lang-label">{localizedNav[locale].language}</span>
                <span className="lang-current">
                  {languageOptions.find((option) => option.value === locale)?.flag}{" "}
                  {languageOptions.find((option) => option.value === locale)?.label}
                </span>
                <span className="lang-caret">▾</span>
              </button>
              <AnimatePresence>
                {languageMenuOpen ? (
                  <motion.div
                    className="lang-menu-popover"
                    role="menu"
                    initial={{ opacity: 0, scale: 0.94, y: -6 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: -4 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                  >
                    {languageOptions.map((option, index) => (
                      <motion.button
                        key={option.value}
                        className={`lang-option ${locale === option.value ? "is-selected" : ""}`}
                        onClick={() => {
                          setLocale(option.value as "en" | "zh" | "es" | "fr" | "de" | "ja");
                          setLanguageMenuOpen(false);
                        }}
                        role="menuitem"
                        initial={{ opacity: 0, x: -4 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.16, delay: index * 0.02 }}
                      >
                        <span>{option.flag}</span>
                        <span>{option.label}</span>
                      </motion.button>
                    ))}
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>

            <button
              className="theme-btn theme-btn--icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </header>

        <main className="container">
          <motion.section id="home" className="hero" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6 }}>
            <motion.div variants={fadeUp}>
              <p className="eyebrow">Senior UI Engineer | Angular + React</p>
              <h1>{data.hero.name}</h1>
              <motion.h2
                key={headlineVariants[headlineIndex]}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.38 }}
              >
                {headlineVariants[headlineIndex]}
              </motion.h2>
              <p className="lead">
                {data.hero.summary} Hiring focus: Angular, React.js, and TypeScript product teams.
              </p>
              <p className="meta">{data.hero.location}</p>
              <div className="deliver-strip">
                <span><Layers3 size={13} /> Scalable Frontend Architecture</span>
                <span><Zap size={13} /> High Performance UI</span>
                <span><Users size={13} /> Enterprise Agile Delivery</span>
              </div>
              <div className="hero-actions">
                {data.hero.ctas.map((cta) => (
                  <motion.a
                    key={cta.label}
                    href={cta.href}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn--primary"
                    onClick={() => handleCtaClick(cta.label, "hero")}
                    whileHover={{ y: -3, scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {cta.label === "Hire Me" ? (
                      <motion.span whileHover={{ rotate: 12, scale: 1.12 }} transition={{ duration: 0.2 }}>
                        <MessageCircle size={15} />
                      </motion.span>
                    ) : (
                      <motion.span whileHover={{ y: -1, scale: 1.08 }} transition={{ duration: 0.2 }}>
                        <FileText size={15} />
                      </motion.span>
                    )}{" "}
                    {cta.label}
                  </motion.a>
                ))}
                <motion.a
                  href={data.hero.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn--ghost"
                  onClick={() => handleCtaClick("LinkedIn", "hero")}
                  whileHover={{ y: -3, scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.span whileHover={{ x: 2, scale: 1.08 }} transition={{ duration: 0.2 }}>
                    <Link2 size={15} />
                  </motion.span>{" "}
                  LinkedIn
                </motion.a>
              </div>
              <div className="badge-wrap">
                {data.hero.badges.map((badge) => (
                  <span key={badge} className="badge">
                    {badge}
                  </span>
                ))}
              </div>
            </motion.div>
            <motion.div className="hero-visual" variants={fadeUp} transition={{ delay: 0.15 }}>
              <div className="hero-parallax-shell">
                <Image
                  className="hero-illustration"
                  src="/hero-vector-pro.svg"
                  alt="Frontend developer day-to-night workflow story illustration"
                  width={420}
                  height={420}
                  onLoadingComplete={() => setIsHeroIllustrationLoaded(true)}
                  onError={() => setIsHeroIllustrationLoaded(true)}
                  priority
                />
              </div>
            </motion.div>
          </motion.section>

          <motion.section className="section section--premium" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} transition={{ staggerChildren: 0.08 }}>
            <motion.div variants={fadeUp}>
              <SectionTitle icon={Building2} title={data.labels.trustedBy} motionType="slide" />
            </motion.div>
            <motion.div variants={fadeUp} className="logo-strip card card--elevated">
              {data.companies.map((company) => (
                <span key={company} className="logo-pill">
                  {company}
                </span>
              ))}
            </motion.div>
          </motion.section>

          <motion.section className="section section--premium" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} transition={{ staggerChildren: 0.08 }}>
            <motion.div variants={fadeUp}>
              <SectionTitle icon={TrendingUp} title="Career Highlights" motionType="rise" />
            </motion.div>
            <div className="grid highlights">
              <motion.article variants={fadeUp} className="card highlight-card card--elevated">
                <p className="highlight-value">10+ Years</p>
                <p className="highlight-label">Frontend engineering experience in enterprise and product teams</p>
              </motion.article>
              <motion.article variants={fadeUp} className="card highlight-card card--elevated">
                <p className="highlight-value">7 Major Programs</p>
                <p className="highlight-label">Delivered across Angular, React, Node.js, and AWS stacks</p>
              </motion.article>
              <motion.article variants={fadeUp} className="card highlight-card card--elevated">
                <p className="highlight-value">18 Live Portfolio Projects</p>
                <p className="highlight-label">Real business websites and applications shipped to production</p>
              </motion.article>
              <motion.article variants={fadeUp} className="card highlight-card card--elevated">
                <p className="highlight-value">Global + Remote</p>
                <p className="highlight-label">Delivery exposure for distributed teams and international clients</p>
              </motion.article>
            </div>
          </motion.section>

          <motion.section id="skills" className="section section--premium" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }} transition={{ staggerChildren: 0.12, delayChildren: 0.08 }}>
            <motion.div variants={fadeUp}>
              <SectionTitle icon={BrainCircuit} title="Technical Expertise" motionType="pulse" />
            </motion.div>
            <div className="grid skills">
              {data.skills.groups.map((group, index) => {
                const SkillIcon = skillIcons[group.label] ?? Globe2;
                return (
                  <motion.article
                    key={group.label}
                    variants={fadeUp}
                    className="card skill-card card--elevated"
                    whileHover={{ y: -6, rotateX: -2.5, rotateY: index % 2 === 0 ? -2.5 : 2.5 }}
                    transition={{ type: "spring", stiffness: 220, damping: 16 }}
                  >
                    <h4>
                      <motion.span
                        className="icon-chip"
                        whileHover={iconMotionMap[group.label]?.whileHover ?? { scale: 1.08 }}
                        transition={iconMotionMap[group.label]?.transition ?? { duration: 0.2 }}
                      >
                        <SkillIcon size={14} />
                      </motion.span>{" "}
                      {group.label}
                    </h4>
                    <p>{group.values.join(" | ")}</p>
                  </motion.article>
                );
              })}
            </div>
          </motion.section>

          <motion.section id="experience" className="section" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.22 }} transition={{ staggerChildren: 0.09, delayChildren: 0.06 }}>
            <motion.div variants={fadeUp}>
              <SectionTitle icon={Briefcase} title={data.labels.experience} motionType="tilt" />
            </motion.div>
            <div className="timeline">
              <motion.span
                className="timeline-line"
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.05, ease: "easeOut" }}
              />
              {data.experience.map((job, index) => (
                <motion.article
                  key={job.company}
                  custom={index}
                  variants={stepperVariants}
                  className="card timeline-item"
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.3 }}
                >
                  <div className="timeline-head">
                    <h4>{job.company}</h4>
                    <span className="period-pill">{job.period}</span>
                  </div>
                  <p className="role">{job.role}</p>
                  <p className="job-highlight">◆ {job.highlight}</p>
                  <ul>
                    {job.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </motion.article>
              ))}
            </div>
          </motion.section>

          <motion.section className="section case-study section--premium" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} transition={{ staggerChildren: 0.08 }}>
            <motion.div variants={fadeUp}>
              <SectionTitle icon={Puzzle} title={data.labels.featuredCaseStudy} motionType="pop" />
            </motion.div>
            <motion.article variants={fadeUp} className="card card--elevated">
              <h4>{data.caseStudy.title}</h4>
              <p className="stack">{data.caseStudy.subtitle}</p>
              <div className="case-study-grid">
                <div>
                  <p className="case-study-head">Architecture</p>
                  <ul>
                    {data.caseStudy.architecture.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="case-study-head">Business Impact</p>
                  <ul>
                    {data.caseStudy.impact.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mini-arch-diagram">
                <div className="mini-arch-node">UI Layer</div>
                <div className="mini-arch-link" />
                <div className="mini-arch-node">State Layer</div>
                <div className="mini-arch-link" />
                <div className="mini-arch-node">API/Auth Layer</div>
                <div className="mini-arch-link" />
                <div className="mini-arch-node">AWS Deploy</div>
              </div>
            </motion.article>
          </motion.section>

          <motion.section id="projects" className="section section--premium" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} transition={{ staggerChildren: 0.1, delayChildren: 0.07 }}>
            <motion.div variants={fadeUp}>
              <SectionTitle icon={Rocket} title="Major Projects" motionType="spin-in" />
            </motion.div>
            <div className="grid projects">
              {data.projects.map((project) => (
                <motion.article key={project.name} variants={fadeUp} className="card project-card card--elevated">
                  <h4>{project.name}</h4>
                  <p className="stack">{project.stack}</p>
                  <p><strong>Problem:</strong> {project.problem}</p>
                  <p><strong>Solution:</strong> {project.solution}</p>
                  <p><strong>Impact:</strong> {project.impact}</p>
                </motion.article>
              ))}
            </div>
          </motion.section>

          <motion.section className="section" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} transition={{ staggerChildren: 0.08, delayChildren: 0.06 }}>
            <motion.div variants={fadeUp}>
              <SectionTitle icon={Globe2} title="Additional Portfolio Projects" motionType="drift" />
            </motion.div>
            <motion.div variants={fadeUp} className="links-grid card">
              {data.additionalLinks.map((link) => (
                <a key={link} href={link} target="_blank" rel="noreferrer">
                  {link.replace("https://", "")}
                </a>
              ))}
            </motion.div>
          </motion.section>

          <motion.section className="section section--two-col" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} transition={{ staggerChildren: 0.11, delayChildren: 0.06 }}>
            <motion.article variants={fadeUp} className="card">
              <SectionTitle icon={GraduationCap} title="Education" motionType="rise" />
              {data.education.map((edu) => (
                <div key={edu.qualification} className="edu-row">
                  <p><strong>{edu.qualification}</strong></p>
                  <p>{edu.institution}</p>
                  <p>{edu.result}</p>
                </div>
              ))}
            </motion.article>
            <motion.article variants={fadeUp} className="card">
              <SectionTitle icon={UserCircle2} title="Personal Profile" motionType="tilt" />
              <p>{data.profile}</p>
              <p>Email: {data.hero.email}</p>
              <p>Phone: {data.hero.phone}</p>
              <p>
                LinkedIn:{" "}
                <a href={data.hero.linkedin} target="_blank" rel="noreferrer">
                  hareesh-vudari-43b3a0113
                </a>
              </p>
            </motion.article>
          </motion.section>

          <motion.section id="contact" className="section section--final-cta section--premium" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} transition={{ staggerChildren: 0.12, delayChildren: 0.05 }}>
            <motion.article variants={fadeUp} className="card final-cta-card card--elevated">
              <p className="eyebrow">
                <motion.span
                  animate={{ rotate: [0, 10, -6, 0], scale: [1, 1.06, 1] }}
                  transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 2.2 }}
                >
                  <Sparkles size={14} />
                </motion.span>{" "}
                Open to Angular / React Opportunities
              </p>
              <h3>Looking for a Senior UI Engineer who can own delivery end-to-end?</h3>
              <p>
                From architecture decisions to production rollout, I help product teams launch Angular and React
                experiences that are fast, reliable, and ready for global scale.
              </p>
              <div className="hero-actions">
                <motion.a
                  href={data.hero.ctas[0]?.href}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn--primary"
                  onClick={() => handleCtaClick("Hire Me on WhatsApp", "final")}
                  whileHover={{ y: -3, scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.span whileHover={{ rotate: 10, scale: 1.1 }} transition={{ duration: 0.2 }}>
                    <MessageCircle size={15} />
                  </motion.span>{" "}
                  Hire Me on WhatsApp
                </motion.a>
                <motion.a
                  href={`mailto:${data.hero.email}`}
                  className="btn btn--ghost"
                  whileHover={{ y: -3, scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.span whileHover={{ x: 2, y: -1, scale: 1.08 }} transition={{ duration: 0.2 }}>
                    <SendHorizontal size={15} />
                  </motion.span>{" "}
                  Email Directly
                </motion.a>
              </div>
            </motion.article>
          </motion.section>
        </main>
        <motion.a
          href={data.hero.ctas[0]?.href}
          target="_blank"
          rel="noreferrer"
          className="floating-hire-chip"
          onClick={() => handleCtaClick("Hire Me on WhatsApp", "floating")}
          initial={{ opacity: 0, y: 18 }}
          animate={showHireChip ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
          transition={{ duration: 0.25 }}
        >
          <motion.span whileHover={{ rotate: 8, scale: 1.08 }} transition={{ duration: 0.2 }}>
            <MessageCircle size={15} />
          </motion.span>
          <span className="chip-text">Hire Me on WhatsApp</span>
        </motion.a>
      </div>
    </>
  );
}
