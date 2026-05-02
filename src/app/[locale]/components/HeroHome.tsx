"use client";

import {useRef} from "react";
import {useTranslations} from "next-intl";
import {useGsapCore} from "@/app/globals/lib/gsapClient";
import {useIsomorphicLayoutEffect} from "@/app/globals/hooks/useIsomorphicLayoutEffect";
import Link from "next/link";
import AnimatedButton from "@/app/globals/components/buttons/AnimatedButton";

export default function HeroHome() {
  const t = useTranslations("Home");
  const rootRef = useRef<HTMLDivElement | null>(null);
  const {gsap} = useGsapCore();

  useIsomorphicLayoutEffect(() => {
    if (!rootRef.current) return;

    const colTop = rootRef.current.querySelector<HTMLElement>(".col__left");
    const menu = 60;
    const colTopHeight = colTop?.offsetHeight ?? 0;

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

        gsap.from(".hero__description", {
            y: 20,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
            delay: 0.15,
        });

        gsap.to(".hero__video", {
            opacity: 1,
            scale: 1.1,
            y: "8rem",
            ease: "power2.out",
            scrollTrigger: {
              trigger: ".hero__video",
              start: `top ${colTopHeight + menu}`,
              end: "bottom top",
              scrub: true,
            }
        });
    }, rootRef);

    return () => ctx.revert();
  }, [gsap]);

  return (
    <section className="section__hero" ref={rootRef}>
      <div className="column__2">
        <div className="col__left">
          <h1 className="hero__title">{t("heroTitle")}</h1>
          <h2 className="hero__subtitle">{t("heroSubtitle")}</h2>
          <div className="btn__wrapper">
            <AnimatedButton label="Más información" href="/projects" />
            <AnimatedButton label="Ver proyectos" href="/projects" className="btn__gray" />
          </div>
        </div>
        <div className="col__right">
          <p className="hero__description">{t("heroDescription")}</p>
        </div>
      </div>

      <div className="column__1 col__bottom">
        <video
          className="hero__video"
          width={1920}
          height={1080}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
        >
          <source
            src="/home/videos/marker-reel-mobile.mp4"
            type="video/mp4"
            media="(max-width: 1024px)"
          />
          <source
            src="/home/videos/marker-reel-desktop.mp4"
            type="video/mp4"
          />
          Tu navegador no soporta la etiqueta de video.
        </video>
      </div>
    </section>
  );
}