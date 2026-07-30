"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { getGsap } from "@/lib/gsap";
import { work } from "@/lib/content";

export default function WorkSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const parallaxRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const { gsap } = getGsap();
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      if (headingRef.current) {
        gsap.to(headingRef.current, {
          opacity: 0.55,
          scale: 1.02,
          duration: 2.4,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      }

      parallaxRefs.current.forEach((el) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { scale: 1.22 },
          {
            scale: 1.02,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="work"
      className="relative w-full border-t border-hairline bg-background px-6 py-24 md:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <h2
          ref={headingRef}
          className="display-heavy mb-16 bg-gradient-to-r from-white via-white/60 to-white/25 bg-clip-text text-[10vw] leading-none text-transparent sm:text-6xl md:mb-20 md:text-7xl"
        >
          Our Work
        </h2>

        <div>
          {work.map((project, i) => (
            <motion.a
              key={project.name}
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group block border-b border-hairline py-14 first:border-t first:border-hairline md:py-20"
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-white/5 md:aspect-[16/9]">
                <div
                  ref={(el) => {
                    parallaxRefs.current[i] = el;
                  }}
                  className="absolute inset-0 will-change-transform"
                >
                  <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105">
                    <Image
                      src={project.image}
                      alt={project.name}
                      fill
                      sizes="(min-width: 768px) 90vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-background/0 opacity-0 transition-all duration-500 group-hover:bg-background/40 group-hover:opacity-100">
                  <span className="meta-label rounded-full border border-hairline bg-background/70 px-5 py-2 text-foreground opacity-100">
                    View Live ↗
                  </span>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-baseline md:justify-between">
                <div>
                  <h3 className="display-heavy text-2xl text-foreground sm:text-3xl md:text-4xl">
                    {project.name}
                  </h3>
                  <p className="mt-2 max-w-md text-sm text-foreground-dim/70 sm:text-base">
                    {project.description}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 md:shrink-0">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="meta-label rounded-full border border-hairline px-3 py-1 text-[0.65rem]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
