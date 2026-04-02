"use client";
import React from "react";
import { gsap } from "gsap"; 
import { useGsapCore } from "@/app/globals/lib/gsapClient";

type MaybeRef<T> = React.RefObject<T | null> | null;

export const useAnimatePinScroll = (
  wrapperRef: MaybeRef<HTMLElement>,
  leftRef: MaybeRef<HTMLDivElement>,
  pinRef: MaybeRef<HTMLDivElement>
) => {
  const { gsap, ScrollTrigger } = useGsapCore();

  React.useLayoutEffect(() => {
    const wrapper = wrapperRef?.current;
    const left = leftRef?.current;
    const pin = pinRef?.current;

    if (!wrapper || !left || !pin) return;

    // ✅ rafs en el scope del effect (así TS los conoce)
    let raf1: number | null = null;
    let raf2: number | null = null;

    const refreshSoon = () => {
      if (raf1) cancelAnimationFrame(raf1);
      if (raf2) cancelAnimationFrame(raf2);

      raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => {
          ScrollTrigger.refresh();
        });
      });
    };

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        const items = Array.from(left.querySelectorAll<HTMLElement>(".pin__item"));
        const imgs = Array.from(pin.querySelectorAll<HTMLImageElement>(".pin__img__card img"));

        if (!items.length || !imgs.length) return;

        // Estado inicial imágenes
        gsap.set(pin, { willChange: "transform" });
        gsap.set(imgs, { opacity: 0, position: "absolute", inset: 0 });
        gsap.set(imgs[0], { opacity: 1 });

        const getEndDistance = () => {
          const leftH = left.scrollHeight;
          const pinH = pin.offsetHeight;
          return Math.max(0, leftH - pinH);
        };

        const showIndex = (i: number) => {
          imgs.forEach((img, idx) => {
            gsap.to(img, {
              opacity: idx === i ? 1 : 0,
              duration: 0.45,
              ease: "power2.out",
              overwrite: true,
            });
          });
        };

        const onRefreshInit = () => {
          gsap.set(imgs, { opacity: 0 });
          gsap.set(imgs[0], { opacity: 1 });
        };
        ScrollTrigger.addEventListener("refreshInit", onRefreshInit);

        const pinST = ScrollTrigger.create({
          trigger: wrapper,
          pin: pin,
          start: "top top",
          end: () => `+=${getEndDistance()}`,
          pinSpacing: true,
          anticipatePin: 0,
          fastScrollEnd: true,
          invalidateOnRefresh: true,
          //markers: true,
        });

        const itemTriggers = items.map((item, i) =>
          ScrollTrigger.create({
            trigger: item,
            start: "top center",
            end: "bottom center",
            onEnter: () => showIndex(i),
            onEnterBack: () => showIndex(i),
            invalidateOnRefresh: true,
          })
        );

        // Observers / listeners
        const ro = new ResizeObserver(() => refreshSoon());
        ro.observe(wrapper);
        ro.observe(left);
        ro.observe(pin);

        const onResize = () => refreshSoon();
        window.addEventListener("resize", onResize);

        const allImgs = [
          ...Array.from(left.querySelectorAll("img")),
          ...imgs,
        ] as HTMLImageElement[];

        const onImgLoad = () => refreshSoon();
        allImgs.forEach((img) => {
          img.addEventListener("load", onImgLoad);
          img.addEventListener("error", onImgLoad);
        });

        // primer refresh
        refreshSoon();

        return () => {
          ScrollTrigger.removeEventListener("refreshInit", onRefreshInit);

          window.removeEventListener("resize", onResize);
          ro.disconnect();

          allImgs.forEach((img) => {
            img.removeEventListener("load", onImgLoad);
            img.removeEventListener("error", onImgLoad);
          });

          itemTriggers.forEach((st) => st.kill(true));
          pinST.kill(true);
        };
      });

      mm.add("(max-width: 1023px)", () => {
        const imgs = pin.querySelectorAll<HTMLElement>(".pin__img");
        gsap.set(imgs, { clearProps: "all" });
        refreshSoon();
        return () => {};
      });

      return () => mm.revert();
    }, wrapper);

    return () => {
      if (raf1) cancelAnimationFrame(raf1);
      if (raf2) cancelAnimationFrame(raf2);
      ctx.revert();
    };
  }, [gsap, ScrollTrigger, wrapperRef, leftRef, pinRef]);
};

///////////////////////////////////////////////////////////////

export const useAnimateHorizontalScroll = (
  wrapper: React.RefObject<HTMLElement> | null,
  racer: React.RefObject<HTMLUListElement> | null,
  pinRef?: React.RefObject<HTMLElement> | null
) => {
  const { gsap, ScrollTrigger } = useGsapCore();

  React.useLayoutEffect(() => {
    if (!wrapper?.current || !racer?.current) return;

    const section = wrapper.current;
    const ul = racer.current;
    const pinEl = pinRef?.current ?? section; // fallback

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
            //markers: true,
          },
        });

        // ✅ 1) Refresh cuando esté por entrar al viewport
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

        // ✅ 2) Refresh diferidos al montar (CLS/Next/Image/fonts)
        refreshSoon();
        const t1 = window.setTimeout(refreshSoon, 150);
        const t2 = window.setTimeout(refreshSoon, 450);

        // ✅ ResizeObserver para cambios reales de tamaño
        const ro = new ResizeObserver(() => refreshSoon());
        ro.observe(ul);
        ro.observe(pinEl);

        // ✅ window resize
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