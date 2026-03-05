import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../api/client";
import { useAsync } from "../../api/useAsync";
import type { ProjectGallerySection as ProjectGallerySectionType } from "../../api/types";
import { getGsap } from "../../animations/gsap";
import { getMediaSrcSet, getMediaUrl } from "../media/mediaUtils";

type ProjectCardSize = "small" | "medium" | "large" | "tall";
type ProjectTone = "yellow" | "light" | "teal";

const CARD_SIZE_CLASS: Record<ProjectCardSize, string> = {
  small: "h-52",
  medium: "h-72",
  large: "h-80",
  tall: "h-[26rem]"
};

const STATUS_TONE_CLASS: Record<ProjectTone, string> = {
  yellow: "bg-[#f6d44f] text-[#1f2937]",
  light: "bg-white text-[#0f766e]",
  teal: "bg-[#0f766e] text-white"
};

export default function ProjectGallerySection({ section }: { section: ProjectGallerySectionType }) {
  const requestedLimit = section.limit && section.limit > 0 ? section.limit : undefined;
  const { data: projects } = useAsync(() => api.getProjects({ limit: requestedLimit }), [requestedLimit]);

  const normalizedItems = useMemo(
    () =>
      (projects ?? []).map((project) => ({
        title: project.title,
        subtitle: project.category ?? null,
        description: project.excerpt ?? null,
        category: (project.category ?? "all").trim().toLowerCase(),
        projectSlug: project.slug,
        statusLabel: project.statusLabel ?? null,
        statusTone: project.statusTone ?? null,
        year: project.year ?? null,
        size: "medium" as const,
        image: project.coverImage ?? null
      })),
    [projects]
  );

  const computedFilters = useMemo(() => {
    const configuredFilters = section.filters.map((filter) => ({
      label: filter.label,
      value: filter.value.trim().toLowerCase()
    }));

    const categoryFilters = Array.from(
      new Set(
        normalizedItems
          .map((item) => item.category || "all")
          .filter((value) => value && value !== "all")
      )
    ).map((value) => ({
      label: value.charAt(0).toUpperCase() + value.slice(1),
      value
    }));

    const merged = configuredFilters.length > 0 ? configuredFilters : categoryFilters;
    const withoutAll = merged.filter((filter) => filter.value !== "all");

    return [{ label: "Tout voir", value: "all" }, ...withoutAll];
  }, [section.filters, normalizedItems]);

  const defaultFilter = computedFilters[0]?.value || "all";
  const [activeFilter, setActiveFilter] = useState(defaultFilter);
  const initialVisible = section.initialVisible && section.initialVisible > 0 ? section.initialVisible : 6;
  const [visibleCount, setVisibleCount] = useState(initialVisible);
  const [cardsContainer, setCardsContainer] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    setActiveFilter(defaultFilter);
    setVisibleCount(initialVisible);
  }, [defaultFilter, initialVisible]);

  const filteredItems = useMemo(() => {
    if (activeFilter === "all") return normalizedItems;
    return normalizedItems.filter((item) => (item.category || "all") === activeFilter);
  }, [activeFilter, normalizedItems]);

  const visibleItems = filteredItems.slice(0, visibleCount);
  const canLoadMore = visibleItems.length < filteredItems.length;

  useEffect(() => {
    if (!cardsContainer || !visibleItems.length) return;
    let active = true;
    let revert: (() => void) | undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const cards = Array.from(cardsContainer.querySelectorAll(".project-gallery-card"));
    if (!cards.length) return;

    void getGsap().then(({ gsap, ScrollTrigger }) => {
      if (!active) return;

      ScrollTrigger.getAll()
        .filter((trigger) => trigger.vars.trigger === cardsContainer)
        .forEach((trigger) => trigger.kill());

      const context = gsap.context(() => {
        gsap.set(cards, { autoAlpha: 0, y: 30 });
        gsap.to(cards, {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: cardsContainer,
            start: "top 90%",
            once: true
          }
        });
      }, cardsContainer);

      revert = () => context.revert();
    });

    return () => {
      active = false;
      if (revert) {
        revert();
      }
    };
  }, [cardsContainer, visibleItems.length, activeFilter]);

  const heroBackground = section.backgroundImage?.url
    ? {
        backgroundImage: `linear-gradient(135deg, rgba(0,130,130,0.96) 0%, rgba(0,158,140,0.92) 60%, rgba(0,130,130,0.96) 100%), url(${section.backgroundImage.url})`,
        backgroundSize: "cover",
        backgroundPosition: "center"
      }
    : {
        background: "linear-gradient(135deg, #008282 0%, #00a489 60%, #008282 100%)"
      };

  return (
    <section className="perf-section bg-[#f1f3f2]" id="galerie">
      <div className="px-6 py-18 md:py-24 text-white" style={heroBackground}>
        <div className="max-w-5xl mx-auto text-center">
          {section.eyebrow ? (
            <span className="inline-flex rounded-full border border-white/40 px-4 py-1 text-xs font-semibold tracking-[0.08em] uppercase">
              {section.eyebrow}
            </span>
          ) : null}
          <h2 className="mt-6 text-4xl md:text-6xl font-bold leading-tight">
            {section.title}
            {section.titleAccent ? <span className="text-[#f6d44f]"> {section.titleAccent}</span> : null}
          </h2>
          {section.description ? <p className="mt-6 text-lg text-white/90 max-w-3xl mx-auto">{section.description}</p> : null}

          {computedFilters.length > 0 ? (
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              {computedFilters.map((filter) => {
                const isActive = activeFilter === filter.value;
                return (
                  <button
                    key={filter.value}
                    type="button"
                    className={`rounded-full border px-5 py-2 text-sm font-semibold transition ${
                      isActive
                        ? "bg-white text-[#00796b] border-white"
                        : "bg-transparent text-white border-white/60 hover:border-white hover:bg-white/10"
                    }`}
                    onClick={() => {
                      setActiveFilter(filter.value);
                      setVisibleCount(initialVisible);
                    }}
                  >
                    {filter.label}
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>

      <div className="px-6 py-14 md:py-18">
        <div className="max-w-7xl mx-auto">
          {visibleItems.length === 0 ? (
            <div className="rounded-2xl bg-white p-10 text-center text-[#0f766e]">
              {section.emptyStateText || "Aucun projet dans cette categorie."}
            </div>
          ) : (
            <div ref={setCardsContainer} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
              {visibleItems.map((item, index) => {
                const size = item.size || "medium";
                const tone = item.statusTone || "yellow";
                const cardContent = (
                  <>
                    {item.image?.url ? (
                      <img
                        src={getMediaUrl(item.image, ["medium", "small"]) || item.image.url}
                        srcSet={getMediaSrcSet(item.image)}
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        alt={item.image.alternativeText || item.title || "Projet"}
                        className="h-full w-full object-cover"
                        loading="lazy"
                        decoding="async"
                        width={item.image.width ?? undefined}
                        height={item.image.height ?? undefined}
                      />
                    ) : (
                      <div className="h-full w-full bg-[#e5e7eb]" />
                    )}
                    {item.statusLabel || item.year ? (
                      <div className="absolute right-3 top-3 flex items-center gap-2">
                        {item.year ? <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-[#4b5563]">{item.year}</span> : null}
                        {item.statusLabel ? (
                          <span className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase ${STATUS_TONE_CLASS[tone]}`}>
                            {item.statusLabel}
                          </span>
                        ) : null}
                      </div>
                    ) : null}
                    {(item.title || item.subtitle || item.description) ? (
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent p-5 text-white">
                        {item.subtitle ? <p className="text-xs uppercase tracking-[0.08em] text-white/80">{item.subtitle}</p> : null}
                        {item.title ? <h3 className="text-lg font-semibold leading-tight">{item.title}</h3> : null}
                        {item.description ? <p className="mt-1 text-sm text-white/85 line-clamp-2">{item.description}</p> : null}
                      </div>
                    ) : null}
                  </>
                );
                return (
                  <article
                    key={`${item.title || "project"}-${index}`}
                    className={`project-gallery-card relative overflow-hidden rounded-[1rem] bg-white shadow-[0_10px_30px_rgba(15,23,42,0.08)] ${CARD_SIZE_CLASS[size]}`}
                  >
                    {item.projectSlug ? (
                      <Link to={`/projets/${item.projectSlug}`} className="absolute inset-0 block" aria-label={`Voir ${item.title || "ce projet"}`}>
                        {cardContent}
                      </Link>
                    ) : (
                      cardContent
                    )}
                  </article>
                );
              })}
            </div>
          )}

          {canLoadMore ? (
            <div className="mt-12 text-center">
              <button
                type="button"
                className="rounded-full border-2 border-[#008282] px-8 py-3 text-sm font-semibold text-[#00796b] transition hover:bg-[#008282] hover:text-white"
                onClick={() => setVisibleCount((count) => count + initialVisible)}
              >
                {section.loadMoreLabel || "Charger plus de projets"}
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
