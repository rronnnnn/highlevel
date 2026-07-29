"use client";

import { useEffect, useRef, useState } from "react";
import OptionWheel from "@/components/OptionWheel";
import { getGsap } from "@/lib/gsap";
import { serviceLabels } from "@/lib/content";

// how much scroll distance (as % of viewport height) the section holds for —
// gives the wheel room to be scrolled through a couple times before releasing
const PIN_DISTANCE = 200;

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [fontSize, setFontSize] = useState(6.4);
  const [isCoarsePointer, setIsCoarsePointer] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => setFontSize(mq.matches ? 2.6 : 6.4);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    // touch devices swipe this section to scroll the page, not to drag the
    // wheel — tapping an option still works either way
    const mq = window.matchMedia("(pointer: coarse)");
    const apply = () => setIsCoarsePointer(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const { gsap, ScrollTrigger } = getGsap();
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.matchMedia({
        "(min-width: 768px)": () => {
          ScrollTrigger.create({
            trigger: sectionRef.current,
            start: "top top",
            end: `+=${PIN_DISTANCE}%`,
            pin: true,
            anticipatePin: 1,
          });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative w-full border-t border-hairline bg-background px-6 py-24 md:flex md:h-screen md:flex-col md:py-16"
    >
      <div className="mx-auto flex max-w-4xl shrink-0 flex-col items-center gap-4 text-center">
        <span className="meta-label">07 services · 01 standard</span>
        <h2 className="display-heavy text-[10vw] leading-none text-foreground sm:text-6xl md:text-7xl">
          Our services:
        </h2>
      </div>

      <div className="mt-8 h-[420px] w-full md:mt-6 md:h-auto md:flex-1">
        <OptionWheel
          items={serviceLabels}
          defaultSelected={0}
          fontSize={fontSize}
          spacing={1.4}
          inset={0}
          side="left"
          loop
          draggable={!isCoarsePointer}
          textColor="rgba(237,237,237,0.35)"
          activeColor="#ffffff"
        />
      </div>
    </section>
  );
}
