"use client";

import "./AnimatedButton.scss";
import Link from "next/link";
import { useRef, useCallback, useEffect } from "react";
import { useGsapCore } from "@/app/globals/lib/gsapClient";
import Svg from "../img/Svg";

type AnimatedButtonProps = {
  label: string;
  href?: string;
  onClick?: () => void;
  className?: string;
  as?: "link" | "button" | "a";
  target?: "_blank" | "_self";
};

// Convierte un string en array de spans con máscara
function splitToSpans(text: string) {
  return text.split("").map((char, i) => (
    <span key={i} className="char-mask">
      <span className="char">
        {char === " " ? "\u00A0" : char}
      </span>
    </span>
  ));
}

export default function AnimatedButton({
  label,
  href,
  onClick,
  className = "",
  as = "link",
  target,
}: AnimatedButtonProps) {
  const rootRef = useRef<HTMLElement | null>(null);
  const { gsap } = useGsapCore();

  useEffect(() => {
    if (!gsap || !rootRef.current) return;
    const botChars = rootRef.current.querySelectorAll<HTMLElement>(".btn__text--bottom .char");
    gsap.set(botChars, { yPercent: 120 }); // ← empieza abajo, invisible
  }, [gsap]);

  const onEnter = useCallback(() => {
    if (!gsap || !rootRef.current) return;

    const topChars = rootRef.current.querySelectorAll<HTMLElement>(".btn__text--top .char");
    const botChars = rootRef.current.querySelectorAll<HTMLElement>(".btn__text--bottom .char");

    gsap.killTweensOf([...topChars, ...botChars]);

    // Top sale
    gsap.to(topChars, {
      yPercent: -120,
      duration: 0.3,
      ease: "power2.in",
      stagger: 0.01,
    });

    // Bottom entra con delay para que no se encimen
    gsap.fromTo(
      botChars,
      { yPercent: 120 },
      {
        yPercent: 0,
        duration: 0.3,
        ease: "power2.out",
        stagger: 0.01,
        delay: 0.16, // ← entra cuando el top ya empezó a salir
      }
    );
  }, [gsap]);

  const onLeave = useCallback(() => {
    if (!gsap || !rootRef.current) return;

    const topChars = rootRef.current.querySelectorAll<HTMLElement>(".btn__text--top .char");
    const botChars = rootRef.current.querySelectorAll<HTMLElement>(".btn__text--bottom .char");

    gsap.killTweensOf([...topChars, ...botChars]);

    // Top vuelve
    gsap.to(topChars, {
      yPercent: 0,
      duration: 0.3,
      ease: "power2.out",
      stagger: 0.01,
      delay: 0.16,
    });

    // Bottom sale primero
    gsap.to(botChars, {
      yPercent: 120,
      duration: 0.3,
      ease: "power2.in",
      stagger: 0.01,
    });
  }, [gsap]);

  const sharedProps = {
    ref: rootRef as any,
    className: `btn ${className}`,
    onMouseEnter: onEnter,
    onMouseLeave: onLeave,
    onClick,
  };

  const inner = (
    <>
      <span className="btn__text btn__text--top">
        {splitToSpans(label)}
      </span>
      <span className="btn__text btn__text--bottom" aria-hidden="true">
        {splitToSpans(label)}
      </span>
    </>
  );

  if (as === "button") return <button {...sharedProps}>{inner}</button>;
  if (as === "a") return <a {...sharedProps} href={href} target={target}>{inner}</a>;
  return <Link {...sharedProps} href={href ?? "#"} target={target}>
    {inner}
    <div className="icon__wrapper"><Svg variant="ArrowClassic" /></div>
  </Link>;
}