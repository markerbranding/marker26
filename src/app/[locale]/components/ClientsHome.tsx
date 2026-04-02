"use client";

import {useRef} from "react";
import {useTranslations} from "next-intl";
import {useGsapCore} from "@/app/globals/lib/gsapClient";
import {useIsomorphicLayoutEffect} from "@/app/globals/hooks/useIsomorphicLayoutEffect";
import { clients } from "@/app/globals/data/clients.data";
import Image from "next/image";

export default function ClientsHome() {
    const t = useTranslations("Clients");
    
    const rootRef = useRef<HTMLDivElement | null>(null);/*
    const {gsap} = useGsapCore();
  
    useIsomorphicLayoutEffect(() => {
      if (!rootRef.current) return;
  
      const ctx = gsap.context(() => {
          gsap.from(".hero__title", {
              y: 40,
              opacity: 0,
              duration: 0.9,
              ease: "power3.out",
          });
  
          gsap.from(".hero__subtitle", {
              y: 20,
              opacity: 0,
              duration: 0.8,
              ease: "power3.out",
              delay: 0.15,
          });
  
          gsap.from(".hero__video", {
              opacity: 0,
              scale: 1.03,
              duration: 1.1,
              ease: "power3.out",
              delay: 0.2,
          });
      }, rootRef);
  
      return () => ctx.revert();
    }, [gsap]);*/

  return (
    <section className="section__clients" ref={rootRef}>
      <div className="column__1">
        <h3 className="prefix">{t("clientsTitle")}</h3>
        <h2>{t("clientsSubtitle")}</h2>
        <ul className="listado fadeCards">
        {clients.map((item) => {
            const data = t.raw(`items.${item.key}`) as { company: string };

            return (
                <li className="card client__card" key={item.key}>
                    <Image
                        src={item.logo}
                        alt={data.company}
                        width={100}
                        height={100}
                    />
                </li>
            
            );
        })}
        </ul>
      </div>
    </section>
  );
}