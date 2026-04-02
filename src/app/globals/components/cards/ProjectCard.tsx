// ProjectCard.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import {useLocale} from "next-intl";
import "./project-cards.css";

export type ProjectCardProps = {
  slug: string;
  client: string;
  category: string;
  cardDescription: string;
  thumbnail: string;
  isNew?: boolean; // 👈 opcional, para load more
};

export default function ProjectCard({
  slug,
  client,
  category,
  cardDescription,
  thumbnail,
  isNew
}: ProjectCardProps) {
  const locale = useLocale();
  const href = `/${locale}/projects/${slug}`;

  return (
    <article className={`card card${isNew ? " card--new" : ""}`}>
      <Link href={href} className="project-card__link">
        <div className="project-card__thumb-wrapper">
          <Image
            src={thumbnail}
            alt={client}
            width={990}
            height={900}
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="project-card__thumb"
          />
        </div>

        <div className="project-card__content">
          <span className="project-card__category">{category}</span>
          <h2 className="project-card__title">{client}</h2>
          <p className="project-card__description">{cardDescription}</p>
        </div>
      </Link>
    </article>
  );
}