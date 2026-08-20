"use client";

import "./Nav.scss";
import {useState, useEffect, useRef} from "react";
import {useLocale, useTranslations} from "next-intl";
import Link from "next/link";
import {usePathname, useRouter} from "next/navigation";
import Logo from "@/app/globals/components/nav/Logo";
import Svg from "@/app/globals/components/img/Svg";
import Image from "next/image";

type Locale = "es" | "en";

const localeOptions: {
  value: Locale;
  label: string;
  flag: string;
}[] = [
  {
    value: "es",
    label: "ES",
    flag: "/icons/flags/mx.svg"
  },
  {
    value: "en",
    label: "EN",
    flag: "/icons/flags/us.svg"
  }
];

export default function Nav() {
  const t = useTranslations("Nav");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

  const lastScrollY = useRef(0);
  const langRef = useRef<HTMLDivElement | null>(null);

  const basePath = `/${locale}`;

  const links = [
    {href: basePath, label: t("home")},
    {href: `${basePath}/projects`, label: t("projects")},
    {href: `${basePath}/services`, label: t("services")},
    {href: `${basePath}/about`, label: t("about")},
    {href: `${basePath}/blog`, label: t("blog")},
    {href: `${basePath}/contact`, label: t("contact")}
  ];

  const currentLocale =
    localeOptions.find((option) => option.value === locale) ??
    localeOptions[0];

  const changeLocale = (newLocale: Locale) => {
    if (newLocale === locale) {
      setIsLangOpen(false);
      return;
    }

    const segments = pathname.split("/");

    /*
     * pathname:
     * /es/projects
     *
     * split:
     * ["", "es", "projects"]
     */
    segments[1] = newLocale;

    const newPath = segments.join("/") || `/${newLocale}`;

    setIsOpen(false);
    setIsLangOpen(false);

    router.push(newPath);
  };

  /*
   * Cerrar dropdown al hacer click fuera.
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        langRef.current &&
        !langRef.current.contains(event.target as Node)
      ) {
        setIsLangOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /*
   * Ocultar nav al bajar / mostrar al subir.
   */
  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      const diff = current - lastScrollY.current;

      if (current < 80) {
        setIsHidden(false);
      } else {
        if (diff > 5) {
          setIsHidden(true);
          setIsLangOpen(false);
        }

        if (diff < -5) {
          setIsHidden(false);
        }
      }

      lastScrollY.current = current;
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`site__header ${
        isHidden ? "site__header--hidden" : ""
      }`}
    >
      <nav>
        {/* LOGO */}
        <div className="nav__brand">
          <Link
            href={basePath}
            className={`nav__logo ${isOpen ? "is-open" : ""}`}
          >
            <Logo />
          </Link>
        </div>

        {/* DESKTOP MENU */}
        <ul className="nav__menu nav__menu--desktop">
          {links.map((link) => {
            /*
             * Para projects, services, blog, etc.
             * también consideramos activa una ruta interna.
             *
             * Ej:
             * /es/projects/suhissa
             * sigue marcando Projects.
             */
            const isActive =
              link.href === basePath
                ? pathname === basePath
                : pathname === link.href ||
                  pathname.startsWith(`${link.href}/`);

            return (
              <li
                key={link.href}
                className={isActive ? "is-active" : ""}
              >
                <Link href={link.href}>
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* LANG + CTA */}
        <div className="nav__lang__wrapper">
          <div
            className={`nav__lang-dropdown ${
              isLangOpen ? "is-open" : ""
            }`}
            ref={langRef}
          >
            {/* SELECTOR VISIBLE */}
            <button
              type="button"
              className="nav__lang-current"
              onClick={() => setIsLangOpen((prev) => !prev)}
              aria-haspopup="listbox"
              aria-expanded={isLangOpen}
              aria-label="Cambiar idioma"
            >
              <span className="nav__lang-flag">
                <Image
                  src={currentLocale.flag}
                  alt=""
                  width={20}
                  height={20}
                />
              </span>

              <span className="nav__lang-label">
                {currentLocale.label}
              </span>

              <span className="nav__lang-chevron" />
            </button>

            {/* DROPDOWN */}
            <div
              className="nav__lang-options"
              role="listbox"
              aria-hidden={!isLangOpen}
            >
              {localeOptions
                .filter(
                  (option) => option.value !== locale
                )
                .map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    role="option"
                    aria-selected={false}
                    className="nav__lang-option"
                    onClick={() =>
                      changeLocale(option.value)
                    }
                  >
                    <span className="nav__lang-flag">
                      <Image
                        src={option.flag}
                        alt=""
                        width={20}
                        height={20}
                      />
                    </span>

                    <span className="nav__lang-label">
                      {option.label}
                    </span>
                  </button>
                ))}
            </div>
          </div>

          <Link
            href={`${basePath}/quote`}
            className="nav__cta nav__cta--desktop"
          >
            {t("quote")}
            <Svg variant="ArrowClassic" />
          </Link>
        </div>

        {/* MOBILE TOGGLE */}
        <button
          type="button"
          className={`nav__toggle ${
            isOpen ? "is-open" : ""
          }`}
          onClick={() =>
            setIsOpen((prev) => !prev)
          }
          aria-label="Abrir menú"
        >
          <span />
          <span />
          <span />
        </button>

        {/* MOBILE MENU */}
        <div
          className={`nav__menu-mobile ${
            isOpen ? "is-open" : ""
          }`}
        >
          <ul>
            {links.map((link) => {
              const isActive =
                link.href === basePath
                  ? pathname === basePath
                  : pathname === link.href ||
                    pathname.startsWith(`${link.href}/`);

              return (
                <li
                  key={link.href}
                  className={
                    isActive ? "is-active" : ""
                  }
                >
                  <Link
                    href={link.href}
                    onClick={() =>
                      setIsOpen(false)
                    }
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* LANG MOBILE */}
          <div className="nav__mobile-footer">
            <div className="nav__lang-dropdown nav__lang-dropdown--mobile">
              <button
                type="button"
                className="nav__lang-current"
                onClick={() =>
                  setIsLangOpen((prev) => !prev)
                }
              >
                <span className="nav__lang-flag">
                  <Image
                    src={currentLocale.flag}
                    alt=""
                    width={20}
                    height={20}
                  />
                </span>

                <span className="nav__lang-label">
                  {currentLocale.label}
                </span>

                <span className="nav__lang-chevron" />
              </button>

              <div className="nav__lang-options">
                {localeOptions
                  .filter(
                    (option) =>
                      option.value !== locale
                  )
                  .map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className="nav__lang-option"
                      onClick={() =>
                        changeLocale(option.value)
                      }
                    >
                      <span className="nav__lang-flag">
                        <Image
                          src={option.flag}
                          alt=""
                          width={20}
                          height={20}
                        />
                      </span>

                      <span className="nav__lang-label">
                        {option.label}
                      </span>
                    </button>
                  ))}
              </div>
            </div>

            <Link
              href={`${basePath}/quote`}
              className="nav__cta nav__cta--mobile"
              onClick={() => setIsOpen(false)}
            >
              {t("quote")}
              <Svg variant="ArrowClassic" />
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}