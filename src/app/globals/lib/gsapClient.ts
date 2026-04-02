"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
// si luego quieres: ScrollToPlugin, MotionPathPlugin, etc.

let isRegistered = false;

export function useGsapCore() {
  if (typeof window === "undefined") return { gsap, ScrollTrigger, SplitText };

  if (!isRegistered) {
    gsap.registerPlugin(ScrollTrigger, SplitText);
    isRegistered = true;
  }

  return { gsap, ScrollTrigger, SplitText };
}