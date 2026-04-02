import React from "react";
import { useGsapCore } from "@/app/globals/lib/gsapClient";

export const useAnimateHorizontalScroll = (
  wrapper: React.RefObject<HTMLElement | null>,
  racer: React.RefObject<HTMLUListElement | null>,
  pinRef?: React.RefObject<HTMLElement | null>
) => {
  const { gsap, ScrollTrigger } = useGsapCore();

  React.useLayoutEffect(() => {
    if (!gsap || !ScrollTrigger) return;
    if (!wrapper.current || !racer.current) return;

    const section = wrapper.current;
    const ul = racer.current;
    const pinEl = pinRef?.current ?? section;

    let raf1 = 0;
    let raf2 = 0;

    const refreshSoon = () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => {
          ScrollTrigger.refresh();
        });
      });
    };

    const getScrollDistance = () => Math.max(0, ul.scrollWidth - window.innerWidth);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        gsap.set(ul, { x: 0, willChange: "transform" });

        const onRefreshInit = () => {
          gsap.set(ul, { x: 0 });
        };
        ScrollTrigger.addEventListener("refreshInit", onRefreshInit);

        const tween = gsap.to(ul, {
          x: () => -getScrollDistance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            pin: pinEl,
            start: "top top",
            end: () => `+=${getScrollDistance()}`,
            scrub: 1,
            pinSpacing: true,
            anticipatePin: 0,
            invalidateOnRefresh: true,
          },
        });

        const io = new IntersectionObserver(
          (entries) => {
            if (entries.some((e) => e.isIntersecting)) {
              refreshSoon();
              io.disconnect();
            }
          },
          { root: null, rootMargin: "300px 0px 300px 0px", threshold: 0.01 }
        );
        io.observe(section);

        refreshSoon();
        const t1 = window.setTimeout(refreshSoon, 150);
        const t2 = window.setTimeout(refreshSoon, 450);

        const ro = new ResizeObserver(() => refreshSoon());
        ro.observe(ul);
        ro.observe(pinEl);

        const onResize = () => refreshSoon();
        window.addEventListener("resize", onResize);

        return () => {
          window.clearTimeout(t1);
          window.clearTimeout(t2);
          io.disconnect();
          ro.disconnect();
          window.removeEventListener("resize", onResize);

          ScrollTrigger.removeEventListener("refreshInit", onRefreshInit);
          tween.scrollTrigger?.kill(true);
          tween.kill();
        };
      });

      mm.add("(max-width: 1023px)", () => {
        gsap.set(ul, { clearProps: "transform" });
        refreshSoon();
        return () => {};
      });

      return () => mm.revert();
    }, section);

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      ctx.revert();
    };
  }, [gsap, ScrollTrigger, wrapper, racer, pinRef]);
};