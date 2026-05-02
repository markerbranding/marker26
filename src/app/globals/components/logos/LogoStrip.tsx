"use client";

import "./LogoStrip.scss";
import { useRef } from "react";
import { useGsapCore } from "@/app/globals/lib/gsapClient";
import { useIsomorphicLayoutEffect } from "@/app/globals/hooks/useIsomorphicLayoutEffect";
import Svg from "../img/Svg";

type LogoStripProps = {
  logos?: React.ReactNode[];
  speed?: number; // segundos en recorrer una tira completa
  className?: string;
};

// Logos por defecto si no se pasan
const DEFAULT_LOGOS = Array.from({ length: 20 }, (_, i) => (
  <Svg key={i} variant="Arrow" />
));

export default function LogoStrip({
  logos = DEFAULT_LOGOS,
  speed = 30,
  className = "",
}: LogoStripProps) {
  const stripRef = useRef<HTMLDivElement | null>(null);
  const { gsap } = useGsapCore();

  useIsomorphicLayoutEffect(() => {
    if (!gsap || !stripRef.current) return;

    const strip = stripRef.current;
    const track = strip.querySelector<HTMLElement>(".logo-strip__track");
    if (!track) return;

    // Ancho de una sola tira (la mitad del track, ya que duplicamos)
    const getSingleWidth = () => track.scrollWidth / 2;

    const ctx = gsap.context(() => {
      const tween = gsap.to(track, {
        x: () => -getSingleWidth(),
        duration: speed,
        ease: "none",
        repeat: -1,
        modifiers: {
          x: gsap.utils.unitize((x) => parseFloat(x) % getSingleWidth()),
        },
      });

      return () => tween.kill();
    }, strip);

    return () => ctx.revert();
  }, [gsap, speed]);

  return (
    <div className={`logo-strip ${className}`} ref={stripRef}>
      <div className="logo-strip__track">
        {/* Original */}
        <div className="logo-strip__set">
          {logos.map((logo, i) => (
            <div key={`a-${i}`} className="logo-strip__item">
              {logo}
            </div>
          ))}
        </div>
        {/* Copia — para el loop sin corte */}
        <div className="logo-strip__set" aria-hidden="true">
          {logos.map((logo, i) => (
            <div key={`b-${i}`} className="logo-strip__item">
              {logo}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}