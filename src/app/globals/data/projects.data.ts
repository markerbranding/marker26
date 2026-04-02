// src/app/globals/data/projects.data.ts
import type { StaticImageData } from "next/image";

// SUHISSA
import suhissa1 from "@public/projects/suhissa/suhissa_logo_bordado_blanco.jpg";
import suhissa2 from "@public/projects/suhissa/suhissa_logo_bordado_azul.jpg";
import suhissa3 from "@public/projects/suhissa/suhissa_tarjetas.jpg";
import suhissa4 from "@public/projects/suhissa/suhissa_papeleria_tubos.jpg";
import suhissa5 from "@public/projects/suhissa/suhissa_sobrepluma.jpg";
import suhissa6 from "@public/projects/suhissa/suhissa_uniforme_blanco.jpg";
import suhissa7 from "@public/projects/suhissa/suhissa_uniforme.jpg";
import suhissa8 from "@public/projects/suhissa/suhissa_gorra.jpg";
import suhissa9 from "@public/projects/suhissa/suhissa_cascos.jpg";
import suhissa10 from "@public/projects/suhissa/suhissa_tazas.jpg";
import suhissa11 from "@public/projects/suhissa/suhissa_sistemas.jpg";
import suhissa12 from "@public/projects/suhissa/suhissa_gorra.jpg";
import suhissa13 from "@public/projects/suhissa/suhissa_gorra.jpg";
import suhissa14 from "@public/projects/suhissa/suhissa_vehiculos.jpg";

// EMEKA
import emeka1 from "@public/projects/emeka/emeka_web1.jpg";
import emeka2 from "@public/projects/emeka/emeka_web2.jpg";
import emeka3 from "@public/projects/emeka/emeka_web3.jpg";
import emeka4 from "@public/projects/emeka/emeka_web4.jpg";
import emeka5 from "@public/projects/emeka/emeka_web5.jpg";
import emeka6 from "@public/projects/emeka/emeka_web6.jpg";
import emeka7 from "@public/projects/emeka/emeka_web7.jpg";
import emeka8 from "@public/projects/emeka/emeka_web8.jpg";
import emeka9 from "@public/projects/emeka/emeka_web9.jpg";

// ARMARIUS
import armarius1 from "@public/projects/armarius/armarius_espectacular.jpg";

// FITPADEL
import fitpadel1 from "@public/projects/fitpadel/fitpadel_agenda_carpeta.jpg";

// FOTOIDEAS
import fotoideas1 from "@public/projects/fotoideas/fotoideas_anuncio.jpg";

// GRANDMARINA
import grandmarina1 from "@public/projects/grandmarina/grandmarina_bitacora_triptico.jpg";

// Haustiere
import haustiere1 from "@public/projects/haustiere/hasutiere_almohadilla.jpg";

// iotam
import iotam1 from "@public/projects/iotam/iotam_web1.jpg";

// linmex
import linmex1 from "@public/projects/linmex/linmex_folder.jpg";

// nervo
import nervo1 from "@public/projects/nervo/nervo_bordado.jpg";




export type ProjectBase = {
  slug: string;
  color: string;
  color2: string;
  navMode?: "light" | "dark";
  thumbnail: string;   // string para usar /projects/... con next/image
  cover: string;
  introImage: string;
  gallery: StaticImageData[]; // 👈 ahora solo static
  categoryKey: string;
  sectorKey: string;
  createdAt: string;
  featuredInGrid?: boolean;
  featuredInHome?: boolean;
  homeOrder?: number;
};

export const projects: ProjectBase[] = [
  {
    slug: "suhissa",
    color: "#0e1d3b",
    color2: "#34c351",
    navMode: "dark",
    thumbnail: "/projects/suhissa/thumb.jpg",
    cover: "/projects/suhissa/suhissa_foto_fachada.jpg",
    introImage: "/projects/suhissa/suhissa_foto_fachada.jpg",
    gallery: [suhissa1, suhissa2, suhissa3, suhissa4, suhissa5, suhissa6, suhissa7, suhissa8, suhissa9, suhissa10, suhissa11, suhissa12, suhissa13, suhissa14],
    categoryKey: "branding",
    sectorKey: "industrial",
    createdAt: "2024-11-01",
    featuredInGrid: false,
    featuredInHome: true,
    homeOrder: 1
  },
  {
    slug: "emeka",
    color: "#f7bc33",
    color2: "#66421dff",
    navMode: "light",
    thumbnail: "/projects/emeka/thumb.jpg",
    cover: "/projects/emeka/emeka_departamentos.jpg",
    introImage: "/projects/emeka/emeka_departamentos.jpg",
    gallery: [emeka1, emeka2, emeka3, emeka4, emeka5, emeka6, emeka7, emeka8, emeka9],
    categoryKey: "web",
    sectorKey: "real-estate",
    createdAt: "2024-05-10",
    featuredInGrid: false,
    featuredInHome: true,
    homeOrder: 2
  },
  {
    slug: "armarius",
    color: "#f7bc33",
    color2: "#66421dff",
    navMode: "light",
    thumbnail: "/projects/armarius/thumb.jpg",
    cover: "/projects/armarius/armarius_espectacular.jpg",
    introImage: "/projects/armarius/armarius_espectacular.jpg",
    gallery: [armarius1],
    categoryKey: "branding",
    sectorKey: "furniture",
    createdAt: "2023-05-10",
    featuredInGrid: false
  },
  {
    slug: "fitpadel",
    color: "#0e1d3b",
    color2: "#34c351",
    navMode: "dark",
    thumbnail: "/projects/fitpadel/thumb.jpg",
    cover: "/projects/fitpadel/fitpadel_agenda_carpeta.jpg",
    introImage: "/projects/fitpadel/fitpadel_agenda_carpeta.jpg",
    gallery: [fitpadel1],
    categoryKey: "branding",
    sectorKey: "padel",
    createdAt: "2024-11-01",
    featuredInGrid: false
  },
  {
    slug: "fotoideas",
    color: "#0e1d3b",
    color2: "#34c351",
    navMode: "dark",
    thumbnail: "/projects/fotoideas/thumb.jpg",
    cover: "/projects/fotoideas/fotoideas_anuncio.jpg",
    introImage: "/projects/fotoideas/fotoideas_anuncio.jpg",
    gallery: [fotoideas1],
    categoryKey: "branding",
    sectorKey: "printing",
    createdAt: "2024-11-01",
    featuredInGrid: false
  },
  {
    slug: "grandmarina",
    color: "#0e1d3b",
    color2: "#34c351",
    navMode: "dark",
    thumbnail: "/projects/grandmarina/thumb.jpg",
    cover: "/projects/grandmarina/grandmarina_bitacora_triptico.jpg",
    introImage: "/projects/grandmarina/grandmarina_bitacora_triptico.jpg",
    gallery: [grandmarina1],
    categoryKey: "branding",
    sectorKey: "club",
    createdAt: "2024-11-01",
    featuredInGrid: false,
    featuredInHome: true,
    homeOrder: 3
  },
  {
    slug: "haustiere",
    color: "#0e1d3b",
    color2: "#34c351",
    navMode: "dark",
    thumbnail: "/projects/haustiere/thumb.jpg",
    cover: "/projects/haustiere/hasutiere_almohadilla.jpg",
    introImage: "/projects/haustiere/hasutiere_almohadilla.jpg",
    gallery: [haustiere1],
    categoryKey: "branding",
    sectorKey: "veterinary",
    createdAt: "2024-11-01",
    featuredInGrid: false
  },
  {
    slug: "iotam",
    color: "#f7bc33",
    color2: "#66421dff",
    navMode: "light",
    thumbnail: "/projects/iotam/thumb.jpg",
    cover: "/projects/iotam/iotam_web1.jpg",
    introImage: "/projects/iotam/iotam_web1.jpg",
    gallery: [iotam1],
    categoryKey: "web",
    sectorKey: "real-estate",
    createdAt: "2024-05-10",
    featuredInGrid: false,
    featuredInHome: true,
    homeOrder: 4
  },
  {
    slug: "linmex",
    color: "#0e1d3b",
    color2: "#34c351",
    navMode: "dark",
    thumbnail: "/projects/linmex/thumb.jpg",
    cover: "/projects/linmex/linmex_folder.jpg",
    introImage: "/projects/linmex/linmex_folder.jpg",
    gallery: [linmex1],
    categoryKey: "branding",
    sectorKey: "real-estate",
    createdAt: "2024-11-01",
    featuredInGrid: false,
    featuredInHome: true,
    homeOrder: 5
  },
  {
    slug: "nervo",
    color: "#0e1d3b",
    color2: "#34c351",
    navMode: "dark",
    thumbnail: "/projects/nervo/thumb.jpg",
    cover: "/projects/nervo/nervo_bordado.jpg",
    introImage: "/projects/nervo/nervo_bordado.jpg",
    gallery: [nervo1],
    categoryKey: "branding",
    sectorKey: "real-estate",
    createdAt: "2024-11-01",
    featuredInGrid: false,
    featuredInHome: true,
    homeOrder: 6
  },
];

export function getProjectBySlug(slug: string) {
  return projects.find((p) => p.slug === slug) ?? null;
}

export function getAllSlugs() {
  return projects.map((p) => p.slug);
}