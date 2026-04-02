"use client";

import { useState, useEffect, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import "./Nav.css";
import Logo from "@/app/globals/components/nav/Logo";

export default function Nav() {
  const t = useTranslations("Nav");
  const locale = useLocale(); // 'es' | 'en'
  const router = useRouter();
  const pathname = usePathname(); // ej. "/es/projects"

  const [isOpen, setIsOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  const lastScrollY = useRef(0);

  const basePath = `/${locale}`;

  const links = [
    { href: basePath, label: t("home") },
    { href: `${basePath}/projects`, label: t("projects") },
    { href: `${basePath}/about`, label: t("about") },
    { href: `${basePath}/contact`, label: t("contact") },
  ];

  const changeLocale = (newLocale: "es" | "en") => {
    if (newLocale === locale) return;

    const segments = pathname.split("/");
    segments[1] = newLocale;

    const newPath = segments.join("/") || "/";
    setIsOpen(false);
    router.push(newPath);
  };

  // 👇 LÓGICA DE MOSTRAR/OCULTAR NAV SEGÚN SCROLL
  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      const diff = current - lastScrollY.current;

      // Siempre visible cerca del top
      if (current < 80) {
        setIsHidden(false);
      } else {
        // Bajando
        if (diff > 5) {
          setIsHidden(true);
        }
        // Subiendo
        if (diff < -5) {
          setIsHidden(false);
        }
      }

      lastScrollY.current = current;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`site__header ${isHidden ? "site__header--hidden" : ""}`}>
      <nav>
        <div className="nav__brand">
          <Link href={basePath} className="nav__logo">
            <Logo />
            {/* <span className="nav__brand-name">Marker</span> */}
          </Link>
        </div>

        <ul className="nav__menu nav__menu--desktop">
          {links.map((link) => (
            <li
              key={link.href}
              className={pathname === link.href ? "is-active" : ""}
            >
              <Link href={link.href}>{link.label}</Link>
            </li>
          ))}
        </ul>

        <div className="nav__lang">
          <button
            type="button"
            className={locale === "es" ? "is-active" : ""}
            onClick={() => changeLocale("es")}
          >
            ES
          </button>
          <span>/</span>
          <button
            type="button"
            className={locale === "en" ? "is-active" : ""}
            onClick={() => changeLocale("en")}
          >
            EN
          </button>
        </div>

        <button
          type="button"
          className={`nav__toggle ${isOpen ? "is-open" : ""}`}
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Abrir menú"
        >
          <span />
          <span />
          <span />
        </button>

        <div className={`nav__menu-mobile ${isOpen ? "is-open" : ""}`}>
          <ul>
            {links.map((link) => (
              <li
                key={link.href}
                className={pathname === link.href ? "is-active" : ""}
              >
                <Link href={link.href} onClick={() => setIsOpen(false)}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="nav__lang nav__lang-switcher--mobile">
            <button
              type="button"
              className={locale === "es" ? "is-active" : ""}
              onClick={() => changeLocale("es")}
            >
              ES
            </button>
            <span>/</span>
            <button
              type="button"
              className={locale === "en" ? "is-active" : ""}
              onClick={() => changeLocale("en")}
            >
              EN
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}