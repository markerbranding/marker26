// src/app/globals/data/testimonials.data.ts
export type TestimonialBase = {
  key: string;           // id para i18n: "clientA", "clientB"...
  author: string;
  company: string;
  logo: string;          // ruta pública /logos/...
};

export const testimonials: TestimonialBase[] = [
  {
    key: "linmex",
    author: "Carlos Alcocer",
    company: "Grupo Linmex",
    logo: "/testimonial/linmex.jpg",
  },
  {
    key: "emeka",
    author: "Fernando Mantecón",
    company: "Emeká",
    logo: "/testimonial/emeka.jpg",
  },
  {
    key: "setgo",
    author: "Tomás González",
    company: "Setgo",
    logo: "/testimonial/setgo.jpg",
  },
  {
    key: "haustiere",
    author: "Luis May",
    company: "Haustiere",
    logo: "/testimonial/haustiere.jpg",
  },
  // ...
];