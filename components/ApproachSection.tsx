"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { getGsap } from "@/lib/gsap";
import { approach } from "@/lib/content";

// keep only steps 1, 2, and 5 — Strategy first, Designed to the pixel, A partnership after launch
const steps = [approach[0], approach[1], approach[4]];

// percent of viewport height the scroll must travel between each step — long
// and slow, so the path/cursor motion reads as deliberate rather than instant
const SEGMENT_VH = 260;

export default function ApproachSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const segment1Ref = useRef<SVGPathElement>(null);
  const segment2Ref = useRef<SVGPathElement>(null);
  const cursorRef = useRef<SVGGElement>(null);
  const markerRefs = useRef<(SVGCircleElement | null)[]>([]);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mobileMarkerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mobilePathRef = useRef<SVGPathElement>(null);
  const mobileCursorRef = useRef<SVGGElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [mobilePoints, setMobilePoints] = useState<{ x: number; y: number }[]>([]);

  useLayoutEffect(() => {
    function measure() {
      if (stageRef.current) {
        setSize({
          width: stageRef.current.offsetWidth,
          height: stageRef.current.offsetHeight,
        });
      }
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // mobile markers sit inline in the normal document flow (one per step), so
  // their positions can't be derived from percentages like the desktop
  // freeform layout — measure their actual rects relative to the stage
  // instead, re-running whenever the stage's size changes (viewport resize,
  // or text reflow changing step heights).
  useLayoutEffect(() => {
    function measureMarkers() {
      const stage = stageRef.current;
      if (!stage) return;
      const stageRect = stage.getBoundingClientRect();
      const points = mobileMarkerRefs.current.map((el) => {
        if (!el) return { x: 0, y: 0 };
        const rect = el.getBoundingClientRect();
        return {
          x: rect.left - stageRect.left + rect.width / 2,
          y: rect.top - stageRect.top + rect.height / 2,
        };
      });
      setMobilePoints(points);
    }
    measureMarkers();
    window.addEventListener("resize", measureMarkers);
    return () => window.removeEventListener("resize", measureMarkers);
  }, [size]);

  const w = Math.max(size.width, 1);
  const h = Math.max(size.height, 1);

  // three waypoints: Strategy first (left) -> Designed to the pixel (right)
  // -> A partnership after launch (center, lower)
  const points = [
    { x: w * 0.1, y: h * 0.46 },
    { x: w * 0.9, y: h * 0.46 },
    { x: w * 0.5, y: h * 0.86 },
  ];

  // two separate path segments (rather than one combined path) so each
  // motionPath tween below can be timed 1:1 with its own text crossfade —
  // MotionPathPlugin measures progress by arc length along the WHOLE path,
  // so a single path made the cursor arrive at the middle waypoint out of
  // sync with when the text actually swapped (segments aren't equal length)
  const segment1D = `M${points[0].x},${points[0].y} C${w * 0.36},${h * 0.58} ${w * 0.64},${h * 0.58} ${points[1].x},${points[1].y}`;
  const segment2D = `M${points[1].x},${points[1].y} C${w * 0.86},${h * 0.7} ${w * 0.64},${h * 0.86} ${points[2].x},${points[2].y}`;

  // mobile path: rather than tracing straight down through the markers, each
  // leg swoops out wide to the right, curls back into a loop, then sweeps
  // back left through the marker column before settling into the next point
  // — the markers all sit near the left edge, so there's no room to loop left
  // without the curve vanishing off-canvas under the section's overflow-hidden;
  // swinging right (where there's space) keeps every loop on screen while
  // still reading as one continuous right-to-left doodle, not a ruler line
  const loopLeg = (
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    amp: number,
    loopFrac: number
  ) => {
    const dy = y1 - y0;
    const far = w * amp;
    const loopX = x0 + w * loopFrac;
    const back = -w * 0.12;
    const c1x = x0 + far * 0.55;
    const c1y = y0 + dy * 0.08;
    const c2x = x0 + far;
    const c2y = y0 + dy * 0.3;
    const loopY = y0 + dy * 0.42;
    const c3x = x0 + back;
    const c3y = y0 + dy * 0.62;
    const c4x = x0 + w * loopFrac * 0.25;
    const c4y = y0 + dy * 0.84;
    return (
      `C${c1x},${c1y} ${c2x},${c2y} ${loopX},${loopY} ` +
      `C${c3x},${c3y} ${c4x},${c4y} ${x1},${y1}`
    );
  };

  const mobilePathD =
    mobilePoints.length === 3 && mobilePoints.every((p) => p.x || p.y)
      ? `M${mobilePoints[0].x},${mobilePoints[0].y} ` +
        loopLeg(
          mobilePoints[0].x,
          mobilePoints[0].y,
          mobilePoints[1].x,
          mobilePoints[1].y,
          0.78,
          0.28
        ) +
        " " +
        loopLeg(
          mobilePoints[1].x,
          mobilePoints[1].y,
          mobilePoints[2].x,
          mobilePoints[2].y,
          0.55,
          0.42
        )
      : "";

  useEffect(() => {
    const { gsap, ScrollTrigger } = getGsap();
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion || !size.width || !size.height) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.matchMedia({
        "(min-width: 768px)": () => {
          // step0 starts in place; step1 waits off to the right (it slides in
          // from there); step2 waits below (it slides up into place) — gives
          // the crossfade real directional motion instead of a flat opacity swap
          gsap.set(stepRefs.current[0], { opacity: 1, x: 0, y: 0 });
          gsap.set(stepRefs.current[1], { opacity: 0, x: 60, y: 0 });
          gsap.set(stepRefs.current[2], { opacity: 0, x: 0, y: 60 });

          const totalDuration = steps.length - 1;
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: `+=${totalDuration * SEGMENT_VH}%`,
              scrub: 1,
              pin: true,
              anticipatePin: 1,
            },
          });

          if (cursorRef.current && segment1Ref.current && segment2Ref.current) {
            gsap.set(cursorRef.current, {
              motionPath: {
                path: segment1Ref.current,
                align: segment1Ref.current,
                alignOrigin: [0.5, 0.5],
                autoRotate: false,
                start: 0,
              },
            });
            // segment 1: point0 -> point1, running exactly while step0 crossfades
            // to step1 (t 0 -> 1), so the cursor lands on point1 right on cue
            tl.to(
              cursorRef.current,
              {
                motionPath: {
                  path: segment1Ref.current,
                  align: segment1Ref.current,
                  alignOrigin: [0.5, 0.5],
                  autoRotate: false,
                  start: 0,
                  end: 1,
                },
                duration: 1,
                ease: "none",
              },
              0
            );
            // segment 2: point1 -> point2, running while step1 crossfades to
            // step2 (t 1 -> 2)
            tl.to(
              cursorRef.current,
              {
                motionPath: {
                  path: segment2Ref.current,
                  align: segment2Ref.current,
                  alignOrigin: [0.5, 0.5],
                  autoRotate: false,
                  start: 0,
                  end: 1,
                },
                duration: 1,
                ease: "none",
              },
              1
            );
          }

          // text crossfades continuously across the WHOLE segment (not just a
          // narrow window in the middle) so there's no "dead" scroll distance
          // with nothing visibly changing — motion fills the entire scrub
          tl.to(stepRefs.current[0], { opacity: 0, x: -60, duration: 1 }, 0).to(
            stepRefs.current[1],
            { opacity: 1, x: 0, duration: 1 },
            0
          );
          tl.to(stepRefs.current[1], { opacity: 0, x: 60, duration: 1 }, 1).to(
            stepRefs.current[2],
            { opacity: 1, y: 0, duration: 1 },
            1
          );

          steps.forEach((_, i) => {
            const marker = markerRefs.current[i];
            if (!marker) return;
            tl.to(
              marker,
              { scale: 1.8, duration: 0.25, ease: "elastic.out(2.5, 1)", transformOrigin: "center" },
              i
            ).to(marker, { scale: 1, duration: 0.3 }, i + 0.25);
          });
        },
        // mobile — steps stay in normal document flow (no pin, no crossfade);
        // the path simply draws itself in and the cursor travels down it as
        // the section scrolls past, so the diagram still reads as connected
        // rather than being hidden outright
        "(max-width: 767px)": () => {
          // defensively strip any inline transform/opacity the desktop branch
          // may have left behind — on some devices the very first layout pass
          // can briefly evaluate before matchMedia settles, and a leftover
          // translateX from the desktop crossfade shoves this step's text
          // off-screen since it never gets cleaned up on its own
          gsap.set(stepRefs.current, { clearProps: "transform,opacity" });

          const path = mobilePathRef.current;
          const cursor = mobileCursorRef.current;
          if (!path || !mobilePathD) return;

          const length = path.getTotalLength();
          gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
          if (cursor) {
            gsap.set(cursor, {
              motionPath: { path, align: path, alignOrigin: [0.5, 0.5], autoRotate: false, start: 0 },
            });
          }

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              // starts as soon as the section starts entering from below, and
              // finishes well before it's fully scrolled past — the draw runs
              // ahead of the text rather than syncing 1:1 with it, so each
              // loop is already in place by the time you reach that step
              // instead of trailing a beat behind
              start: "top 100%",
              end: "bottom 55%",
              scrub: true,
            },
          });

          tl.to(path, { strokeDashoffset: 0, ease: "none", duration: 1 }, 0);
          if (cursor) {
            tl.to(
              cursor,
              {
                motionPath: { path, align: path, alignOrigin: [0.5, 0.5], autoRotate: false, start: 0, end: 1 },
                ease: "none",
                duration: 1,
              },
              0
            );
          }
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [size.width, size.height, h, mobilePathD]);

  return (
    <section
      ref={sectionRef}
      id="approach"
      className="relative w-full overflow-hidden border-t border-hairline bg-background px-6 py-24 md:h-screen md:py-0"
    >
      <div
        ref={stageRef}
        className="relative mx-auto flex h-auto max-w-6xl flex-col gap-16 md:h-full md:gap-0"
      >
        <h2 className="display-heavy max-w-2xl text-[9vw] leading-none text-foreground sm:text-5xl md:absolute md:left-0 md:top-12 md:max-w-sm md:text-4xl">
          We deliver solutions, not just deliverables.
        </h2>

        <svg
          className="pointer-events-none absolute inset-0 hidden md:block"
          width="100%"
          height="100%"
          aria-hidden
        >
          <path
            ref={segment1Ref}
            d={segment1D}
            fill="none"
            stroke="rgba(237,237,237,0.28)"
            strokeWidth={2}
            strokeDasharray="2 10"
            strokeLinecap="round"
          />
          <path
            ref={segment2Ref}
            d={segment2D}
            fill="none"
            stroke="rgba(237,237,237,0.28)"
            strokeWidth={2}
            strokeDasharray="2 10"
            strokeLinecap="round"
          />
          {points.map((p, i) => (
            <circle
              key={steps[i].number}
              ref={(el) => {
                markerRefs.current[i] = el;
              }}
              cx={p.x}
              cy={p.y}
              r={4}
              fill="rgba(237,237,237,0.4)"
            />
          ))}
          <g ref={cursorRef}>
            <path
              d="M-7.5,-9.5 L-7.5,9.5 L-2,5 L1,10.5 L3.5,9 L0.5,3.5 L7.5,3.5 Z"
              fill="#ffffff"
              style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.55))" }}
            />
          </g>
        </svg>

        {mobilePathD && (
          <svg
            className="pointer-events-none absolute inset-0 block md:hidden"
            width="100%"
            height="100%"
            aria-hidden
          >
            <path
              ref={mobilePathRef}
              d={mobilePathD}
              fill="none"
              stroke="rgba(237,237,237,0.35)"
              strokeWidth={2}
              strokeLinecap="round"
            />
            <g ref={mobileCursorRef}>
              <path
                d="M-6,-7.5 L-6,7.5 L-1.5,4 L0.8,8.5 L2.8,7.5 L0.4,2.8 L6,2.8 Z"
                fill="#ffffff"
                style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.55))" }}
              />
            </g>
          </svg>
        )}

        {steps.map((step, i) => (
          <div
            key={step.number}
            ref={(el) => {
              stepRefs.current[i] = el;
            }}
            className={
              "flex max-w-md flex-col gap-4 " +
              (i === 0
                ? "md:absolute md:left-[6%] md:top-1/2 md:-translate-y-1/2 md:items-start md:text-left"
                : i === 1
                  ? "md:absolute md:right-[6%] md:top-1/2 md:-translate-y-1/2 md:items-end md:text-right"
                  : "md:absolute md:left-1/2 md:bottom-[8%] md:-translate-x-1/2 md:items-center md:text-center")
            }
          >
            <div
              ref={(el) => {
                mobileMarkerRefs.current[i] = el;
              }}
              className="h-2 w-2 rounded-full bg-white/40 md:hidden"
              aria-hidden
            />
            <span className="section-number text-foreground-dim">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="display-heavy text-3xl text-foreground sm:text-4xl md:text-5xl">
              {step.title}
            </h3>
            <p className="max-w-xl text-base text-foreground-dim/75 sm:text-lg">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
