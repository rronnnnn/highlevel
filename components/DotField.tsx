"use client";

import { useEffect, useRef } from "react";

const SPACING = 38; // px between dots
const DOT_RADIUS = 1.3;
const GLOW_RADIUS = 190; // px, how far the cursor's influence reaches
const GLOW_DOT_RADIUS = 3.2;
const BASE_ALPHA = 0.1;
const GLOW_ALPHA = 0.85;
const POINTER_EASE = 0.16; // lerp factor toward the real pointer, for a soft trailing glow

type Dot = { x: number; y: number };

export default function DotField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (isCoarsePointer || prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = window.innerWidth;
    let height = window.innerHeight;
    let dots: Dot[] = [];
    let cols = 0;

    function buildGrid() {
      dots = [];
      cols = Math.ceil(width / SPACING) + 1;
      const rows = Math.ceil(height / SPACING) + 1;
      const offsetX = (width - (cols - 1) * SPACING) / 2;
      const offsetY = (height - (rows - 1) * SPACING) / 2;
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          dots.push({ x: offsetX + col * SPACING, y: offsetY + row * SPACING });
        }
      }
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildGrid();
    }
    resize();
    window.addEventListener("resize", resize);

    const target = { x: width / 2, y: height / 2, active: false };
    const pointer = { x: width / 2, y: height / 2 };

    function onPointerMove(e: PointerEvent) {
      target.x = e.clientX;
      target.y = e.clientY;
      target.active = true;
    }
    function onPointerLeave() {
      target.active = false;
    }
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave, { passive: true });

    let rafId = 0;
    function frame() {
      pointer.x += (target.x - pointer.x) * POINTER_EASE;
      pointer.y += (target.y - pointer.y) * POINTER_EASE;

      ctx!.clearRect(0, 0, width, height);

      // only dots within the glow's bounding box need distance checks
      const minCol = Math.max(0, Math.floor((pointer.x - GLOW_RADIUS) / SPACING) - 1);
      const maxCol = Math.min(cols - 1, Math.ceil((pointer.x + GLOW_RADIUS) / SPACING) + 1);

      ctx!.fillStyle = `rgba(255,255,255,${BASE_ALPHA})`;
      ctx!.beginPath();
      for (const dot of dots) {
        const dc = Math.round(dot.x / SPACING);
        if (target.active && dc >= minCol && dc <= maxCol) continue; // drawn in glow pass
        ctx!.moveTo(dot.x + DOT_RADIUS, dot.y);
        ctx!.arc(dot.x, dot.y, DOT_RADIUS, 0, Math.PI * 2);
      }
      ctx!.fill();

      if (target.active) {
        for (const dot of dots) {
          const dc = Math.round(dot.x / SPACING);
          if (dc < minCol || dc > maxCol) continue;
          const dx = dot.x - pointer.x;
          const dy = dot.y - pointer.y;
          const dist = Math.hypot(dx, dy);
          const t = Math.max(0, 1 - dist / GLOW_RADIUS);
          if (t <= 0) {
            ctx!.fillStyle = `rgba(255,255,255,${BASE_ALPHA})`;
            ctx!.beginPath();
            ctx!.arc(dot.x, dot.y, DOT_RADIUS, 0, Math.PI * 2);
            ctx!.fill();
            continue;
          }
          const eased = t * t;
          const alpha = BASE_ALPHA + (GLOW_ALPHA - BASE_ALPHA) * eased;
          const radius = DOT_RADIUS + (GLOW_DOT_RADIUS - DOT_RADIUS) * eased;
          ctx!.fillStyle = `rgba(255,255,255,${alpha})`;
          ctx!.beginPath();
          ctx!.arc(dot.x, dot.y, radius, 0, Math.PI * 2);
          ctx!.fill();
        }
      }

      rafId = requestAnimationFrame(frame);
    }
    rafId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="fx-canvas" />;
}
