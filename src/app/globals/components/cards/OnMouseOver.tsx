"use client";

import "./OnMouseOver.scss";
import {useEffect, useRef} from "react";
import {usePathname} from "next/navigation";
import {useGsapCore} from "@/app/globals/lib/gsapClient";
import Svg from "@/app/globals/components/img/Svg";

type CursorTooltipProps = {
  label?: string;
  targetSelector?: string;
};

export default function CursorTooltip({
  label = "Abrir proyecto",
  targetSelector = ".card",
}: CursorTooltipProps) {
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  const {gsap} = useGsapCore();
  const pathname = usePathname();

  const rafRef = useRef<number>(0);

  const mousePos = useRef({
    x: 0,
    y: 0,
  });

  const currentPos = useRef({
    x: 0,
    y: 0,
  });

  const lastMousePos = useRef({
    x: 0,
    y: 0,
  });

  const isVisible = useRef(false);

  /*
   * Nos dice si el tooltip ya recibió
   * una posición inicial alguna vez.
   */
  const hasPosition = useRef(false);

  /*
   * ==============================
   * ROUTE CHANGE
   * ==============================
   *
   * Cada vez que cambia pathname,
   * escondemos inmediatamente el tooltip.
   */
  useEffect(() => {
    const tooltip = tooltipRef.current;

    if (!tooltip || !gsap) return;

    isVisible.current = false;

    gsap.killTweensOf(tooltip);

    gsap.set(tooltip, {
      autoAlpha: 0,
      scale: 0.8,
    });
  }, [pathname, gsap]);

  /*
   * ==============================
   * CURSOR SYSTEM
   * ==============================
   */

  useEffect(() => {
    if (!gsap || !tooltipRef.current) return;

    const tooltip = tooltipRef.current;

    gsap.set(tooltip, {
      autoAlpha: 0,
      scale: 0.8,
      xPercent: 0,
      yPercent: 0,
    });

    /*
     * Cuanto menor sea, más "flotante".
     *
     * 0.08 = bastante suave
     * 0.12 = equilibrado
     * 0.2  = más pegado al cursor
     */
    const LERP = 0.12;

    const OFFSET = 12;

    /*
     * ==============================
     * RAF LOOP
     * ==============================
     */

    const loop = () => {
      currentPos.current.x +=
        (mousePos.current.x - currentPos.current.x) * LERP;

      currentPos.current.y +=
        (mousePos.current.y - currentPos.current.y) * LERP;

      const tooltipW = tooltip.offsetWidth;
      const tooltipH = tooltip.offsetHeight;

      const winW = window.innerWidth;
      const winH = window.innerHeight;

      let x = currentPos.current.x + OFFSET;
      let y = currentPos.current.y + OFFSET;

      /*
       * Si se sale por derecha,
       * lo colocamos del lado izquierdo.
       */
      if (x + tooltipW > winW) {
        x =
          currentPos.current.x -
          tooltipW -
          OFFSET;
      }

      /*
       * Si se sale por abajo,
       * lo ponemos arriba del cursor.
       */
      if (y + tooltipH > winH) {
        y =
          currentPos.current.y -
          tooltipH -
          OFFSET;
      }

      /*
       * x/y se actualizan directamente
       * porque el suavizado ya ocurre
       * con nuestro LERP.
       */
      gsap.set(tooltip, {
        x,
        y,
      });

      rafRef.current =
        requestAnimationFrame(loop);
    };

    rafRef.current =
      requestAnimationFrame(loop);

    /*
     * ==============================
     * SHOW
     * ==============================
     */

    const showTooltip = () => {
      isVisible.current = true;

      gsap.killTweensOf(tooltip);

      gsap.to(tooltip, {
        autoAlpha: 1,
        scale: 1,
        duration: 0.5,
        ease: "power3.out",
        overwrite: true,
      });
    };

    /*
     * ==============================
     * HIDE
     * ==============================
     */

    const hideTooltip = (
      immediate = false
    ) => {
      isVisible.current = false;

      gsap.killTweensOf(tooltip);

      if (immediate) {
        gsap.set(tooltip, {
          autoAlpha: 0,
          scale: 0.5,
        });

        return;
      }

      gsap.to(tooltip, {
        autoAlpha: 0,
        scale: 0.5,
        duration: 0.5,
        ease: "power2.out",
        overwrite: true,
      });
    };

    /*
     * ==============================
     * MOUSE MOVE
     * ==============================
     */

    const handleMove = (
      e: MouseEvent
    ) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;

      lastMousePos.current.x = e.clientX;
      lastMousePos.current.y = e.clientY;

      /*
       * SOLO la primera vez.
       *
       * Esto evita que el tooltip aparezca
       * desde 0,0 cuando todavía nunca
       * hemos movido el mouse.
       *
       * Lo importante es que NO hacemos
       * esto cada vez que entramos a
       * una card.
       */
      if (!hasPosition.current) {
        currentPos.current.x = e.clientX;
        currentPos.current.y = e.clientY;

        hasPosition.current = true;
      }
    };

    /*
     * ==============================
     * ENTER TARGET
     * ==============================
     */

    const handleEnter = (
      e: MouseEvent
    ) => {
      const target = e.target;

      if (!(target instanceof Element)) {
        return;
      }

      const card =
        target.closest(targetSelector);

      if (!card) return;

      /*
       * IMPORTANTE:
       *
       * Ya NO sincronizamos currentPos
       * aquí.
       *
       * Así, si pasas rápidamente de una
       * card a otra, el tooltip conserva
       * su movimiento y no brinca.
       */

      showTooltip();
    };

    /*
     * ==============================
     * LEAVE TARGET
     * ==============================
     */

    const handleLeave = (
      e: MouseEvent
    ) => {
      const target = e.target;

      if (!(target instanceof Element)) {
        return;
      }

      const card =
        target.closest(targetSelector);

      if (!card) return;

      const related =
        e.relatedTarget as Element | null;

      /*
       * Si el mouse simplemente pasó
       * entre elementos internos de la
       * MISMA card, no hacemos hide.
       */
      if (
        related &&
        card.contains(related)
      ) {
        return;
      }

      /*
       * Si estamos pasando directamente
       * de una card a otra, tampoco
       * desaparecemos.
       *
       * Esto hace la transición entre cards
       * mucho más suave.
       */
      if (
        related &&
        related.closest(targetSelector)
      ) {
        return;
      }

      hideTooltip();
    };

    /*
     * ==============================
     * CLICK
     * ==============================
     *
     * Muy importante para navegación
     * de Next.
     */

    const handleClick = (
      e: MouseEvent
    ) => {
      const target = e.target;

      if (!(target instanceof Element)) {
        return;
      }

      /*
       * Si clickeamos cualquier elemento
       * dentro de una card, desaparece YA.
       */
      if (target.closest(targetSelector)) {
        hideTooltip(true);
      }
    };

    /*
     * ==============================
     * SCROLL
     * ==============================
     */

    const handleScroll = () => {
      if (!isVisible.current) return;

      const el =
        document.elementFromPoint(
          lastMousePos.current.x,
          lastMousePos.current.y
        );

      if (
        !el ||
        !el.closest(targetSelector)
      ) {
        hideTooltip();
      }
    };

    /*
     * ==============================
     * WINDOW LEAVE
     * ==============================
     */

    const handleWindowLeave = () => {
      hideTooltip();
    };

    document.addEventListener(
      "mousemove",
      handleMove
    );

    document.addEventListener(
      "mouseenter",
      handleEnter,
      true
    );

    document.addEventListener(
      "mouseleave",
      handleLeave,
      true
    );

    document.addEventListener(
      "click",
      handleClick,
      true
    );

    document.documentElement.addEventListener(
      "mouseleave",
      handleWindowLeave
    );

    window.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      }
    );

    return () => {
      cancelAnimationFrame(
        rafRef.current
      );

      document.removeEventListener(
        "mousemove",
        handleMove
      );

      document.removeEventListener(
        "mouseenter",
        handleEnter,
        true
      );

      document.removeEventListener(
        "mouseleave",
        handleLeave,
        true
      );

      document.removeEventListener(
        "click",
        handleClick,
        true
      );

      document.documentElement.removeEventListener(
        "mouseleave",
        handleWindowLeave
      );

      window.removeEventListener(
        "scroll",
        handleScroll
      );

      gsap.killTweensOf(tooltip);
    };
  }, [
    gsap,
    targetSelector,
  ]);

  return (
    <div
      ref={tooltipRef}
      className="cursor-tooltip"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 9999,
      }}
    >
      <span>{label}</span>

      <Svg variant="ArrowClassic" />
    </div>
  );
}