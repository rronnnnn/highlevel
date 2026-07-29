"use client";

import { useEffect, useRef } from "react";
import { getGsap } from "@/lib/gsap";
import { stats } from "@/lib/content";

export default function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const numberRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const { gsap } = getGsap();
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      stats.forEach((stat, i) => {
        const el = numberRefs.current[i];
        if (!el) return;

        if (prefersReducedMotion) {
          el.textContent = `${stat.value}${stat.suffix}`;
          return;
        }

        const counter = { value: 0 };
        gsap.to(counter, {
          value: stat.value,
          duration: 1.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
          },
          onUpdate: () => {
            el.textContent = `${Math.round(counter.value)}${stat.suffix}`;
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full border-t border-hairline bg-background px-6 py-24 md:py-32"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-y-14 md:grid-cols-4 md:gap-y-0">
        {stats.map((stat, i) => (
          <div key={stat.label} className="flex flex-col items-center text-center">
            <span
              ref={(el) => {
                numberRefs.current[i] = el;
              }}
              className="display-heavy text-[13vw] text-foreground sm:text-[6vw] md:text-[4.2vw]"
            >
              0
            </span>
            <span className="meta-label mt-3">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
