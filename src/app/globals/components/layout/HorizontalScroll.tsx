"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useLocale } from "next-intl";
import { useGsapCore } from "@/app/globals/lib/gsapClient";
import { useIsomorphicLayoutEffect } from "@/app/globals/hooks/useIsomorphicLayoutEffect";
import "./HorizontalScroll.css";

type BaseTitle = {
  h2: string;
  p?: string;
};

type ProjectsItem = {
  slug: string;
  client: string;
  category: string;
  cardDescription: string;
  thumbnail: string;
};

type GenericItem = Record<string, any>;

type HorizontalScrollData =
  | { title?: BaseTitle; intro?: string; items: ProjectsItem[]; variant: "projects" }
  | { title?: BaseTitle; intro?: string; items: GenericItem[]; variant?: "generic" };

type Props = {
  data: {
    title?: BaseTitle;
    intro?: string;
    items: ProjectsItem[] | GenericItem[];
  };
  variant?: "projects" | "generic";
  className?: string;

  /**
   * Si quieres pinnear otro elemento en lugar del section.
   * Ej: pinSelector=".column__1" o ".section__horizontalScroll"
   */
  pinSelector?: string;
};

export default function HorizontalScroll({
  data,
  variant = "generic",
  className = "",
  pinSelector,
}: Props) {
  const wrapperRef = React.useRef<HTMLElement | null>(null);
  const racerRef = React.useRef<HTMLUListElement | null>(null);
  const bgRef = React.useRef<HTMLDivElement | null>(null);
  const { gsap, ScrollTrigger } = useGsapCore();

  // ✅ Animación horizontal (desktop) + fallback (mobile)
  useIsomorphicLayoutEffect(() => {
    if (!gsap || !ScrollTrigger) return;
    if (!wrapperRef.current || !racerRef.current) return;

    const section = wrapperRef.current;
    const ul = racerRef.current;

    const getScrollDistance = () =>
    Math.max(0, ul.scrollWidth - window.innerWidth);

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

    const ctx = gsap.context(() => {

    if (bgRef.current) {
      gsap.fromTo(
        bgRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: section,
            start: "top 95%",
            end: "top 55%",
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      );
    }

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      gsap.set(ul, { x: 0, willChange: "transform" });

      const pinEl =
        (pinSelector
          ? (section.querySelector(pinSelector) as HTMLElement | null)
          : null) ?? section;

      const onRefreshInit = () => {
        gsap.set(ul, { x: 0 });
      };
      ScrollTrigger.addEventListener("refreshInit", onRefreshInit);

      const tween = gsap.to(ul, {
        x: () => -getScrollDistance(),
        ease: "power1.inOut",
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

      const refreshSoonLocal = () => refreshSoon();

  // ✅ refresh inicial + diferidos (Next/Image, fuentes, CLS)
  refreshSoonLocal();
  const t1 = window.setTimeout(refreshSoonLocal, 150);
  const t2 = window.setTimeout(refreshSoonLocal, 450);
  const t3 = window.setTimeout(refreshSoonLocal, 900);

  // ✅ ResizeObserver (cambios reales de tamaño)
  const ro = new ResizeObserver(() => refreshSoonLocal());
  ro.observe(ul);
  ro.observe(pinEl);

  // ✅ window resize
  const onResize = () => refreshSoonLocal();
  window.addEventListener("resize", onResize);

  // ✅ por si las imágenes terminan de cargar después
  const onLoad = () => refreshSoonLocal();
  window.addEventListener("load", onLoad);

  return () => {
    window.clearTimeout(t1);
    window.clearTimeout(t2);
    window.clearTimeout(t3);

    ro.disconnect();
    window.removeEventListener("resize", onResize);
    window.removeEventListener("load", onLoad);

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
  }, [gsap, ScrollTrigger, pinSelector, data.items.length]);

  

  return (
    <section
      className={`section__horizontalScroll ${className}`}
      ref={wrapperRef}
    >
      <div ref={bgRef} className="bg" />
      <div className="column__1">
        <div className="prefix__wrapper fadeInOut">
          <h3 className="prefix">Proyectos recientes</h3>
          <h2>Proyectos recientes</h2>
        </div>
        <ul ref={racerRef} className="fadeCards">
          {/* Intro item */}
          {/*<li className="item first__item">
            <div className="content">
              {data.title?.h2 && <h2>{data.title.h2}</h2>}
              {data.title?.p && <p>{data.title.p}</p>}
              {data.intro && <p>{data.intro}</p>}
            </div>
          </li>*/}

          {/* Items */}
          {(data.items as any[]).map((item, index) => (
            <li
              key={item.slug ?? index}
              className="item scroll__item"
            >
              {variant === "projects" ? (
                <ProjectHCard item={item as ProjectsItem} />
              ) : (
                <GenericHCard item={item} />
              )}
            </li>
          ))}
          <li className="item scroll__item"></li>
        </ul>
      </div>
    </section>
  );
}

function ProjectHCard({ item }: { item: ProjectsItem }) {
  const locale = useLocale();
  const href = `/${locale}/projects/${item.slug}`;

  return (
    <article className="card hcard">
      <Link href={href} className="hcard__link">
        <div className="hcard__media">
          <Image
            src={item.thumbnail}
            alt={item.client}
            width={900}
            height={700}
            sizes="(min-width: 1024px) 35vw, 85vw"
            style={{ width: "100%", height: "auto" }}
          />
        </div>

        <div className="hcard__content">
          <span className="hcard__category">{item.category}</span>
          <h3 className="hcard__title">{item.client}</h3>
          <p className="hcard__excerpt">{item.cardDescription}</p>
        </div>
      </Link>
    </article>
  );
}

function GenericHCard({ item }: { item: any }) {
  return (
    <article className="card hcard">
      <div className="hcard__content">
        <h3 className="hcard__title">{item.title ?? "Item"}</h3>
        <p className="hcard__excerpt">{item.description ?? ""}</p>
      </div>
    </article>
  );
}