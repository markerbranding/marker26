// src/app/[locale]/projects/page.tsx
import { getTranslations } from "next-intl/server";
import { projects } from "@/app/globals/data/projects.data";
import PageBackgroundSetter from "@/app/globals/components/background/PageBackgroundSetter";
import "./page.css";
import HeroProjects from "./components/HeroProjects";
import ProjectsFilterGrid, {
  type ProjectCardWithMeta,
} from "@/app/globals/components/filter/ProjectsFilterGrid";
import PreFooter from "@/app/globals/components/footer/PreFooter";

type PageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function ProjectsPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Projects" });

  const cardProjects: ProjectCardWithMeta[] = projects.map((project) => {
    const data = t.raw(project.slug) as {
      category: string;
      sector: string;
      client: string;
      cardDescription: string;
    };

    return {
      slug: project.slug,
      categoryKey: project.categoryKey,
      sectorKey: project.sectorKey,
      createdAt: project.createdAt,
      category: data.category,
      sector: data.sector,
      client: data.client,
      cardDescription: data.cardDescription,
      thumbnail: project.thumbnail,
      featuredInGrid: project.featuredInGrid,
    };
  });

  // Categorías únicas
  const categoriesMap = new Map<string, string>();
  cardProjects.forEach((p) => {
    if (!categoriesMap.has(p.categoryKey)) {
      categoriesMap.set(p.categoryKey, p.category);
    }
  });
  const categories = Array.from(categoriesMap.entries()).map(
    ([key, label]) => ({
      key,
      label,
    })
  );

  // Sectores únicos
  const sectorsMap = new Map<string, string>();
  cardProjects.forEach((p) => {
    if (!sectorsMap.has(p.sectorKey)) {
      sectorsMap.set(p.sectorKey, p.sector);
    }
  });
  const sectors = Array.from(sectorsMap.entries()).map(([key, label]) => ({
    key,
    label,
  }));

  return (
    <main id="Projects">
      <PageBackgroundSetter color="#f0f0f0" navMode="light" />
      <HeroProjects />

      <ProjectsFilterGrid
        projects={cardProjects}
        categories={categories}
        sectors={sectors}
      />
      <PreFooter />
    </main>
  );
}