"use client";

import { useEffect, useRef } from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import type { Splide as SplideInstance } from "@splidejs/splide";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { testimonials } from "@/app/globals/data/testimonials.data";
import QuoteImage from "./QuoteImage"
import Arrow from "@/app/globals/components/img/Arrow"

import "@splidejs/splide/dist/css/splide.min.css";
import "./TestimonialsSlider.css";

type Props = {
  className?: string;
  hideHeader?: boolean;
};

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

function updateFocus(splide: SplideInstance) {
  const root = splide.root as HTMLElement;
  const track = root.querySelector(".splide__track") as HTMLElement | null;
  if (!track) return;

  const trackRect = track.getBoundingClientRect();
  const centerX = trackRect.left + trackRect.width / 2;

  // ✅ Ajusta: más chico = “enfoca antes”
  const maxDist = trackRect.width * 0.45;

  const slides = root.querySelectorAll<HTMLElement>(".splide__slide");
  slides.forEach((slide) => {
    const r = slide.getBoundingClientRect();
    const slideCenter = r.left + r.width / 2;
    const dist = Math.abs(centerX - slideCenter);

    // 0..1
    const linear = clamp01(1 - dist / maxDist);

    // ✅ “enfoca antes” (0.6). Cambia a 1 si quieres lineal.
    const focus = Math.pow(linear, 0.6);

    slide.style.setProperty("--focus", focus.toFixed(4));
  });
}

export default function TestimonialsSlider({
  className = "",
  hideHeader = false,
}: Props) {
  const t = useTranslations("Testimonials");

  // Guardamos la instancia real de Splide
  const splideRef = useRef<SplideInstance | null>(null);

  // RAF loop control
  const rafId = useRef<number | null>(null);

  const startRAF = (splide: SplideInstance) => {
    if (rafId.current) return;

    const loop = () => {
      updateFocus(splide);
      rafId.current = requestAnimationFrame(loop);
    };

    rafId.current = requestAnimationFrame(loop);
  };

  const stopRAF = () => {
    if (!rafId.current) return;
    cancelAnimationFrame(rafId.current);
    rafId.current = null;
  };

  // Seguridad: si el componente se desmonta, cancelamos RAF
  useEffect(() => {
    return () => stopRAF();
  }, []);

  return (
    <section className={`section__testimonials ${className}`}>
      <div className="column__2">
        <div className="col__left">
          {!hideHeader && <h3>{t("title")}</h3>}
          {!hideHeader && <h2>{t("subtitle")}</h2>}
        </div>

        <div className="col__right">
          <div className="testimonials__arrows">
            <button
              type="button"
              className="btn__arrow btn__arrow__prev"
              aria-label={t("prev")}
              onClick={() => splideRef.current?.go("<")}
            >
              <Arrow />
            </button>

            <button
              type="button"
              className="btn__arrow btn__arrow__next"
              aria-label={t("next")}
              onClick={() => splideRef.current?.go(">")}
            >
              <Arrow />
            </button>
          </div>
        </div>
      </div>

      <Splide
        aria-label={t("ariaLabel")}
        onMounted={(splide) => {
          splideRef.current = splide;

          // ✅ primera medición (1 frame después)
          requestAnimationFrame(() => updateFocus(splide));

          // ✅ cuando empieza a animar (botones/auto)
          splide.on("move", () => startRAF(splide));
          // ✅ cuando empieza drag
          splide.on("drag", () => startRAF(splide));

          // ✅ cuando termina animación
          splide.on("moved", () => {
            updateFocus(splide);
            stopRAF();
          });

          // ✅ cuando termina drag
          splide.on("dragged", () => {
            updateFocus(splide);
            stopRAF();
          });

          // ✅ resize
          splide.on("resized", () => {
            requestAnimationFrame(() => updateFocus(splide));
          });

          // ✅ si splide se destruye
          splide.on("destroy", () => stopRAF());
        }}
        options={{
          type: "loop",
          rewind: true,
          perPage: 1,
          perMove: 1,
          gap: "5vw",
          pagination: true,
          arrows: false,
          snap: true,
          speed: 800,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          padding: "25vw",
          focus: "center",
          breakpoints: { 1024: { perPage: 1, padding: "10vw" } },
        }}
      >
        {testimonials.map((item) => {
          const data = t.raw(`items.${item.key}`) as { quote: string, role: string };

          return (
            <SplideSlide key={item.key}>
              <div className="testimonial__card">
                <div className="testimonial__card__wrapper">
                  <div className="testimonial__card__left">
                    <Image
                      src={item.logo}
                      alt={item.company}
                      width={120}
                      height={40}
                      style={{ width: "auto", height: "auto" }}
                    />
                    <div>
                      <h3>{item.author}</h3>
                      <h4>
                        {data.role} <span>{item.company}</span>
                      </h4>
                    </div>
                  </div>

                  <div className="testimonial__card__right">
                    <QuoteImage />
                    <blockquote className="testimonial__card__quote">
                      {data.quote}{"”"}
                    </blockquote>
                  </div>
                </div>
              </div>
            </SplideSlide>
          );
        })}
      </Splide>
    </section>
  );
}