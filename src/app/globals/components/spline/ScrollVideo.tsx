"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useGsapCore } from "@/app/globals/lib/gsapClient";
import { useIsomorphicLayoutEffect } from "@/app/globals/hooks/useIsomorphicLayoutEffect";
import { useTranslations, useLocale } from "next-intl";
import { services } from "@/app/globals/data/services.data";
import "./ScrollVideo.css";

type ScrollVideoProps = {
  src: string;
  poster?: string;
  className?: string;
};

export default function ScrollVideo({
  src,
  poster,
  className = ""
}: ScrollVideoProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoWrapperRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const leftRef = useRef<HTMLDivElement | null>(null);

  const { gsap, ScrollTrigger } = useGsapCore();

  // 👉 flag para saber que YA tenemos metadata, incluso si vino de caché
  const [metadataReady, setMetadataReady] = useState(false);

  const tServices = useTranslations("Services");
  const locale = useLocale();

  // 1) Nos aseguramos de inicializar metadata tanto si viene por evento,
  //    como si el video ya estaba listo cuando se montó el componente.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !ScrollTrigger) return;

    const initVideoMetadata = () => {
      video.pause();
      video.currentTime = 0;
      setMetadataReady(true);

      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    };

    if (video.readyState >= 1) {
      // Ya tiene metadata (cache o carga muy rápida)
      initVideoMetadata();
    } else {
      // Esperamos el evento
      const handler = () => {
        initVideoMetadata();
      };
      video.addEventListener("loadedmetadata", handler);

      return () => {
        video.removeEventListener("loadedmetadata", handler);
      };
    }
  }, [ScrollTrigger]);

  // 2) Creamos el ScrollTrigger SOLO cuando
  //    - gsap/ScrollTrigger existen
  //    - refs están listos
  //    - metadataReady es true
  useIsomorphicLayoutEffect(() => {
    if (!gsap || !ScrollTrigger) return;
    if (!containerRef.current || !videoWrapperRef.current || !videoRef.current) return;
    if (!metadataReady) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      //mm.add("(min-width: 1025px)", () => {
        const video = videoRef.current!;
        const wrapper = videoWrapperRef.current!;
        const section = containerRef.current!;
        const left = leftRef.current!;

        video.pause();
        video.currentTime = 0;

        const st = ScrollTrigger.create({
          trigger: section,
          start: "top 10%",
          // ✅ end dinámico, recalculable en refresh
          end: () => {
            const leftH = left.offsetHeight;
            const wrapperH = wrapper.offsetHeight;

            // cuánto scroll necesita para que el pin dure lo mismo que el contenido
            // (mínimo 0 para evitar valores negativos en layouts raros)
            const distance = Math.max(0, leftH - wrapperH);
            const vh40 = window.innerHeight * 0.1;

            // puedes sumar un extra si quieres “aire”
            return `+=${Math.max(0, distance - vh40)}`;
          },
          scrub: true,
          pin: wrapper,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const vid = videoRef.current;
            if (!vid || !vid.duration || Number.isNaN(vid.duration)) return;

            const t = self.progress * (vid.duration - 0.05);
            vid.currentTime = Math.min(Math.max(t, 0), vid.duration - 0.05);
          }
        });

        // ✅ Refresh al resize (debounce para no spammear)
        let rAF = 0;
        const onResize = () => {
          cancelAnimationFrame(rAF);
          rAF = requestAnimationFrame(() => ScrollTrigger.refresh());
        };
        window.addEventListener("resize", onResize);

        // ✅ Bonus: si el contenido cambia de alto por fonts/images, también refresca
        const ro = new ResizeObserver(() => ScrollTrigger.refresh());
        ro.observe(left);
        ro.observe(wrapper);

        return () => {
          window.removeEventListener("resize", onResize);
          cancelAnimationFrame(rAF);
          ro.disconnect();
          st.kill();
        };
      //});

      // Cuando sales de desktop, mm se encarga de ejecutar el cleanup automáticamente
      return () => mm.revert();
    }, containerRef);

    return () => ctx.revert();
  }, [gsap, ScrollTrigger, metadataReady]);

  return (
    <section className={`section__services ${className}`}>
      {/*<div className="column__1">
        <h3>{tServices("sectionTitle")}</h3>
        <h2>{tServices("sectionSubtitle")}</h2>
      </div>
      */}
      <div className="column__2" ref={containerRef}>
        <div className="col__left scroll-video__services fadeInOut" ref={leftRef}>
          

          <div className="services__list">
            <article className="service-card service-card-title">
              <div className="card__data">
                <h3 className="prefix">{tServices("sectionTitle")}</h3>
                <h2>{tServices("sectionSubtitle")}</h2>
              </div>
            </article>
            {services.map((service) => {
              const data = tServices.raw(`items.${service.key}`) as {
                title: string;
                excerpt: string;
                cta: string;
              };

              const href = `/${locale}/services/${service.slug}`;

              return (
                <article
                  key={service.key}
                  className="service-card"
                >
                  <div className="card__index">
                    <span>{service.index}</span>
                  </div>
                  <div className="card__data">
                    <h3 className="service-card__title">{data.title}</h3>
                    <p className="service-card__excerpt">{data.excerpt}</p>
                    <Link className="btn" href={href}>
                      {data.cta}
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
        <div className="col__right">
          <div className="scroll-video__wrapper" ref={videoWrapperRef}>
            <video
              ref={videoRef}
              src={src}
              poster={poster}
              playsInline
              muted
              preload="auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}