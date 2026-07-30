"use client";

import { useEffect, useRef, useState } from "react";
import { footer, legalPolicies } from "@/lib/content";
import { getGsap } from "@/lib/gsap";

type PolicyKey = keyof typeof legalPolicies;

export default function Footer() {
  const [openPolicy, setOpenPolicy] = useState<PolicyKey | null>(null);
  const bigTextRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const { gsap } = getGsap();
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion || !bigTextRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        bigTextRef.current,
        { xPercent: -14 },
        {
          xPercent: 14,
          ease: "none",
          scrollTrigger: {
            trigger: document.documentElement,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.5,
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <footer className="relative w-full overflow-hidden border-t border-hairline bg-background px-6 pt-16 md:pt-20">
      <div className="mx-auto flex max-w-6xl flex-col gap-16 md:flex-row md:justify-between">
        <div className="max-w-sm">
          <div className="display-heavy text-2xl text-foreground">
            {footer.logo}
          </div>
          <p className="mt-4 text-sm text-foreground-dim/70">{footer.blurb}</p>
        </div>

        <div className="flex flex-col gap-4">
          <span className="meta-label">Navigate</span>
          <nav className="flex flex-col gap-2">
            {footer.links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="text-foreground-dim/80 transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-4">
          <span className="meta-label">Contact</span>
          <div className="flex flex-col gap-2 text-foreground-dim/80">
            {footer.contactLines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="pointer-events-none mt-16 select-none overflow-hidden text-center">
        <span
          ref={bigTextRef}
          className="display-heavy inline-block whitespace-nowrap text-[22vw] leading-none text-white md:text-[13vw]"
        >
          HIGH LEVEL
        </span>
      </div>

      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 border-t border-hairline py-8 text-xs text-foreground-dim/50 md:flex-row md:justify-between">
        <span>{footer.copyright}</span>
        <div className="flex gap-6">
          {footer.legalLinks.map((link) => (
            <button
              key={link.key}
              type="button"
              onClick={() => setOpenPolicy(link.key)}
              className="transition-colors hover:text-foreground"
            >
              {link.label}
            </button>
          ))}
        </div>
      </div>

      {openPolicy && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6"
          onClick={() => setOpenPolicy(null)}
        >
          <div
            className="max-h-[80vh] w-full max-w-lg overflow-y-auto border border-hairline bg-background p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="display-heavy text-xl text-foreground">
                {legalPolicies[openPolicy].title}
              </h3>
              <button
                type="button"
                onClick={() => setOpenPolicy(null)}
                aria-label="Close"
                className="text-foreground-dim/60 transition-colors hover:text-foreground"
              >
                ✕
              </button>
            </div>
            <div className="mt-6 flex flex-col gap-4 text-sm text-foreground-dim/80">
              {legalPolicies[openPolicy].paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
