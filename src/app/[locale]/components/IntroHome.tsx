"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { useGsapCore } from "@/app/globals/lib/gsapClient";
import { useIsomorphicLayoutEffect } from "@/app/globals/hooks/useIsomorphicLayoutEffect";

export default function IntroHome() {
  const t = useTranslations("Home");
  const rootRef = useRef<HTMLDivElement | null>(null);
  const { gsap, SplitText, ScrollTrigger } = useGsapCore();

  useIsomorphicLayoutEffect(() => {
    if (!rootRef.current) return;
    if (!gsap || !SplitText || !ScrollTrigger) return;

    let split: any = null;
    let resizeTimer: number | null = null;

    const build = () => {
      // 1) Limpieza dura (si ya existía)
      if (split) {
        split.revert();
        split = null;
      }

      // Mata SOLO triggers dentro de este root (evita romper otros)
      ScrollTrigger.getAll().forEach((st) => {
        const triggerEl = st.trigger as Element | null;
        if (triggerEl && rootRef.current?.contains(triggerEl)) {
          st.kill(true);
        }
      });

      // 2) Split otra vez (con el layout ya actualizado)
      split = SplitText.create(rootRef.current!.querySelector(".split"), {
        type: "lines",
        mask: "lines",
        autoSplit: true,
      });

      // Estado inicial (la “máscara” funciona mejor con yPercent)
      gsap.set(split.lines, { yPercent: 100, autoAlpha: 1 });

      // 3) Un trigger por línea (como lo tienes)
      split.lines.forEach((line: HTMLElement) => {
        gsap.to(line, {
          yPercent: 0,
          ease: "power3.out",
          scrollTrigger: {
            trigger: line,
            start: "top 90%",
            end: "top 65%",
            scrub: true,
            invalidateOnRefresh: true,
            // markers: true,
          },
        });
      });

      // 4) Recalcular mediciones
      ScrollTrigger.refresh();
    };

    const ctx = gsap.context(() => {
      build();

      const onResize = () => {
        // debounce
        if (resizeTimer) window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(() => {
          // importante: SplitText depende del layout final
          build();
        }, 150);
      };

      window.addEventListener("resize", onResize);

      return () => {
        window.removeEventListener("resize", onResize);
        if (resizeTimer) window.clearTimeout(resizeTimer);

        // cleanup final
        if (split) split.revert();

        ScrollTrigger.getAll().forEach((st) => {
          const triggerEl = st.trigger as Element | null;
          if (triggerEl && rootRef.current?.contains(triggerEl)) {
            st.kill(true);
          }
        });
      };
    }, rootRef);

    return () => ctx.revert();
  }, [gsap, SplitText, ScrollTrigger]);

  return (
    <section className="section__intro" ref={rootRef}>
      <div className="column__1 fadeInOut">
        <h3 className="prefix">{t("introTitle")}</h3>
      </div>
      <div className="column__1">
        <p className="split">{t("introText")}</p>
      </div>
    </section>
  );
}