import React, { useEffect } from "react";

const ScrollEffects: React.FC = () => {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      return undefined;
    }

    const w = window as unknown as {
      gsap?: {
        registerPlugin: (plugin: unknown) => void;
        fromTo: (target: Element, fromVars: Record<string, unknown>, toVars: Record<string, unknown>) => void;
        from: (targets: Element[], vars: Record<string, unknown>) => void;
        to: (target: Element, vars: Record<string, unknown>) => void;
      };
      ScrollTrigger?: {
        create: (vars: Record<string, unknown>) => { kill: () => void };
        getAll: () => { kill: () => void }[];
        defaults: (vars: Record<string, unknown>) => void;
        refresh: () => void;
      };
    };

    if (!w.gsap || !w.ScrollTrigger) {
      return undefined;
    }

    const { gsap, ScrollTrigger } = w;

    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.defaults({ once: true });

    const sections = Array.from(document.querySelectorAll("section, footer"));
    sections.forEach((section) => {
      gsap.fromTo(
        section,
        { opacity: 0, y: 80 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
          },
        }
      );
    });

    const cardGrids = [
      ".grid-cols-1.md\\:grid-cols-3 > div",
      ".grid-cols-2.md\\:grid-cols-5 > div",
      ".grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3 > div",
    ];

    cardGrids.forEach((selector) => {
      const elements = Array.from(document.querySelectorAll(selector));
      if (elements.length > 0) {
        gsap.from(elements, {
          scrollTrigger: {
            trigger: elements[0],
            start: "top 90%",
          },
          y: 40,
          opacity: 0,
          duration: 0.6,
          stagger: 0.12,
          ease: "power1.out",
        });
      }
    });

    const anchors = Array.from(document.querySelectorAll('a[href^="#"]'));
    const onAnchorClick = (event: Event) => {
      const target = event.currentTarget as HTMLAnchorElement | null;
      const href = target?.getAttribute("href");
      if (!href || href === "#") {
        return;
      }
      const targetEl = document.querySelector(href);
      if (!targetEl) {
        return;
      }
      event.preventDefault();
      const nav = document.querySelector("nav");
      const offset = (nav ? nav.offsetHeight : 0) + 24;
      const top = targetEl.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    };
    anchors.forEach((anchor) => anchor.addEventListener("click", onAnchorClick));

    const backToTopBtn = document.getElementById("back-to-top");
    const backToTopTrigger = backToTopBtn
      ? ScrollTrigger.create({
          start: "top -500",
          onUpdate: (self: { isActive: boolean }) => {
            if (self.isActive) {
              gsap.to(backToTopBtn, { opacity: 1, visibility: "visible", duration: 0.3 });
            } else {
              gsap.to(backToTopBtn, { opacity: 0, visibility: "hidden", duration: 0.3 });
            }
          },
        })
      : null;

    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);

    return () => {
      anchors.forEach((anchor) => anchor.removeEventListener("click", onAnchorClick));
      backToTopTrigger?.kill();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      window.removeEventListener("load", onLoad);
    };
  }, []);

  return null;
};

export default ScrollEffects;

