// src/app/[locale]/page.tsx (o donde esté tu Home)
import "./page.css";
import PageBackgroundSetter from "@/app/globals/components/background/PageBackgroundSetter";
import { getTranslations, setRequestLocale } from "next-intl/server";
import HeroHome from "./components/HeroHome";
import PreFooter from "@/app/globals/components/footer/PreFooter";
import ScrollVideo from "../globals/components/spline/ScrollVideo";
import IntroHome from "./components/IntroHome";

import ProjectCard from "@/app/globals/components/cards/ProjectCard";
import { projects } from "@/app/globals/data/projects.data";
import TestimonialsSlider from "../globals/components/testimonial/TestimonialsSlider";
import ClientsHome from "./components/ClientsHome";

import RecentProjectsHomeServer from "./components/RecentProjectsHome.server";
import RecentProjectsHomeClient from "./components/RecentProjectsHome.client";
import HorizontalScroll from "@/app/globals/components/layout/HorizontalScroll";
import { homeHorizontalScroll } from "@/app/globals/data/horizontalScroll.data";

export default async function HomePage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Home");
  const tProjects = await getTranslations({ locale, namespace: "Projects" });

  // 1) elegimos 5 destacados (y orden)
  const featured = projects
    .filter((p) => p.featuredInHome)
    .sort((a, b) => (a.homeOrder ?? 999) - (b.homeOrder ?? 999))
    .slice(0, 6);

  // 2) mapeamos al shape del card con traducciones (igual que en /projects)
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
      thumbnail: project.thumbnail
    };
  });

  const homeHorizontalScroll = {
    title: {
      h2: t("recentProjectsTitle"),
    },
    items: featuredCards,
  };

  return (
    <main id="Home">
      
      <PageBackgroundSetter color="#f0f0f0" navMode="light" />

      <HeroHome />
      <IntroHome />
      <ScrollVideo src="/videos/output2.mp4" />


      <HorizontalScroll
        data={homeHorizontalScroll}
        variant="projects"
        className="home__horizontal-projects"
        pinSelector=".section__horizontalScroll"
      />

      {/* 
      <RecentProjectsHomeClient>
        <RecentProjectsHomeServer locale={locale} />
      </RecentProjectsHomeClient>
      */}

      <ClientsHome />
      <TestimonialsSlider />

      <PreFooter />
    </main>
  );
}