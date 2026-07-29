"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  PRELOADER_LOGO_IN_MS,
  PRELOADER_REVEAL_MS,
  PRELOADER_TOTAL_MS,
  PRELOADER_OVERLAY_OUT_MS,
} from "@/lib/preloader";

export default function Preloader() {
  const [mounted, setMounted] = useState(true);
  const [logoVisible, setLogoVisible] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(true);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setMounted(false);
      return;
    }

    const raf = requestAnimationFrame(() => setLogoVisible(true));
    const logoOutTimer = setTimeout(
      () => setLogoVisible(false),
      PRELOADER_REVEAL_MS - PRELOADER_OVERLAY_OUT_MS
    );
    const overlayOutTimer = setTimeout(
      () => setOverlayVisible(false),
      PRELOADER_REVEAL_MS
    );
    const unmountTimer = setTimeout(() => setMounted(false), PRELOADER_TOTAL_MS);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(logoOutTimer);
      clearTimeout(overlayOutTimer);
      clearTimeout(unmountTimer);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-black transition-opacity ease-in-out ${
        overlayVisible ? "opacity-100" : "opacity-0"
      }`}
      style={{ transitionDuration: `${PRELOADER_OVERLAY_OUT_MS}ms` }}
    >
      <Image
        src="/logo.png"
        alt="High Level"
        width={220}
        height={126}
        priority
        className={`h-auto w-40 transition-opacity ease-in-out sm:w-48 ${
          logoVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{ transitionDuration: `${PRELOADER_LOGO_IN_MS}ms` }}
      />
    </div>
  );
}
