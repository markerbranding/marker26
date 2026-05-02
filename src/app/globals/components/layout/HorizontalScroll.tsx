"use client";

import "./HorizontalScroll.scss";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useLocale } from "next-intl";
import { useGsapCore } from "@/app/globals/lib/gsapClient";
import { useIsomorphicLayoutEffect } from "@/app/globals/hooks/useIsomorphicLayoutEffect";

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

type Props = {
  data: {
    title?: BaseTitle;
    intro?: string;
    items: ProjectsItem[] | GenericItem[];
  };
  variant?: "projects" | "generic";
  className?: string;
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
  const isPinTransitioning = React.useRef(false);
  const { gsap, ScrollTrigger } = useGsapCore();

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
            onToggle: () => {
              isPinTransitioning.current = true;
              // Limpia también cualquier is-hovered que haya quedado
              ul.querySelectorAll(".is-hovered").forEach((el) => {
                el.classList.remove("is-hovered");
              });
              setTimeout(() => {
                isPinTransitioning.current = false;
              }, 300);
            },
          },
        });

        const refreshSoonLocal = () => refreshSoon();

        refreshSoonLocal();
        const t1 = window.setTimeout(refreshSoonLocal, 150);
        const t2 = window.setTimeout(refreshSoonLocal, 450);
        const t3 = window.setTimeout(refreshSoonLocal, 900);

        const images = ul.querySelectorAll("img");
        images.forEach((img) => {
          if (!img.complete) {
            img.addEventListener("load", refreshSoonLocal, { once: true });
          }
        });

        const ro = new ResizeObserver(() => refreshSoonLocal());
        ro.observe(ul);
        ro.observe(pinEl);

        const onResize = () => refreshSoonLocal();
        window.addEventListener("resize", onResize);

        const onLoad = () => refreshSoonLocal();
        window.addEventListener("load", onLoad);

        return () => {
          window.clearTimeout(t1);
          window.clearTimeout(t2);
          window.clearTimeout(t3);

          images.forEach((img) => {
            img.removeEventListener("load", refreshSoonLocal);
          });

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
          {(data.items as any[]).map((item, index) => (
            <li key={item.slug ?? index} className="item scroll__item">
              {variant === "projects" ? (
                <ProjectHCard
                  item={item as ProjectsItem}
                  isPinTransitioning={isPinTransitioning}
                />
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

function ProjectHCard({
  item,
  isPinTransitioning,
}: {
  item: ProjectsItem;
  isPinTransitioning: React.MutableRefObject<boolean>;
}) {
  const locale = useLocale();
  const href = `/${locale}/projects/${item.slug}`;
  const linkRef = React.useRef<HTMLAnchorElement | null>(null);

  return (
    <article className="card hcard">
      <Link
        href={href}
        className="hcard__link cardHover"
        ref={linkRef}
        onMouseEnter={() => {
          if (isPinTransitioning.current) return;
          linkRef.current?.classList.add("is-hovered");
        }}
        onMouseLeave={() => {
          linkRef.current?.classList.remove("is-hovered");
        }}
      >
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