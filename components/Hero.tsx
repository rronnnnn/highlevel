"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { getGsap } from "@/lib/gsap";
import { heroObjects } from "@/lib/heroObjects";
import { hero } from "@/lib/content";
import { PRELOADER_REVEAL_MS } from "@/lib/preloader";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const headlineInnerRef = useRef<HTMLSpanElement>(null);
  const sublineRef = useRef<HTMLParagraphElement>(null);
  const sublineInnerRef = useRef<HTMLSpanElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const metaInnerRef = useRef<HTMLSpanElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);
  const scrollCueInnerRef = useRef<HTMLSpanElement>(null);
  const scrubRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const driftRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const { gsap, ScrollTrigger } = getGsap();
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) return;

      // load-in: everything zooms in from slightly oversized + faded to its
      // resting size. This targets an INNER wrapper for each element (the
      // hero objects' drift div, and a dedicated span for each text line) —
      // never the same element/property the scroll-scrub timeline below
      // controls — so the two animations can't fight over ownership of the
      // same transform and the scroll timeline can be wired up immediately.
      const loadTl = gsap.timeline({
        delay: PRELOADER_REVEAL_MS / 1000,
        defaults: { ease: "power3.out" },
      });

      heroObjects.forEach((obj, i) => {
        const el = driftRefs.current[obj.id];
        if (!el) return;
        loadTl.from(el, { scale: 1.6, opacity: 0, duration: 1.2 }, i * 0.08);
      });

      loadTl
        .from(metaInnerRef.current, { opacity: 0, scale: 1.3, y: 10, duration: 0.8 }, 0.1)
        .from(headlineInnerRef.current, { opacity: 0, scale: 1.15, y: 24, duration: 1 }, 0.2)
        .from(sublineInnerRef.current, { opacity: 0, scale: 1.08, y: 16, duration: 0.9 }, 0.4)
        .from(scrollCueInnerRef.current, { opacity: 0, y: 10, duration: 0.6 }, 0.7);

      // idle drift, runs regardless of viewport size — same element as the
      // load-in zoom above, but a different property (translate vs
      // scale/opacity), so GSAP composes both without conflict
      heroObjects.forEach((obj) => {
        const el = driftRefs.current[obj.id];
        if (!el) return;
        gsap.to(el, {
          y: obj.driftAmplitude,
          duration: obj.driftDuration,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
        gsap.to(el, {
          x: obj.driftAmplitude * 0.6,
          duration: obj.driftDuration * 1.3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: obj.driftDuration * 0.2,
        });
      });

      ScrollTrigger.matchMedia({
        // desktop / tablet landscape — full cinematic pinned scrub
        "(min-width: 768px)": () => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: "+=140%",
              scrub: 1,
              pin: true,
              anticipatePin: 1,
            },
          });

          heroObjects.forEach((obj) => {
            const el = scrubRefs.current[obj.id];
            if (!el) return;
            tl.to(
              el,
              {
                yPercent: obj.scrollSpeed,
                scale: obj.scale * obj.scrollScale,
                ease: "none",
              },
              0
            );
          });

          tl.to(
            headlineRef.current,
            { scale: 1.35, letterSpacing: "0.04em", yPercent: -30, opacity: 0, ease: "none" },
            0
          );
          tl.to(sublineRef.current, { yPercent: -20, opacity: 0, ease: "none" }, 0);
          tl.to(metaRef.current, { opacity: 0, ease: "none" }, 0);
          tl.to(scrollCueRef.current, { opacity: 0, ease: "none" }, 0);
        },
        // mobile — lighter parallax, no pin
        "(max-width: 767px)": () => {
          heroObjects.forEach((obj) => {
            const el = scrubRefs.current[obj.id];
            if (!el) return;
            gsap.to(el, {
              yPercent: obj.scrollSpeed * 0.4,
              scale: obj.scale * (1 + (obj.scrollScale - 1) * 0.25),
              ease: "none",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top top",
                end: "bottom top",
                scrub: 1,
              },
            });
          });

          gsap.to(headlineRef.current, {
            yPercent: -12,
            opacity: 0.4,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: "bottom top",
              scrub: 1,
            },
          });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-background"
    >
      <div className="pointer-events-none absolute inset-0">
        {heroObjects.map((obj) => (
          <div
            key={obj.id}
            ref={(el) => {
              scrubRefs.current[obj.id] = el;
            }}
            className="absolute left-1/2 top-1/2 will-change-transform"
            style={{
              transform: `translate(-50%, -50%) translate(${obj.x}vw, ${obj.y}vh) scale(${obj.scale})`,
              zIndex: obj.z,
            }}
          >
            <div
              ref={(el) => {
                driftRefs.current[obj.id] = el;
              }}
              className="will-change-transform"
            >
              <Image
                src={obj.src}
                alt=""
                width={obj.width}
                height={obj.height}
                priority
                className="opacity-90"
                style={{ width: obj.width, height: "auto" }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <div ref={metaRef} className="meta-label mb-6">
          <span ref={metaInnerRef} className="inline-block">
            {hero.meta}
          </span>
        </div>
        <h1
          ref={headlineRef}
          className="display-heavy max-w-5xl text-[12vw] text-foreground sm:text-[9vw] md:text-[7.5vw]"
        >
          <span ref={headlineInnerRef} className="block">
            {hero.headline}
          </span>
        </h1>
        <p
          ref={sublineRef}
          className="mt-6 max-w-xl text-balance text-base text-foreground-dim/80 sm:text-lg"
        >
          <span ref={sublineInnerRef} className="inline-block">
            {hero.subline}
          </span>
        </p>

        <div
          ref={scrollCueRef}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.18em] text-foreground-dim/50"
        >
          <span ref={scrollCueInnerRef} className="inline-block">
            ↓ scroll
          </span>
        </div>
      </div>
    </section>
  );
}
