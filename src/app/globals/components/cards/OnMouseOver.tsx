"use client";

import "./OnMouseOver.scss";
import { useEffect, useRef } from "react";
import { useGsapCore } from "@/app/globals/lib/gsapClient";

type CursorTooltipProps = {
    label?: string;
    targetSelector?: string;
};

export default function CursorTooltip({
    label = "Abrir proyecto",
    targetSelector = ".card",
}: CursorTooltipProps) {
    const tooltipRef = useRef<HTMLDivElement | null>(null);
    const { gsap } = useGsapCore();
    const rafRef = useRef<number>(0);
    const mousePos = useRef({ x: 0, y: 0 });
    const currentPos = useRef({ x: 0, y: 0 }); // ← posición actual del tooltip
    const lastMousePos = useRef({ x: 0, y: 0 });
    const isVisible = useRef(false);

    useEffect(() => {
        if (!gsap || !tooltipRef.current) return;

        const tooltip = tooltipRef.current;

        gsap.set(tooltip, { autoAlpha: 0, scale: 0.8, xPercent: 0, yPercent: 0 });

        const LERP = 0.1;
        const OFFSET = 12; // distancia al cursor en px

        const loop = () => {
            currentPos.current.x += (mousePos.current.x - currentPos.current.x) * LERP;
            currentPos.current.y += (mousePos.current.y - currentPos.current.y) * LERP;

            const tooltipW = tooltip.offsetWidth;
            const tooltipH = tooltip.offsetHeight;
            const winW = window.innerWidth;
            const winH = window.innerHeight;

            // Por defecto el tooltip va a la derecha y abajo del cursor
            let x = currentPos.current.x + OFFSET;
            let y = currentPos.current.y + OFFSET;

            // Si se sale por la derecha → lo mueve a la izquierda del cursor
            if (x + tooltipW > winW) {
                x = currentPos.current.x - tooltipW - OFFSET;
            }

            // Si se sale por abajo → lo mueve arriba del cursor
            if (y + tooltipH / 2 > winH) {
                y = currentPos.current.y - tooltipH / 2 - OFFSET;
            }

            gsap.set(tooltip, { x, y });

            rafRef.current = requestAnimationFrame(loop);
        };
        rafRef.current = requestAnimationFrame(loop);

        const onMouseEnter = () => {
            isVisible.current = true;
            gsap.killTweensOf(tooltip);
            gsap.to(tooltip, {
                autoAlpha: 1,
                scale: 1,
                duration: 0.2,
                ease: "power2.out",
            });
        };

        const onMouseLeave = () => {
            isVisible.current = false;
            gsap.killTweensOf(tooltip);
            gsap.to(tooltip, {
                autoAlpha: 0,
                scale: 0,
                duration: 0.2,
                ease: "power2.in",
            });
        };

        const handleMove = (e: MouseEvent) => {
            mousePos.current = { x: e.clientX, y: e.clientY };
            lastMousePos.current = { x: e.clientX, y: e.clientY };
        };

        const handleEnter = (e: MouseEvent) => {
            const target = e.target;
            if (!(target instanceof Element)) return;
            if (target.closest(targetSelector)) {
                // Sincroniza posición actual con el mouse para evitar el salto inicial
                currentPos.current.x = mousePos.current.x;
                currentPos.current.y = mousePos.current.y;
                onMouseEnter();
            }
        };

        const handleLeave = (e: MouseEvent) => {
            const target = e.target;
            if (!(target instanceof Element)) return;
            if (target.closest(targetSelector)) {
                const related = e.relatedTarget as Element | null;
                if (!related || !target.closest(targetSelector)?.contains(related)) {
                onMouseLeave();
                }
            }
        };

        const handleScroll = () => {
            if (!isVisible.current) return;
            const el = document.elementFromPoint(
                lastMousePos.current.x,
                lastMousePos.current.y
            );
            if (!el || !el.closest(targetSelector)) {
                onMouseLeave();
            }
        };

        document.addEventListener("mousemove", handleMove);
        document.addEventListener("mouseenter", handleEnter, true);
        document.addEventListener("mouseleave", handleLeave, true);
        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            cancelAnimationFrame(rafRef.current);
            document.removeEventListener("mousemove", handleMove);
            document.removeEventListener("mouseenter", handleEnter, true);
            document.removeEventListener("mouseleave", handleLeave, true);
            window.removeEventListener("scroll", handleScroll);
        };
    }, [gsap, targetSelector]);

    return (
        <div
        ref={tooltipRef}
        style={{
            position: "fixed",
            top: -60,
            left: 0,
            pointerEvents: "none",
            zIndex: 9999,
        }}
        className="cursor-tooltip"
        >
            <span>{label}</span>
        </div>
    );
}