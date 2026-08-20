import "./page.scss";
import PageBackgroundSetter from "@/app/globals/components/background/PageBackgroundSetter";
import { getTranslations } from "next-intl/server";
import PreFooter from "@/app/globals/components/footer/PreFooter";

type PageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function AboutPageSection({ params }: PageProps) {

  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "About" });

  return (
    <main id="About">
        <PageBackgroundSetter color="#f0f0f0" navMode="light" />
        <section className="section__hero">
            <div>
              Hola
            </div>
        </section>
        <PreFooter />
    </main>
  );
}