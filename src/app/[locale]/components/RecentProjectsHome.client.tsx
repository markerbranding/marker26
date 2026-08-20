"use client";

import { useRef } from "react";
import { useGsapCore } from "@/app/globals/lib/gsapClient";
import { useIsomorphicLayoutEffect } from "@/app/globals/hooks/useIsomorphicLayoutEffect";
import { useTranslations, useLocale } from "next-intl";
import AnimatedButton from "@/app/globals/components/buttons/AnimatedButton";

type Props = {
  children: React.ReactNode;
};

export default function RecentProjectsHomeClient({ children }: Props) {
    const tHome = useTranslations("Home");
    const rootRef = useRef<HTMLElement | null>(null);
    const bgRef = useRef<HTMLDivElement | null>(null);
    const h3Ref = useRef<HTMLHeadingElement | null>(null);
    const { gsap } = useGsapCore();
    const locale = useLocale();

    useIsomorphicLayoutEffect(() => {
        if (!rootRef.current || !bgRef.current || !h3Ref.current) return;

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

        return () => ctx.revert();
  }, [gsap]);

  return (
    <section ref={rootRef} className="recent__projects">
        <div className="column__1 fadeInOut">
            <h3 ref={h3Ref} className="prefix">{tHome("recentProjectsPrefix")}</h3>
            <h2>{tHome("recentProjectsTitle")}</h2>
        </div>
        <div className="column__1">
            {children}
        </div>
        <div className="column__1 col__btn">
            <AnimatedButton label={tHome("recentProjectsCta")} href={`/${locale}/projects/`} className="btn__red" />
        </div>
    </section>
  );
}