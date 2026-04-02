import Image from "next/image";
import {notFound} from "next/navigation";
import {getTranslations} from "next-intl/server";
import PageBackgroundSetter from "@/app/globals/components/background/PageBackgroundSetter";
import {getAllSlugs, getProjectBySlug} from "@/app/globals/data/projects.data";
import Link from "next/link";
import HeroProjectDetail from "./components/HeroProjectDetail";
import "./page.css";
import PreFooter from "@/app/globals/components/footer/PreFooter";

type PageProps = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

// SSG
export async function generateStaticParams() {
  const slugs = getAllSlugs();
  const locales = ["es", "en"];

  return locales.flatMap((locale) =>
    slugs.map((slug) => ({
      locale,
      slug,
    })),
  );
}

export async function generateMetadata({params}: PageProps) {
  const {locale, slug} = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};

  const t = await getTranslations({
    locale,
    namespace: "Projects",
  });

  const data = t.raw(slug) as any;

  return {
    title: data.metaTitle ?? data.title,
    description: data.metaDescription ?? data.description,
  };
}

export default async function ProjectDetailPage({params}: PageProps) {
  const {locale, slug} = await params;

  const project = getProjectBySlug(slug);
  if (!project) {
    notFound();
  }

  const t = await getTranslations({
    locale,
    namespace: "Projects",
  });

  const data = t.raw(slug) as {
    category: string;
    title: string;
    client: string;
    titleDescription: string;
    description: string;
    sector: string;
    intro?: string;
    challenge: string;
    solution: string;
    weDo: string[];
  };

  const sectionLabel = t("section");
  const titleDescriptionLabel = t("titleDescription");
  const titleWeDoLabel = t("titleWeDo");
  const titleChallengeLabel = t("titleChallenge");
  const titleSolutionLabel = t("titleSolution");

  return (
    <main id="ProjectDetail" className={`cat__${data.category.toLowerCase().replace(/\s+/g, '-')} project__${data.client.toLowerCase().replace(/\s+/g, '-')}`}>
      <PageBackgroundSetter color={project.color} navMode={project.navMode} />

      <HeroProjectDetail
        locale={locale}
        projectColor2={project.color2}
        cover={project.cover}
        data={{
          category: data.category,
          title: data.title,
          client: data.client,
          description: data.description,
          sector: data.sector,
        }}
        labels={{
          section: sectionLabel,
          titleDescription: titleDescriptionLabel,
        }}
      />

      <section className="section__intro fadeInOut">
        <div className="column__2">
          <div className="col__left">
            <h3 style={{color: project.color2}}>{titleWeDoLabel}</h3>
            <ul role="list">
              {data.weDo.map((item, index) => (
                <li key={index} className="project__gallery-item">
                    {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="col__right">
            <h3 style={{color: project.color2}}>{titleChallengeLabel}</h3>
            <p>{data.challenge}</p>
          </div>
        </div>
        <div className="column__1">
          <Image
            src={project.introImage}
            alt={data.title}
            width={1920}
            height={1080}
            priority
            sizes="(min-width: 1024px) 100vw, 100vw"
          />
        </div>
      </section>

      <section className="section__solution fadeInOut">
        <div className="column__2">
            <div className="col__left">
              <h3 style={{color: project.color2}}>{titleWeDoLabel}</h3>
              <ul role="list">
                {data.weDo.map((item, index) => (
                  <li key={index} className="project__gallery-item">
                      {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="col__right">
              <h3 style={{color: project.color2}}>{titleSolutionLabel}</h3>
              <p>{data.solution}</p>
            </div>
          </div>
      </section>
 
      <section className="section__gallery">
        <ul role="list" className="fadeInOut">
        {project.gallery.map((image, index) => (
            <li key={index}>
              <Image
              src={image}
              alt={`${data.title} – ${index + 1}`}
              placeholder="blur"
              sizes="(min-width: 1024px) 70vw, 100vw"
              />
            </li>
        ))}
        </ul>
      </section>
      <PreFooter />
    </main>
  );
}