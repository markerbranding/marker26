"use client";

import {useRef} from "react";
import {useTranslations} from "next-intl";
import {useGsapCore} from "@/app/globals/lib/gsapClient";
import {useIsomorphicLayoutEffect} from "@/app/globals/hooks/useIsomorphicLayoutEffect";
import { clients } from "@/app/globals/data/clients.data";
import Image from "next/image";

export default function ClientsHome() {
    const t = useTranslations("Clients");
    
    const rootRef = useRef<HTMLDivElement | null>(null);
    const bgRef = useRef<HTMLDivElement | null>(null);
    const h3Ref = useRef<HTMLHeadingElement | null>(null);
    const h2Ref = useRef<HTMLHeadingElement | null>(null);
    const {gsap} = useGsapCore();
  
    useIsomorphicLayoutEffect(() => {
        
        if (!rootRef.current) return;
  
        const ctx = gsap.context(() => {

            gsap.from(bgRef.current, {
                width: "0%",
                transformOrigin: "right",
                ease: "power4.out",
                scrollTrigger: {
                    trigger: rootRef.current,
                    start: "top 95%",
                    end: "top 55%",
                    scrub: true,
                }
            });
            }, rootRef);

            gsap.from(h3Ref.current, {
                opacity: 0,
                ease: "power4.out",
                scrollTrigger: {
                    trigger: h3Ref.current,
                    start: "top 85%",
                    end: "top 55%",
                    scrub: true,
                }
            })

            gsap.from(h2Ref.current, {
                opacity: 0,
                ease: "power4.out",
                scrollTrigger: {
                    trigger: h3Ref.current,
                    start: "top 80%",
                    end: "top 50%",
                    scrub: true,
                }
            })
        
    
            return () => ctx.revert();
        }, [gsap]);

  return (
    <section className="section__clients" ref={rootRef}>
        <div ref={bgRef} className="bg" />
        <div className="column__1">
            <h3 ref={h3Ref} className="prefix">{t("clientsTitle")}</h3>
            <h2 ref={h2Ref}>{t("clientsSubtitle")}</h2>
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