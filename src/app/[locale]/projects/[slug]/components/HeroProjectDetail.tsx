"use client";

import {useRef} from "react";
import Link from "next/link";
import Image from "next/image";
import {useGsapCore} from "@/app/globals/lib/gsapClient";
import {useIsomorphicLayoutEffect} from "@/app/globals/hooks/useIsomorphicLayoutEffect";

type ProjectHeroProps = {
  locale: string;
  projectColor2: string;
  cover: string;
  data: {
    category: string;
    title: string;
    client: string;
    description: string;
    sector: string;
  };
  labels: {
    section: string;
    titleDescription: string;
  };
};

export default function HeroProjectDetail({
  locale,
  projectColor2,
  cover,
  data,
  labels,
}: ProjectHeroProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const {gsap} = useGsapCore();

  useIsomorphicLayoutEffect(() => {
    if (!rootRef.current) return;

    const ctx = gsap.context(() => {
      // top (breadcrumb + cliente + h1)
      gsap.from(".project-hero__top", {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
      });

      // columna meta (sector + descripción)
      gsap.from(".project-hero__meta", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.15,
      });

      // imagen principal
      gsap.from(".project-hero__image", {
        opacity: 0,
        y: 20,
        duration: 0.9,
        ease: "power3.out",
        delay: 0.25,
      });
    }, rootRef);

    return () => ctx.revert();
  }, [gsap]);

  return (
    <section className="section__hero" ref={rootRef}>
      <div className="column__1 col__top project-hero__top">
        <div className="breadcrumb">
          <span>
            <Link href={`/${locale}/projects`}>{labels.section}</Link>
            {" / "} {data.category} {" / "}
          </span>
        </div>
        <h3 style={{color: projectColor2}}>Cliente</h3>
        <h1 className="project__title">{data.client}</h1>
      </div>

      <div className="column__2 project-hero__meta">
        <div className="col__left">
          <h3 style={{color: projectColor2}}>Sector</h3>
          <p className="project__description">{data.sector}</p>
        </div>
        <div className="col__right">
          <h3 style={{color: projectColor2}}>{labels.titleDescription}</h3>
          <p className="project__description">{data.description}</p>
        </div>
      </div>

      <div className="column__1 col__bottom">
        <Image
          className="project-hero__image"
          src={cover}
          alt={data.title}
          width={1920}
          height={1080}
          priority
          sizes="(min-width: 1024px) 100vw, 100vw"
        />
      </div>
    </section>
  );
}