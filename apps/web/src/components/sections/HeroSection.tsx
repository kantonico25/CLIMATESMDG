import type { HeroSection as HeroSectionType } from "../../api/types";
import { useEffect, useRef } from "react";
import { getGsap } from "../../animations/gsap";
import { getMediaSrcSet, getMediaUrl } from "../media/mediaUtils";
import { useContactModal } from "../ContactModal/ContactModalContext";

export default function HeroSection({ section }: { section: HeroSectionType }) {
  const { open: openContactModal, contactSection } = useContactModal();
  const rootRef = useRef<HTMLElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const eyebrowRef = useRef<HTMLParagraphElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const subheadlineRef = useRef<HTMLParagraphElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    let active = true;
    let revert: (() => void) | undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    void getGsap().then(({ gsap }) => {
      if (!active) return;
      const context = gsap.context(() => {
        const tl = gsap.timeline();
        const textTargets = [eyebrowRef.current, headingRef.current, subheadlineRef.current].filter(Boolean) as Array<
          HTMLParagraphElement | HTMLHeadingElement
        >;

        if (textTargets.length) {
          tl.fromTo(
            textTargets,
            { autoAlpha: 0, y: 30 },
            { autoAlpha: 1, y: 0, duration: 0.8, ease: "power2.out", stagger: 0.4 },
            0
          );
        }

        if (ctaRef.current) {
          tl.fromTo(
            ctaRef.current,
            { autoAlpha: 0, y: 30, scale: 0.96 },
            { autoAlpha: 1, y: 0, scale: 1, duration: 0.8, ease: "back.out(1.7)" },
            "-=0.4"
          );
        }
      }, node);

      revert = () => context.revert();
    });

    return () => {
      active = false;
      if (revert) {
        revert();
      }
    };
  }, []);

  const shouldOpenModal = (url?: string | null) =>
    Boolean(url && (url.startsWith("#contact") || url.startsWith("modal:contact")));

  const handleCtaClick = (event: React.MouseEvent<HTMLAnchorElement>, url?: string | null) => {
    if (!shouldOpenModal(url) || !contactSection) return;
    event.preventDefault();
    openContactModal();
  };

  const renderHighlightedText = (text: string, keyPrefix: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        const highlighted = part.slice(2, -2);
        return (
          <span key={`${keyPrefix}-hl-${index}`} className="text-yellow-400">
            {highlighted}
          </span>
        );
      }
      return <span key={`${keyPrefix}-txt-${index}`}>{part}</span>;
    });
  };

  const renderHeadline = (headline: string) => {
    const lines = headline.split("||").map((line) => line.trim()).filter(Boolean);
    if (!lines.length) return headline;
    return lines.map((line, index) => (
      <span key={`line-${index}`} className="block">
        {renderHighlightedText(line, `line-${index}`)}
      </span>
    ));
  };

  return (
    <section
      ref={rootRef}
      className="perf-section relative isolate min-h-[90vh] flex items-center justify-center text-center px-4"
    >
      <div className="absolute inset-0 z-0 pointer-events-none">
        {section.image?.url ? (
          <img
            ref={imageRef}
            className="absolute inset-0 w-full h-full object-cover object-top"
            src={getMediaUrl(section.image, ["xlarge", "large", "medium"]) || section.image.url}
            srcSet={getMediaSrcSet(section.image)}
            sizes="100vw"
            alt={section.image.alternativeText || section.headline}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            width={section.image.width ?? undefined}
            height={section.image.height ?? undefined}
          />
        ) : null}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10 max-w-4xl">
        {section.eyebrow ? (
          <p ref={eyebrowRef} className="text-white text-sm md:text-sm font-medium mb-2">
            {section.eyebrow}
          </p>
        ) : null}

        <h1 ref={headingRef} className="text-white text-3xl md:text-3xl font-bold uppercase tracking-tight mb-4">
          {renderHeadline(section.headline)}
        </h1>

        {section.subheadline ? (
          <p ref={subheadlineRef} className="text-white text-sm md:text-sm max-w-4xl mx-auto mb-10 leading-relaxed">
            {section.subheadline}
          </p>
        ) : null}

        <div ref={ctaRef} className="flex items-center justify-center gap-4 flex-wrap">
          {section.primaryCtaLabel && section.primaryCtaUrl ? (
            <a
              href={section.primaryCtaUrl}
              className="bg-[#0d8a8a] text-white px-8 py-4 rounded-full text-base font-semibold hover:bg-teal-800 transition shadow-lg inline-block"
              onClick={(event) => handleCtaClick(event, section.primaryCtaUrl)}
            >
              {section.primaryCtaLabel}
            </a>
          ) : null}
          {section.secondaryCtaLabel && section.secondaryCtaUrl ? (
            <a
              href={section.secondaryCtaUrl}
              className="bg-white/10 text-white px-8 py-4 rounded-full text-base font-semibold hover:bg-white/20 transition shadow-lg inline-block"
              onClick={(event) => handleCtaClick(event, section.secondaryCtaUrl)}
            >
              {section.secondaryCtaLabel}
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
