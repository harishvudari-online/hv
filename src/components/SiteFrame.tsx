import type { ReactNode } from "react";

type SiteFrameProps = {
  theme: "dark" | "light";
  children: ReactNode;
};

export function SiteFrame({ theme, children }: SiteFrameProps) {
  return (
    <div className={`page page--${theme}`}>
      <div className="bg-mesh" />
      <div className="bg-noise" />
      <div className="bg-glow bg-glow--one" />
      <div className="bg-glow bg-glow--two" />
      {children}
    </div>
  );
}
