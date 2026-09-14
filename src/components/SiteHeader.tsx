import type { ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Briefcase,
  Home as HomeIcon,
  Mail,
  Moon,
  Newspaper,
  Rocket,
  Sun,
  Wrench
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const navItems: { id: string; label: string; icon: LucideIcon }[] = [
  { id: "home", label: "Home", icon: HomeIcon },
  { id: "skills", label: "Skills", icon: Wrench },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "projects", label: "Projects", icon: Rocket },
  { id: "blog", label: "Blog", icon: Newspaper },
  { id: "contact", label: "Contact", icon: Mail }
];

type SiteHeaderProps = {
  activeId: string;
  labels: Record<string, string>;
  isScrolled?: boolean;
  variant: "home" | "inner";
  children?: ReactNode;
};

function navHref(id: string, variant: "home" | "inner"): string {
  if (variant === "home") {
    return `#${id}`;
  }
  if (id === "blog") {
    return "/blog";
  }
  if (id === "home") {
    return "/";
  }
  return `/#${id}`;
}

export function SiteHeader({ activeId, labels, isScrolled = false, variant, children }: SiteHeaderProps) {
  return (
    <header className={`topbar container ${isScrolled ? "topbar--scrolled" : ""}`}>
      <Link href="/" className="brand">
        harishvudari.online
      </Link>
      <nav className="nav-pills">
        {navItems.map((item) => {
          const href = navHref(item.id, variant);
          const isActive = activeId === item.id;
          const className = isActive ? "is-active" : "";
          const content = (
            <>
              {isActive ? (
                <motion.span
                  layoutId="nav-active-indicator"
                  className="nav-active-indicator"
                  transition={{ type: "spring", stiffness: 320, damping: 26 }}
                />
              ) : null}
              <item.icon size={14} />
              <span className="nav-text">{labels[item.id] ?? item.label}</span>
            </>
          );

          if (href.startsWith("#")) {
            return (
              <a key={item.id} href={href} className={className}>
                {content}
              </a>
            );
          }

          return (
            <Link key={item.id} href={href} className={className}>
              {content}
            </Link>
          );
        })}
      </nav>
      <div className="topbar-tools">{children}</div>
    </header>
  );
}

export function ThemeToggle({
  theme,
  onToggle
}: {
  theme: "dark" | "light";
  onToggle: () => void;
}) {
  return (
    <button
      className="theme-btn theme-btn--icon"
      onClick={onToggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
