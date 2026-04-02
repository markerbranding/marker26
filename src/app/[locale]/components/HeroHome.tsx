"use client";

import {useRef} from "react";
import {useTranslations} from "next-intl";
import {useGsapCore} from "@/app/globals/lib/gsapClient";
import {useIsomorphicLayoutEffect} from "@/app/globals/hooks/useIsomorphicLayoutEffect";

export default function HeroHome() {
  const t = useTranslations("Home");
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

        gsap.to(".hero__video", {
            opacity: 1,
            scale: 1.05,
            y: "8rem",
            ease: "power2.out",
            scrollTrigger: {
              trigger: ".hero__video",
              start: "top top",
              end: "bottom top",
              scrub: true,
            }
        });
    }, rootRef);

    return () => ctx.revert();
  }, [gsap]);

  return (
    <section className="section__hero" ref={rootRef}>
      <div className="column__1 col__top">
        <h1>{t("heroTitle")}</h1>
        <h2>{t("heroSubtitle")}</h2>
        <p>{t("heroDescription")}</p>
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
          <source src="/videos/marker_reel.mp4" type="video/mp4" />
          Tu navegador no soporta la etiqueta de video.
        </video>
      </div>
    </section>
  );
}