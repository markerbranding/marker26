"use client";

import {useRef} from "react";
import {useTranslations} from "next-intl";
import {useGsapCore} from "@/app/globals/lib/gsapClient";
import {useIsomorphicLayoutEffect} from "@/app/globals/hooks/useIsomorphicLayoutEffect";

export default function HeroProjects() {
    const t = useTranslations("Projects");
    const rootRef = useRef<HTMLDivElement | null>(null);
    const {gsap} = useGsapCore();

  useIsomorphicLayoutEffect(() => {
    if (!rootRef.current) return;

    const ctx = gsap.context(() => {
        gsap.from(".hero__title", {
            y: 40,
            opacity: 0,
            duration: 0.9,
            ease: "power3.out",
        });

        gsap.from(".hero__subtitle", {
            y: 20,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
            delay: 0.15,
        });
    }, rootRef);

    return () => ctx.revert();
  }, [gsap]);

  return (
    <section className="section__hero" ref={rootRef}>
      <div className="column__1 col__top">
        <h1 className="hero__title">{t("heroTitle")}</h1>
        <h2 className="hero__subtitle">{t("heroSubtitle")}</h2>
      </div>
    </section>
  );
}