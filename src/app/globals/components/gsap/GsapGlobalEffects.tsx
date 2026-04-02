"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useGsapCore } from "@/app/globals/lib/gsapClient";

const BATCH_SELECTORS = [
  ".fadeInOut h1",
  ".fadeInOut h2",
  ".fadeInOut h3",
  ".fadeInOut h4",
  ".fadeInOut p",
  ".fadeInOut li",
  ".fadeInOut picture",
  ".fadeInOut img",
  ".fadeInOut video",
  ".fadeInOut .btn",
];

const CARD_SELECTOR = ".fadeCards .card";

export default function GsapGlobalEffects() {
  const { gsap, ScrollTrigger } = useGsapCore();
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(CARD_SELECTOR);

      if (cards.length) {
        gsap.set(cards, { opacity: 0, y: 50 });

        ScrollTrigger.batch(cards, {
          start: "top 85%",
          end: "bottom 20%",
          once: false,
          onEnter: (batch) =>
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: "power3.out",
              stagger: 0.08,
              overwrite: true,
            }),
          onEnterBack: (batch) =>
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: "power3.out",
              stagger: 0.06,
              overwrite: true,
            }),
          onLeaveBack: (batch) =>
            gsap.to(batch, {
              opacity: 0,
              y: 50,
              duration: 0.5,
              ease: "power3.out",
              overwrite: true,
            }),
        });
      }

      const elements = BATCH_SELECTORS
        .flatMap((sel) => gsap.utils.toArray<HTMLElement>(sel))
        .filter((el) => el && !el.closest(CARD_SELECTOR)); // ✅ evita conflicto

      if (elements.length) {
        gsap.set(elements, { opacity: 0, y: 50 });

        ScrollTrigger.batch(elements, {
          start: "top 90%",
          end: "bottom 20%",
          once: false,
          onEnter: (batch) =>
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out",
              stagger: 0.08,
              overwrite: true,
            }),
          onEnterBack: (batch) =>
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out",
              stagger: 0.06,
              overwrite: true,
            }),
          onLeaveBack: (batch) =>
            gsap.to(batch, {
              opacity: 0,
              y: 50,
              duration: 0.6,
              ease: "power3.out",
              overwrite: true,
            }),
        });
      }

      // refresca después del render + triggers
      requestAnimationFrame(() => ScrollTrigger.refresh());
    });

    return () => ctx.revert();
  }, [gsap, ScrollTrigger, pathname]);

  return null;
}