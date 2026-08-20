"use client";

import {useRef} from "react";
import {useTranslations} from "next-intl";
import {useGsapCore} from "@/app/globals/lib/gsapClient";
import {useIsomorphicLayoutEffect} from "@/app/globals/hooks/useIsomorphicLayoutEffect";
import AnimatedButton from "@/app/globals/components/buttons/AnimatedButton";

export default function HeroHome() {
  const t = useTranslations("Home");
  const rootRef = useRef<HTMLElement | null>(null);

  const {gsap, ScrollTrigger} = useGsapCore();

  useIsomorphicLayoutEffect(() => {
    if (!rootRef.current) return;
    if (!gsap || !ScrollTrigger) return;

    const root = rootRef.current;

    const colTop = root.querySelector<HTMLElement>(".column__2");
    const colLeft = root.querySelector<HTMLElement>(".col__left");
    const colRight = root.querySelector<HTMLElement>(".col__right");
    const video = root.querySelector<HTMLElement>(".hero__video");

    if (!colTop || !colLeft || !colRight || !video) return;

    const menu = 60;

    const ctx = gsap.context(() => {
      /*
       * =============================
       * ENTRADA INICIAL
       * =============================
       */

      const introTl = gsap.timeline({
        defaults: {
          ease: "power3.out"
        }
      });

      introTl
        .from(".hero__title", {
          y: 40,
          opacity: 0,
          duration: 0.9
        })
        .from(
          ".hero__subtitle",
          {
            y: 20,
            opacity: 0,
            duration: 0.8
          },
          "-=0.65"
        )
        .from(
          ".hero__description",
          {
            y: 20,
            opacity: 0,
            duration: 0.8
          },
          "-=0.65"
        )
        .from(
          ".btn__wrapper",
          {
            y: 15,
            opacity: 0,
            duration: 0.7
          },
          "-=0.55"
        )
        .fromTo(
          ".col__bottom",
          {
            opacity: 0,
            scale: 0.8,
            y: 0,
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1.2,
            ease: "power3.out"
          },
          "-=0.5"
        )
        

      /*
       * =============================
       * VIDEO PARALLAX / SCALE
       * =============================
       */

      gsap.fromTo(
        video,
        {
          scale: 1,
          y: 0
        },
        {
          scale: 1.1,
          y: "0rem",
          ease: "none",
          scrollTrigger: {
            trigger: video,
            start: () => {
              const colTopHeight = colTop.offsetHeight;
              return `top ${colTopHeight + menu}`;
            },
            //end: `bottom top`,
            end: () => {
              const colTopHeight = colTop.offsetHeight;
              return `bottom ${colTopHeight + menu}`;
            },
            scrub: true,
            invalidateOnRefresh: true,
          }
        }
      );

      /*
       * =============================
       * FADE DEL CONTENIDO
       * =============================
       *
       * El contenido empieza a desaparecer
       * conforme el video se aproxima/pasa
       * sobre él.
       */

      gsap.to([colLeft, colRight], {
        opacity: 0,
        filter: "blur(5px)",
        y: -50,
        scale: 0.9,
        ease: "none",
        scrollTrigger: {
          trigger: video,
          /*
           * Empieza cuando la parte superior
           * del video se acerca al contenido.
           */
          start: () => {
            const colTopHeight = colTop.offsetHeight;
            return `top ${colTopHeight + menu}`;
          },
          /*
           * Cuando el video ya avanzó sobre
           * el bloque superior, termina el fade.
           */
          end: () => {
            const colTopHeight = colTop.offsetHeight;
            return `top ${menu + colTopHeight * 0.55}`;
          },
          scrub: true,
          invalidateOnRefresh: true,
          // markers: true
        }
      });
      /*
       * Si cambia el tamaño,
       * recalculamos todas las posiciones.
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
    <section className="section__hero" ref={rootRef}>
      <div className="column__2">
        <div className="col__left">
          <h1 className="hero__title">
            {t("heroTitle")}
          </h1>

          <h2 className="hero__subtitle">
            {t("heroSubtitle")}
          </h2>

          <div className="btn__wrapper">
            <AnimatedButton
              label="Más información"
              href="/projects"
            />

            <AnimatedButton
              label="Ver proyectos"
              href="/projects"
              className="btn__gray"
            />
          </div>
        </div>

        <div className="col__right">
          <p className="hero__description">
            {t("heroDescription")}
          </p>
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