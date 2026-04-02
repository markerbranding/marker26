// src/app/globals/data/horizontalScroll.data.ts
export type HorizontalScrollItem = {
  key: string;        // clave para traducciones
  img: string;        // ruta public o URL
  alt?: string;       // opcional (si no, usamos el title traducido)
};

export type HorizontalScrollData = {
  titleKey: string;   // ej: "title.h2"
  textKey: string;    // ej: "title.p"
  items: HorizontalScrollItem[];
};

// Ejemplo:
export const homeHorizontalScroll: HorizontalScrollData = {
  titleKey: "title.h2",
  textKey: "title.p",
  items: [
    { key: "item1", img: "/images/hs/1.jpg" },
    { key: "item2", img: "/images/hs/2.jpg" },
    { key: "item3", img: "/images/hs/3.jpg" },
  ],
};