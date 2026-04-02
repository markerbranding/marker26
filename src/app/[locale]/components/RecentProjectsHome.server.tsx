// ✅ Server Component (NO "use client")

import ProjectCard from "@/app/globals/components/cards/ProjectCard";
import { projects } from "@/app/globals/data/projects.data";
import { getTranslations } from "next-intl/server";

type Props = {
  locale: string;
};

export default async function RecentProjectsHome({ locale }: Props) {
  const tProjects = await getTranslations({ locale, namespace: "Projects" });

  const featured = projects
    .filter((p) => p.featuredInHome)
    .sort((a, b) => (a.homeOrder ?? 999) - (b.homeOrder ?? 999))
    .slice(0, 6);

  const featuredCards = featured.map((project) => {
    const data = tProjects.raw(project.slug) as {
      category: string;
      sector: string;
      client: string;
      cardDescription: string;
    };

    return {
      slug: project.slug,
      category: data.category,
      client: data.client,
      cardDescription: data.cardDescription,
      thumbnail: project.thumbnail,
    };
  });

  return (
    <div className="recent__projects__grid fadeCards">
      {featuredCards.map((p) => (
        <ProjectCard
          key={p.slug}
          slug={p.slug}
          client={p.client}
          category={p.category}
          cardDescription={p.cardDescription}
          thumbnail={p.thumbnail}
        />
      ))}
    </div>
  );
}