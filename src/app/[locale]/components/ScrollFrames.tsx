"use client";

import "./ScrollFrames.scss"; // Reutiliza el mismo scss
import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useGsapCore } from "@/app/globals/lib/gsapClient";
import { useIsomorphicLayoutEffect } from "@/app/globals/hooks/useIsomorphicLayoutEffect";
import { useTranslations, useLocale } from "next-intl";
import { services } from "@/app/globals/data/services.data";

type ScrollFramesProps = {
  desktopFramesBase: string;
  mobileFramesBase: string;
  frameCount: number;
  frameExtension?: string;
  framePadding?: number;
  poster?: string;
  className?: string;
  desktopEndOffset?: number;
  mobileEndOffset?: number;
  desktopLastFrame?: number;
  mobileLastFrame?: number;
  // Nueva prop: restar la altura del último service-card en móvil
  mobileSubtractLastCard?: boolean;
};

export default function ScrollFrames({
  desktopFramesBase,
  mobileFramesBase,
  frameCount,
  frameExtension = "webp",
  framePadding = 4,
  poster,
  className = "",
  desktopEndOffset = 0,
  mobileEndOffset = 0,
  desktopLastFrame,
  mobileLastFrame,
  mobileSubtractLastCard,
}: ScrollFramesProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const leftRef = useRef<HTMLDivElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const { gsap, ScrollTrigger } = useGsapCore();

  // Frames cargados en memoria
  const framesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef<number>(0);
  const [framesReady, setFramesReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const tServices = useTranslations("Services");
  const locale = useLocale();

  // Genera el path de un frame, ej: /home/frames/desktop/frame_0001.webp
  const getFramePath = useCallback(
    (base: string, index: number) => {
      const num = String(index).padStart(framePadding, "0");
      return `${base}${num}.${frameExtension}`;
    },
    [framePadding, frameExtension]
  );

  // Dibuja un frame en el canvas
  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    const frames = framesRef.current;
    if (!canvas || !frames[index]) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(frames[index], 0, 0, canvas.width, canvas.height);
    currentFrameRef.current = index;
  }, []);

  // Carga la secuencia de imágenes
  useEffect(() => {
    setFramesReady(false);
    framesRef.current = [];

    const mobile = window.innerWidth <= 1024;
    setIsMobile(mobile);
    const base = mobile ? mobileFramesBase : desktopFramesBase;

    let loaded = 0;
    const images: HTMLImageElement[] = new Array(frameCount);

    // Carga todas en paralelo
    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      // Importante: empieza desde 1 (frame_0001)
      img.src = getFramePath(base, i + 1);

      img.onload = () => {
        images[i] = img;
        loaded++;

        // Dibuja el primer frame en cuanto esté listo
        if (i === 0) {
          const canvas = canvasRef.current;
          if (canvas) {
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            drawFrame(0);
          }
        }

        if (loaded === frameCount) {
          framesRef.current = images;
          setFramesReady(true);
        }
      };

      img.onerror = () => {
        // Contar igualmente para no bloquear si alguno falla
        loaded++;
        if (loaded === frameCount) {
          framesRef.current = images;
          setFramesReady(true);
        }
      };
    }
  }, [desktopFramesBase, mobileFramesBase, frameCount, getFramePath, drawFrame]);

  // ScrollTrigger → canvas
  useIsomorphicLayoutEffect(() => {
  if (!gsap || !ScrollTrigger) return;
  if (!containerRef.current || !canvasRef.current || !leftRef.current || !wrapperRef.current) return;
  if (!framesReady) return;

  const ctx = gsap.context(() => {
    const canvas = canvasRef.current!;
    const section = containerRef.current!;
    const left = leftRef.current!;
    const wrapper = wrapperRef.current!;

    if (framesRef.current[0]) {
      canvas.width = framesRef.current[0].naturalWidth;
      canvas.height = framesRef.current[0].naturalHeight;
    }

    drawFrame(0);

    const mobile = window.innerWidth <= 1024;

    // Frame máximo al que llega la animación
    const lastFrame = mobile
      ? (mobileLastFrame ?? frameCount - 1)
      : (desktopLastFrame ?? frameCount - 1);

    // Resuelve offset ya sea número o función
    const resolveOffset = (offset: number | (() => number) | undefined): number => {
      if (typeof offset === "function") return offset();
      return offset ?? 0;
    };

    const st = ScrollTrigger.create({
        trigger: section,
        start: "top 60px",
        end: () => {
            const distance = Math.max(0, left.offsetHeight - wrapper.offsetHeight);

            let endOffset = mobile ? (mobileEndOffset ?? 0) : (desktopEndOffset ?? 0);

            if (mobile && mobileSubtractLastCard) {
                const lastCard = left.querySelector<HTMLElement>(".service-card:last-child");
                if (lastCard) {
                const leftRect = left.getBoundingClientRect();
                const cardRect = lastCard.getBoundingClientRect();
                // posición del card relativa al top de left en el documento
                const cardRelativeTop = cardRect.top - leftRect.top + left.scrollTop;
                const pad = 50;
                endOffset += left.offsetHeight - cardRelativeTop + pad;


                console.log("left.offsetHeight:", left.offsetHeight);
                console.log("lastCard.offsetTop:", lastCard.offsetTop);
                console.log("cardRelativeTop:", cardRelativeTop);
            }
        }

            return `+=${Math.max(0, distance - endOffset)}`;
        },
        scrub: true,
        invalidateOnRefresh: true,
        markers: false,
        onUpdate: (self) => {
            const total = framesRef.current.length;
            if (!total) return;

            const index = Math.min(
            Math.round(self.progress * lastFrame),
            lastFrame
            );

            if (index !== currentFrameRef.current) {
                drawFrame(index);
            }
        },
    });

    let rAF = 0;
    const onResize = () => {
      cancelAnimationFrame(rAF);
      rAF = requestAnimationFrame(() => ScrollTrigger.refresh());
    };
    window.addEventListener("resize", onResize);

    const ro = new ResizeObserver(() => ScrollTrigger.refresh());
    ro.observe(left);
    ro.observe(wrapper);

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(rAF);
      ro.disconnect();
      st.kill();
    };
  }, containerRef);

  return () => ctx.revert();
}, [gsap, ScrollTrigger, framesReady, drawFrame, desktopEndOffset, mobileEndOffset, desktopLastFrame, mobileLastFrame, frameCount, mobileSubtractLastCard]);

  return (
    <section className={`section__services ${className}`}>
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
                <article key={service.key} className="service-card">
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
          <div className="scroll-video__wrapper" ref={wrapperRef}>
            <canvas
              ref={canvasRef}
              style={{
                width: "100%",
                height: "100%",
                display: "block",
                objectFit: "cover",   // no aplica a canvas, usa CSS
                borderRadius: "var(--radius)",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}