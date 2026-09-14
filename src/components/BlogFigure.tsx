import Image from "next/image";
import type { BlogImage } from "@/data/blog";

type BlogFigureProps = {
  image: BlogImage;
  priority?: boolean;
};

export function BlogFigure({ image, priority = false }: BlogFigureProps) {
  return (
    <figure className="blog-figure">
      <Image src={image.src} alt={image.alt} width={1200} height={630} priority={priority} />
      {image.caption ? <figcaption>{image.caption}</figcaption> : null}
    </figure>
  );
}
