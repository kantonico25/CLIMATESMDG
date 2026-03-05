type GsapBundle = {
  gsap: typeof import("gsap").default;
  ScrollTrigger: (typeof import("gsap/ScrollTrigger"))["ScrollTrigger"];
};

let gsapPromise: Promise<GsapBundle> | null = null;

export const getGsap = () => {
  if (!gsapPromise) {
    gsapPromise = Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([gsapModule, scrollTrigger]) => {
      const gsap = gsapModule.default;
      const ScrollTrigger = scrollTrigger.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);
      return { gsap, ScrollTrigger };
    });
  }

  return gsapPromise;
};
