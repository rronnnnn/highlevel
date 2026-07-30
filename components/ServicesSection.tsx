"use client";

import { useEffect, useRef, useState } from "react";
import OptionWheel, { type OptionWheelHandle } from "@/components/OptionWheel";
import { getGsap } from "@/lib/gsap";
import { serviceLabels } from "@/lib/content";

// how much scroll distance (as % of viewport height) the section holds for —
// gives the wheel room to be scrolled through a couple times before releasing
const PIN_DISTANCE = 200;
// same idea but shorter, since the mobile section isn't a full h-screen pin
const PIN_DISTANCE_MOBILE = 120;
// how many full passes over the item list one pin distance covers
const CYCLES_PER_PIN = 2;
// delay after the last scroll tick before snapping to the nearest item
const SETTLE_DELAY_MS = 140;

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const wheelRef = useRef<OptionWheelHandle>(null);
  const settleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
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

    // Drives the wheel from real page-scroll progress through the pin, so it
    // advances no matter where the cursor is — not just while hovering the
    // wheel itself, which is all the element's own local `wheel` listener
    // can see. Runs on both breakpoints; only the pin distance differs.
    const driveFromScroll = (progress: number) => {
      wheelRef.current?.setPosition(progress * serviceLabels.length * CYCLES_PER_PIN, false);
      if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
      settleTimerRef.current = setTimeout(() => {
        wheelRef.current?.setPosition(progress * serviceLabels.length * CYCLES_PER_PIN, true);
      }, SETTLE_DELAY_MS);
    };

    const ctx = gsap.context(() => {
      ScrollTrigger.matchMedia({
        "(min-width: 768px)": () => {
          ScrollTrigger.create({
            trigger: sectionRef.current,
            start: "top top",
            end: `+=${PIN_DISTANCE}%`,
            pin: true,
            anticipatePin: 1,
            onUpdate: (self) => driveFromScroll(self.progress),
          });
        },
        "(max-width: 767px)": () => {
          ScrollTrigger.create({
            trigger: sectionRef.current,
            start: "top top",
            end: `+=${PIN_DISTANCE_MOBILE}%`,
            pin: true,
            anticipatePin: 1,
            onUpdate: (self) => driveFromScroll(self.progress),
          });
        },
      });
    }, sectionRef);

    return () => {
      ctx.revert();
      if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
    };
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
          ref={wheelRef}
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
