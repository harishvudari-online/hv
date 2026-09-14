import Link from "next/link";
import { splitRichText } from "@/lib/blog";

type BlogRichTextProps = {
  text: string;
};

export function BlogRichText({ text }: BlogRichTextProps) {
  return (
    <>
      {splitRichText(text).map((part, index) => {
        if (part.type === "text") {
          return <span key={`${part.value}-${index}`}>{part.value}</span>;
        }
        if (part.href.startsWith("/")) {
          return (
            <Link key={`${part.href}-${index}`} href={part.href}>
              {part.label}
            </Link>
          );
        }
        return (
          <a key={`${part.href}-${index}`} href={part.href} target="_blank" rel="noreferrer">
            {part.label}
          </a>
        );
      })}
    </>
  );
}
