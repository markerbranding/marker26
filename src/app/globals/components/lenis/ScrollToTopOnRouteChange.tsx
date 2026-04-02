"use client";

import {useEffect} from "react";
import {usePathname} from "next/navigation";
import {useLenis} from "@/app/globals/components/lenis/LenisProvider";

export default function ScrollToTopOnRouteChange() {
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (lenis) {
      // Desktop con Lenis
      lenis.scrollTo(0, {immediate: true});
    } else {
      // Mobile o caso sin Lenis
      window.scrollTo({top: 0, left: 0, behavior: "auto"});
    }
  }, [pathname, lenis]);

  return null;
}