"use client";

import { useEffect } from "react";

type Props = {
  color: string;
  navMode?: "light" | "dark";
};

export default function PageBackgroundSetter({ color, navMode }: Props) {
  useEffect(() => {
    const root = document.documentElement;
    const nav = document.querySelector("body");
    const main = document.querySelector("main");

    // Guardamos colores previos para restaurarlos
    const prevColor = root.style.getPropertyValue("--page-bg-color");

    // Aplicamos el nuevo color de fondo
    root.style.setProperty("--page-bg-color", color);

    // Manejo del nav según navMode
    if (nav) {
      // Quitamos clases anteriores si existían
      nav.classList.remove("light", "dark");

      // Si se pasa navMode, agregamos la clase correspondiente
      if (navMode) {
        nav.classList.add(`${navMode}`);
      }
    }

    // Cleanup al cambiar de página
    return () => {
      if (prevColor) {
        root.style.setProperty("--page-bg-color", prevColor);
      }

      if (nav) {
        nav.classList.remove("light", "dark");
      }
    };
  }, [color, navMode]);

  return null;
}