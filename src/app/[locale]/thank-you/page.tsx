import {getTranslations} from "next-intl/server";
import Link from "next/link";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function ThankYouPage({params}: PageProps) {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: "ContactThankYou"});

  return (
    <main id="ThankYou" style={{minHeight: "80vh", padding: "6rem 5vw"}}>
      <h1>{t("title")}</h1>
      <p>{t("message")}</p>

      <Link href={`/${locale}/`}>
        {t("backHome")}
      </Link>
    </main>
  );
}