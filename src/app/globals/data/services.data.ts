// src/app/globals/data/services.data.ts

export type ServiceBase = {
  index?: string;
  key: "branding" | "identity" | "web" | "marketing";
  slug: string;              // parte de la URL: /services/branding
  color: string;             // opcional: para usar en cards / detalle
  icon?: string;             // opcional: nombre de ícono o lo que uses
  featured?: boolean;        // opcional: para destacar alguno
};

export const services: ServiceBase[] = [
  {
    index: "01.",
    key: "branding",
    slug: "branding",
    color: "#0e1d3b",
    featured: true,
  },
  {
    index: "02.",
    key: "identity",
    slug: "identity",
    color: "#f7bc33",
  },
  {
    index: "03.",
    key: "web",
    slug: "web",
    color: "#34c351",
  },
  {
    index: "04.",
    key: "marketing",
    slug: "marketing",
    color: "#ff5a5f",
  },
];

export function getServiceBySlug(slug: string) {
  return services.find((s) => s.slug === slug) ?? null;
}

export function getAllServiceSlugs() {
  return services.map((s) => s.slug);
}