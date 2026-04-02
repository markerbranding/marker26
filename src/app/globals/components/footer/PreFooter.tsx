// src/app/globals/components/footer/Footer.tsx
"use client";

import Link from "next/link";
import {useLocale, useTranslations} from "next-intl";
import "./Footer.css";
import HubspotForm from "../forms/HubspotForm";

export default function PreFooter() {
  const locale = useLocale();
  const t = useTranslations("PreFooter"); // Puedes crear este namespace en tus messages

  const basePath = `/${locale}`;

  return (
    <section className="section__prefooter">
      <div className="column__2">
        <div className="col__left">
          <h2>{t("title")}</h2>
        </div>
        <div className="col__right">
          <HubspotForm
          className="contact-form"
          />
        </div>
      </div>
    </section>
  );
}