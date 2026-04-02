"use client";

import {
  ReactNode,
  useEffect,
  useRef,
  useState,
  createContext,
  useContext
} from "react";
import Lenis from "@studio-freight/lenis";

type LenisProviderProps = {
  children: ReactNode;
};

// Contexto para compartir la instancia de Lenis
const LenisContext = createContext<Lenis | null>(null);

// Hook para consumirla en cualquier componente cliente
export function useLenis() {
  return useContext(LenisContext);
}

export default function LenisProvider({children}: LenisProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);
  const rafRef = useRef<number | null>(null);

  // Estado para forzar re-render cuando creamos / destruimos Lenis
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    function startLenis() {
      if (lenisRef.current) return; // Ya está activo

      const instance = new Lenis({
        lerp: 0.1,
        duration: 1.2,
        wheelMultiplier: 1,
        touchMultiplier: 1,
        smoothWheel: true
      });

      lenisRef.current = instance;
      setLenis(instance);

      const raf = (time: number) => {
        instance.raf(time);
        rafRef.current = requestAnimationFrame(raf);
      };

      rafRef.current = requestAnimationFrame(raf);
    }

    function stopLenis() {
      if (!lenisRef.current) return; // Ya está apagado

      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      lenisRef.current.destroy();
      lenisRef.current = null;
      rafRef.current = null;
      setLenis(null);
    }

    // Activar/desactivar según resolución
    function handleResize() {
      const isDesktop = window.innerWidth > 1024;

      if (isDesktop) {
        startLenis();
      } else {
        stopLenis();
      }
    }

    // Ejecutar al cargar
    handleResize();

    // Escuchar cambios de tamaño
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      stopLenis();
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}