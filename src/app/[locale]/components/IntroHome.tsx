"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { useGsapCore } from "@/app/globals/lib/gsapClient";
import { useIsomorphicLayoutEffect } from "@/app/globals/hooks/useIsomorphicLayoutEffect";
import LogoStrip from "@/app/globals/components/logos/LogoStrip";
import Svg from "@/app/globals/components/img/Svg";

export default function IntroHome() {
  const t = useTranslations("Home");
  const rootRef = useRef<HTMLDivElement | null>(null);
  const { gsap, SplitText, ScrollTrigger } = useGsapCore();

  useIsomorphicLayoutEffect(() => {
    if (!rootRef.current) return;
    if (!gsap || !SplitText || !ScrollTrigger) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1025px)", () => {
        let split: any = null;
        let resizeTimer: number | null = null;

        const killLocalTriggers = () => {
          ScrollTrigger.getAll().forEach((st) => {
            const triggerEl = st.trigger as Element | null;
            if (triggerEl && rootRef.current?.contains(triggerEl)) {
              st.kill(true);
            }
          });
        };

        const build = () => {
          if (split) {
            split.revert();
            split = null;
          }

          killLocalTriggers();

          const el = rootRef.current!.querySelector(".split");
          if (!el) return;

          split = SplitText.create(el, {
            type: "lines",
            mask: "lines",
          });

          gsap.set(split.lines, { yPercent: 100, autoAlpha: 1 });

          split.lines.forEach((line: HTMLElement) => {
            gsap.to(line, {
              yPercent: 0,
              ease: "none",
              scrollTrigger: {
                trigger: line,
                start: "top 90%",
                end: "top 65%",
                scrub: true,
                invalidateOnRefresh: true,
              },
            });
          });

          ScrollTrigger.refresh();

          // Avisa que el layout de este componente está listo
          window.dispatchEvent(new CustomEvent("gsap:component-ready"));

        };

        build();

        const onResize = () => {
          if (resizeTimer) window.clearTimeout(resizeTimer);

          resizeTimer = window.setTimeout(() => {
            build();
          }, 250);
        };

        window.addEventListener("resize", onResize);

        return () => {
          window.removeEventListener("resize", onResize);
          if (resizeTimer) window.clearTimeout(resizeTimer);
          if (split) split.revert();
          killLocalTriggers();
        };
      });

      // Mobile/tablet: texto normal, sin split ni triggers
      mm.add("(max-width: 1024px)", () => {
        const el = rootRef.current?.querySelector(".split");
        if (el) {
          gsap.set(el, { clearProps: "all" });
        }

        return () => {};
      });

      return () => mm.revert();
    }, rootRef);

    return () => ctx.revert();
  }, [gsap, SplitText, ScrollTrigger]);

  return (
    <section className="section__intro" ref={rootRef}>
      <div className="column__1 fadeInOut">
        <h3 className="prefix">{t("introTitle")}</h3>
      </div>

      <div className={`column__1`}>
        <h2 className="split">{t("introH2")}</h2>
      </div>

      <div className="column__1 fadeInOut">
        <p className="split">{t("introP")}</p>
      </div>
      <div className="column__1 logo__strip">
        <h4>Trabajamos con las siguiente tecnologías</h4>
        <LogoStrip
          speed={25}
          logos={[
            <Svg variant="Arrow" />,
            <Svg variant="ArrowClassic" />,
            <Svg variant="Arrow" />,
            <Svg variant="ArrowClassic" />,
            <Svg variant="Arrow" />,
            <Svg variant="ArrowClassic" />,
            <Svg variant="Arrow" />,
            <Svg variant="ArrowClassic" />,
            <Svg variant="Arrow" />,
            <Svg variant="ArrowClassic" />,
            <Svg variant="Arrow" />,
            <Svg variant="ArrowClassic" />,
            <Svg variant="Arrow" />,
            <Svg variant="ArrowClassic" />,
            <Svg variant="Arrow" />,
            <Svg variant="ArrowClassic" />,
            <Svg variant="Arrow" />,
            <Svg variant="ArrowClassic" />,
            <Svg variant="Arrow" />,
            <Svg variant="ArrowClassic" />,
          ]}
        />
      </div>
    </section>
  );
}