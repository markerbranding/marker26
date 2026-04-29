"use client";

import "./ScrollVideo.scss";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useGsapCore } from "@/app/globals/lib/gsapClient";
import { useIsomorphicLayoutEffect } from "@/app/globals/hooks/useIsomorphicLayoutEffect";
import { useTranslations, useLocale } from "next-intl";
import { services } from "@/app/globals/data/services.data";

type ScrollVideoProps = {
  src: string;
  mobileSrc?: string;
  poster?: string;
  className?: string;
};

export default function ScrollVideo({
  src,
  mobileSrc,
  poster,
  className = ""
}: ScrollVideoProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoWrapperRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const leftRef = useRef<HTMLDivElement | null>(null);

  const { gsap, ScrollTrigger } = useGsapCore();

  const [metadataReady, setMetadataReady] = useState(false);
  const [videoSrc, setVideoSrc] = useState(src);

  const tServices = useTranslations("Services");
  const locale = useLocale();

  // Elegir video desktop / móvil
  useEffect(() => {
    const updateVideoSrc = () => {
      const isMobile = window.innerWidth <= 1024;
      setVideoSrc(isMobile && mobileSrc ? mobileSrc : src);
      setMetadataReady(false);
    };

    updateVideoSrc();

    window.addEventListener("resize", updateVideoSrc);
    return () => window.removeEventListener("resize", updateVideoSrc);
  }, [src, mobileSrc]);

  // Metadata del video
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !ScrollTrigger) return;

    const initVideoMetadata = () => {
      video.pause();
      video.currentTime = 0;

      // 🔥 FIX iOS
      video.muted = true;
      video.play().then(() => {
        video.pause();
      }).catch(() => {});

      setMetadataReady(true);

      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    };

    video.load();

    if (video.readyState >= 1) {
      initVideoMetadata();
    } else {
      video.addEventListener("loadedmetadata", initVideoMetadata);

      return () => {
        video.removeEventListener("loadedmetadata", initVideoMetadata);
      };
    }
  }, [ScrollTrigger, videoSrc]);

  // ScrollTrigger solo controla currentTime, sin pin
  useIsomorphicLayoutEffect(() => {
    if (!gsap || !ScrollTrigger) return;
    if (!containerRef.current || !videoWrapperRef.current || !videoRef.current || !leftRef.current) return;
    if (!metadataReady) return;

    const ctx = gsap.context(() => {
      const video = videoRef.current!;
      const wrapper = videoWrapperRef.current!;
      const section = containerRef.current!;
      const left = leftRef.current!;

      video.pause();
      video.currentTime = 0;

      const st = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => {
          const leftH = left.offsetHeight;
          const wrapperH = wrapper.offsetHeight;
          const distance = Math.max(0, leftH - wrapperH);

          return `+=${distance}`;
        },
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const vid = videoRef.current;
          if (!vid || !vid.duration || Number.isNaN(vid.duration)) return;

          const t = self.progress * (vid.duration - 0.05);
          vid.currentTime = Math.min(Math.max(t, 0), vid.duration - 0.05);
        }
      });

      let rAF = 0;

      const onResize = () => {
        cancelAnimationFrame(rAF);
        rAF = requestAnimationFrame(() => ScrollTrigger.refresh());
      };

      window.addEventListener("resize", onResize);

      const ro = new ResizeObserver(() => ScrollTrigger.refresh());
      ro.observe(left);
      ro.observe(wrapper);

      return () => {
        window.removeEventListener("resize", onResize);
        cancelAnimationFrame(rAF);
        ro.disconnect();
        st.kill();
      };
    }, containerRef);

    return () => ctx.revert();
  }, [gsap, ScrollTrigger, metadataReady, videoSrc]);

  return (
    <section className={`section__services ${className}`}>
      <div className="column__2" ref={containerRef}>
        <div className="col__left scroll-video__services fadeInOut" ref={leftRef}>
          <div className="services__list">
            <article className="service-card service-card-title">
              <div className="card__data">
                <h3 className="prefix">{tServices("sectionTitle")}</h3>
                <h2>{tServices("sectionSubtitle")}</h2>
              </div>
            </article>

            {services.map((service) => {
              const data = tServices.raw(`items.${service.key}`) as {
                title: string;
                excerpt: string;
                cta: string;
              };

              const href = `/${locale}/services/${service.slug}`;

              return (
                <article key={service.key} className="service-card">
                  <div className="card__index">
                    <span>{service.index}</span>
                  </div>

                  <div className="card__data">
                    <h3 className="service-card__title">{data.title}</h3>
                    <p className="service-card__excerpt">{data.excerpt}</p>
                    <Link className="btn" href={href}>
                      {data.cta}
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className="col__right">
          <div className="scroll-video__wrapper" ref={videoWrapperRef}>
            <video
              ref={videoRef}
              src={videoSrc}
              poster={poster}
              playsInline
              muted
              preload="auto"
              webkit-playsinline="true"
            />
          </div>
        </div>
      </div>
    </section>
  );
}