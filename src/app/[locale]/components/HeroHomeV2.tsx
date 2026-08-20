"use client";

import {useRef} from "react";
import {useTranslations} from "next-intl";
import AnimatedButton from "@/app/globals/components/buttons/AnimatedButton";
import {useGsapCore} from "@/app/globals/lib/gsapClient";
import {useIsomorphicLayoutEffect} from "@/app/globals/hooks/useIsomorphicLayoutEffect";

import "./HeroHomeV2.scss";

export default function HeroHomeV2() {
  const t = useTranslations("Home");

  const rootRef = useRef<HTMLElement | null>(null);
  const videoFrameRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLDivElement | null>(null);
  const descriptionRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const {gsap, ScrollTrigger} = useGsapCore();

  useIsomorphicLayoutEffect(() => {
    if (!rootRef.current) return;
    if (!videoFrameRef.current) return;
    if (!titleRef.current) return;
    if (!descriptionRef.current) return;
    if (!videoRef.current) return;
    if (!gsap || !ScrollTrigger) return;

    const root = rootRef.current;
    const videoFrame = videoFrameRef.current;
    const title = titleRef.current;
    const description = descriptionRef.current;

    const ctx = gsap.context(() => {
      /*
       * ==============================
       * ENTRADA INICIAL
       * ==============================
       */

      const intro = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      intro
        .from(".hero-v2__eyebrow", {
          opacity: 0,
          y: 20,
          duration: 0.6,
        })
        .from(
          ".hero-v2__title",
          {
            opacity: 0,
            y: 35,
            duration: 0.9,
          },
          "-=0.35"
        )
        .from(
          ".hero-v2__buttons",
          {
            opacity: 0,
            y: 20,
            duration: 0.7,
          },
          "-=0.5"
        )
        .from(
          description,
          {
            opacity: 0,
            y: 25,
            duration: 0.8,
          },
          "-=0.45"
        )
        .from(
          videoFrame,
          {
            opacity: 0,
            scale: 0.92,
            duration: 1.1,
          },
          "-=0.75"
        );

      /*
       * ==============================
       * SCROLL PRINCIPAL
       * ==============================
       *
       * El frame empieza en la mitad
       * derecha y termina ocupando todo
       * el viewport disponible.
       */

      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          invalidateOnRefresh: true,
          // markers: true,
        },
      });

      scrollTl.to(
        videoFrame,
        {
          width: "100%",
          height: "100svh",
          ease: "none",
          duration: 1,
        },
        0
      );

      scrollTl.to(
        description,
        {
          opacity: 0,
          filter: "blur(5px)",
          //y: -15,
          x: -200,
          ease: "none",
          duration: 0.3,
        },
        0.05
      );

      scrollTl.to(
        title,
        {
          opacity: 0,
          filter: "blur(5px)",
          y: -150,
          x: -20,
          ease: "none",
          duration: 0.3,
        },
        0.05
      );

      /*
       * Pequeño zoom interior opcional.
       *
       * El frame crece y el video también
       * gana algo de presencia.
       */

      scrollTl.to(
        videoRef.current,
        {
          scale: 1,
          ease: "none",
          duration: 1,
        },
        0
      );

      /*
       * Refresh estable al cambiar viewport.
       */

      let resizeRAF = 0;

      const handleResize = () => {
        cancelAnimationFrame(resizeRAF);

        resizeRAF = requestAnimationFrame(() => {
          ScrollTrigger.refresh();
        });
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        cancelAnimationFrame(resizeRAF);
      };
    }, root);

    return () => ctx.revert();
  }, [gsap, ScrollTrigger]);

  return (
    <section className="section__hero-v2" ref={rootRef}>
      {/* =========================
          CONTENIDO
      ========================== */}

      <div className="hero-v2__content">
        <div className="column__2 hero-v2__main" ref={titleRef}>
          <div className="col__left">
            <div className="hero-v2__copy">
              <h1 className="hero-v2__eyebrow">
                {t("heroTitle")}
              </h1>

              <h2 className="hero-v2__title">
                {t("heroSubtitle")}
              </h2>

              <div className="hero-v2__buttons">
                <AnimatedButton
                  label={t("heroPrimaryCta")}
                  href="/projects"
                />

                <AnimatedButton
                  label={t("heroSecondaryCta")}
                  href="/projects"
                  className="btn__gray"
                />
              </div>
            </div>
          </div>

          {/* Reserva visual donde nace el video */}
          <div className="col__right" />
        </div>

        <div
          className="column__2 hero-v2__description-row"
          ref={descriptionRef}
        >
          <div className="col__left">
            <p className="hero-v2__description">
              {t("heroDescription")}
            </p>
          </div>

          <div className="col__right" />
        </div>
      </div>

      {/* =========================
          VIDEO STICKY
      ========================== */}

      <div className="hero-v2__media-track">
        <div className="hero-v2__media-sticky">
          <div
            className="hero-v2__video-frame"
            ref={videoFrameRef}
          >
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
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
            </video>
          </div>
        </div>
      </div>
    </section>
  );
}