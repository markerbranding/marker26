"use client";

import {useMemo, useRef, useState, useEffect} from "react";
import {useTranslations} from "next-intl";
import "./filter.css";
import ProjectCard, {
  type ProjectCardProps
} from "@/app/globals/components/cards/ProjectCard";
import {useGsapCore} from "@/app/globals/lib/gsapClient";
import {useIsomorphicLayoutEffect} from "@/app/globals/hooks/useIsomorphicLayoutEffect";

export type ProjectCardWithMeta = ProjectCardProps & {
  categoryKey: string;
  sectorKey: string;
  createdAt: string; // ISO date
  sector: string;
  featuredInGrid?: boolean;
};

type Option = {
  key: string;
  label: string;
};

type Props = {
  projects: ProjectCardWithMeta[];
  categories: Option[];
  sectors: Option[];
};

const PAGE_SIZE = 9; // 5 + 4

// 👉 hacemos la función genérica para poder usar globalIndex también
function groupProjectsAlternating<T extends {slug: string}>(
  projects: T[],
  sizes = [5, 4]
): T[][] {
  const groups: T[][] = [];
  let i = 0;
  let sizeIndex = 0;

  while (i < projects.length) {
    const size = sizes[sizeIndex];
    const slice = projects.slice(i, i + size);
    if (!slice.length) break;

    groups.push(slice);
    i += slice.length;
    sizeIndex = (sizeIndex + 1) % sizes.length;
  }

  return groups;
}

function reorderGroupForFeatured<T extends {featuredInGrid?: boolean}>(
  group: T[],
  rowIndex: number
): T[] {
  if (group.length !== 5) return group;

  const featuredIndex = group.findIndex((p) => p.featuredInGrid);
  if (featuredIndex === -1) return group;

  const domIndex = rowIndex + 1;
  const isOddRow = rowIndex % 2 === 0;

  const isPatternB = isOddRow && (domIndex - 3) % 4 === 0;
  const targetPos = isPatternB ? 0 : 2;

  if (featuredIndex === targetPos) return group;

  const clone = [...group];
  const [featured] = clone.splice(featuredIndex, 1);
  clone.splice(targetPos, 0, featured);

  return clone;
}

export default function ProjectsFilterGrid({
  projects,
  categories,
  sectors
}: Props) {
  const tList = useTranslations("ProjectsList");
  const {gsap} = useGsapCore();

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSector, setSelectedSector] = useState("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "az">("newest");

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [lastAnimatedCount, setLastAnimatedCount] = useState(PAGE_SIZE);

  const rootRef = useRef<HTMLElement | null>(null);
  const filtersRef = useRef<HTMLDivElement | null>(null);
  const rowsRef = useRef<HTMLDivElement | null>(null);

  const filtersAnimatedRef = useRef(false);

  // 🔁 Cuando cambian filtros / orden, reseteamos paginación + animación
  useEffect(() => {
    const initial = Math.min(PAGE_SIZE, projects.length);
    setVisibleCount(initial);
    setLastAnimatedCount(initial); // el primer batch no se considera "nuevo"
  }, [selectedCategory, selectedSector, sortBy, projects.length]);

  // ⭐ Animación inicial cuando cambia filtro/orden
  useIsomorphicLayoutEffect(() => {
    if (!rootRef.current || !gsap) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // 👉 Filtros: solo se animan la PRIMERA vez
      if (filtersRef.current && !filtersAnimatedRef.current) {
        tl.from(filtersRef.current, {
          opacity: 0,
          y: 20,
          duration: 0.5,
        });
        filtersAnimatedRef.current = true;
      }

      // 👉 Cards: se pueden animar cada vez que cambias filtros/orden
      if (rowsRef.current) {
        const items = rowsRef.current.querySelectorAll(".card");
        if (items.length) {
          tl.from(
            items,
            {
              opacity: 0,
              y: 20,
              duration: 0.5,
              stagger: 0.05,
            },
            filtersAnimatedRef.current ? 0 : "-=0.2" 
            // si los filtros no se animaron, solapamos animación;
            // si ya se animaron antes, arrancamos normal
          );
        }
      }
    }, rootRef);

    return () => ctx.revert();
  }, [gsap, selectedCategory, selectedSector, sortBy]);

  // ⭐ Filtro + sort
  const filteredProjects = useMemo(() => {
    let result = [...projects];

    if (selectedCategory !== "all") {
      result = result.filter((p) => p.categoryKey === selectedCategory);
    }

    if (selectedSector !== "all") {
      result = result.filter((p) => p.sectorKey === selectedSector);
    }

    if (sortBy === "newest" || sortBy === "oldest") {
      result.sort((a, b) => {
        const da = new Date(a.createdAt).getTime();
        const db = new Date(b.createdAt).getTime();
        return sortBy === "newest" ? db - da : da - db;
      });
    } else if (sortBy === "az") {
      result.sort((a, b) => a.client.localeCompare(b.client));
    }

    return result;
  }, [projects, selectedCategory, selectedSector, sortBy]);

  // 👉 limitamos por visibleCount
  const visibleProjects = useMemo(
    () => filteredProjects.slice(0, visibleCount),
    [filteredProjects, visibleCount]
  );

  // 👉 les añadimos un índice global para saber quién es "nuevo"
  type ProjectWithIndex = ProjectCardWithMeta & {globalIndex: number};

  const visibleWithIndex: ProjectWithIndex[] = useMemo(
    () =>
      visibleProjects.map((p, idx) => ({
        ...p,
        globalIndex: idx
      })),
    [visibleProjects]
  );

  // 👉 agrupamos los que ya tienen globalIndex
  const groupedProjects = useMemo(
    () => groupProjectsAlternating<ProjectWithIndex>(visibleWithIndex, [5, 4]),
    [visibleWithIndex]
  );

  const isEmpty = filteredProjects.length === 0;
  const hasMore = visibleCount < filteredProjects.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => {
      const next = Math.min(prev + PAGE_SIZE, filteredProjects.length);
      // lo que ya estaba visible pasa a ser "no nuevo"; lo siguiente sí
      setLastAnimatedCount(prev);
      return next;
    });
  };

  // ⭐ Animar SOLO los `.card--new` cuando cambie visibleCount
  useIsomorphicLayoutEffect(() => {
    if (!rowsRef.current || !gsap) return;

    const newCards = rowsRef.current.querySelectorAll(".card--new");

    if (newCards.length > 0) {
      gsap.from(newCards, {
        opacity: 0,
        y: 20,
        duration: 0.5,
        stagger: 0.05,
        ease: "power3.out",
        onComplete: () => {
          newCards.forEach((el) => el.classList.remove("card--new"));
        }
      });
    }
  }, [visibleCount, lastAnimatedCount, gsap]);

  return (
    <section className="section__projects" ref={rootRef}>
      {/* Filtros */}
      <div className="projects__filters" ref={filtersRef}>
        {/* Categoría */}
        <div className="filter__wrapper">
          <div className="projects__filter__select">
            <label
              htmlFor="projectFilterCategory"
              className="projects__filter__label"
            >
              {tList("filterCategoryLabel")}
            </label>
            <select
              id="projectFilterCategory"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="projects__filter__dropdown"
            >
              <option value="all">{tList("filterAll")}</option>
              {categories.map((cat) => (
                <option key={cat.key} value={cat.key}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sector */}
          <div className="projects__filter__select">
            <label
              htmlFor="projectFilterSector"
              className="projects__filter__label"
            >
              {tList("filterSectorLabel")}
            </label>
            <select
              id="projectFilterSector"
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="projects__filter__dropdown"
            >
              <option value="all">{tList("filterAll")}</option>
              {sectors.map((sector) => (
                <option key={sector.key} value={sector.key}>
                  {sector.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Orden */}
        <div className="projects__filter__select">
          <label htmlFor="projectSort" className="projects__filter__label">
            {tList("sortLabel")}
          </label>
          <select
            id="projectSort"
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as "newest" | "oldest" | "az")
            }
            className="projects__filter__dropdown"
          >
            <option value="newest">{tList("sortNewest")}</option>
            <option value="oldest">{tList("sortOldest")}</option>
            <option value="az">{tList("sortAZ")}</option>
          </select>
        </div>
      </div>

      {/* Grid / filas dinámicas */}
      {isEmpty ? (
        <p className="projects__empty">{tList("empty")}</p>
      ) : (
        <>
          <div className="projects__rows" ref={rowsRef}>
            {groupedProjects.map((group, index) => {
              const isOddRow = index % 2 === 0;
              const arrangedGroup = reorderGroupForFeatured(group, index);

              return (
                <div
                  key={`group-${index}`}
                  className={`projects__row projects__row--${group.length} ${
                    isOddRow ? "projects__row--odd" : "projects__row--even"
                  }`}
                >
                  {arrangedGroup.map((project) => (
                    <ProjectCard
                      key={project.slug}
                      slug={project.slug}
                      client={project.client}
                      category={project.category}
                      cardDescription={project.cardDescription}
                      thumbnail={project.thumbnail}
                      isNew={project.globalIndex >= lastAnimatedCount}
                    />
                  ))}
                </div>
              );
            })}
          </div>

          {hasMore && (
            <div className="projects__load-more">
              <button
                type="button"
                className="projects__load-more-btn"
                onClick={handleLoadMore}
              >
                {tList("loadMore")}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}