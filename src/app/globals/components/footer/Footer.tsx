// src/app/globals/components/footer/Footer.tsx
"use client";

import Link from "next/link";
import {useLocale, useTranslations} from "next-intl";
import "./Footer.css";
import LogoMarker from "@/app/globals/components/nav/Logo"

export default function Footer() {
  const locale = useLocale();
  const t = useTranslations("Footer"); // Puedes crear este namespace en tus messages

  const basePath = `/${locale}`;

  return (
    <footer className="footer">
      <div className="footer__inner">
        {/* Columna 1: Marca / mini bio */}
        <div className="footer__col footer__col--brand">
          <LogoMarker />
          <p className="footer__tagline">
            {t("tagline", {
              defaultValue:
                "Branding, marketing & web studio based in Mérida, México."
            })}
          </p>
        </div>

        {/* Columna 2: Navegación rápida */}
        <div className="footer__col">
          <h4 className="footer__title">
            {t("navigationTitle", {defaultValue: "Navigation"})}
          </h4>
          <ul className="footer__list" role="list">
            <li>
              <Link href={basePath}>{t("linkHome", {defaultValue: "Home"})}</Link>
            </li>
            <li>
              <Link href={`${basePath}/projects`}>
                {t("linkProjects", {defaultValue: "Projects"})}
              </Link>
            </li>
            <li>
              <Link href={`${basePath}/about`}>
                {t("linkAbout", {defaultValue: "About"})}
              </Link>
            </li>
            <li>
              <Link href={`${basePath}/contact`}>
                {t("linkContact", {defaultValue: "Contact"})}
              </Link>
            </li>
          </ul>
        </div>

        {/* Columna 3: Contacto / redes */}
        <div className="footer__col">
          <h4 className="footer__title">
            {t("contactTitle", {defaultValue: "Contact"})}
          </h4>
          <ul className="footer__list" role="list">
            <li>
              <a href="mailto:hola@marker.studio">hola@marker.studio</a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noreferrer"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href="https://www.behance.net/"
                target="_blank"
                rel="noreferrer"
              >
                Behance
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Franja inferior */}
      <div className="footer__bottom">
        <p className="footer__copy">
          © {new Date().getFullYear()} Marker. {t("rights", {defaultValue: "All rights reserved."})}
        </p>

        <div className="footer__legal">
          <Link href={`${basePath}/legal/privacy`}>
            {t("privacy", {defaultValue: "Privacy Policy"})}
          </Link>
          <span>·</span>
          <Link href={`${basePath}/legal/terms`}>
            {t("terms", {defaultValue: "Terms & Conditions"})}
          </Link>
        </div>
      </div>
    </footer>
  );
}