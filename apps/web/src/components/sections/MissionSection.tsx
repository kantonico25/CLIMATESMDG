import DOMPurify from "dompurify";
import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { createPortal } from "react-dom";
import type { MissionSection as MissionSectionType } from "../../api/types";
import { getGsap } from "../../animations/gsap";
import Icon from "../Icon/Icon";

type NarrativeTheme = "growth" | "horizon" | "mosaic" | "blueprint" | "ripple" | "discovery";

type NarrativeState = {
  title: string;
  content: string;
  theme: NarrativeTheme;
  backgroundImageUrl?: string | null;
  overlayColor?: string | null;
};

const PILLAR_THEMES: NarrativeTheme[] = ["growth", "horizon", "growth"];
const AXIS_THEMES: NarrativeTheme[] = ["blueprint", "ripple", "discovery"];

function NarrativeVisual({ theme }: { theme: NarrativeTheme }) {
  if (theme === "growth") {
    return (
      <svg className="h-32 w-32" viewBox="0 0 100 100" aria-hidden="true">
        <path
          className="mission-narrative-leaf"
          d="M50 90 Q50 50 80 20 M50 90 Q50 50 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
    );
  }

  if (theme === "horizon") {
    return <Icon name="eye" className="text-8xl mission-narrative-pulse" />;
  }

  if (theme === "mosaic") {
    return (
      <div className="grid grid-cols-2 gap-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-8 w-8 rounded bg-white/30 mission-narrative-mosaic-tile" />
        ))}
      </div>
    );
  }

  if (theme === "blueprint") {
    return (
      <svg className="h-32 w-32" viewBox="0 0 24 24" aria-hidden="true">
        <path
          className="mission-narrative-blueprint-line"
          d="M3 21h18M3 7V5a2 2 0 012-2h14a2 2 0 012 2v2M5 7h14v10H5V7z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
        />
      </svg>
    );
  }

  if (theme === "ripple") {
    return (
      <div className="relative flex h-32 w-32 items-center justify-center">
        <span className="absolute h-10 w-10 rounded-full border border-white/40 mission-narrative-ripple" />
        <span
          className="absolute h-10 w-10 rounded-full border border-white/40 mission-narrative-ripple"
          style={{ animationDelay: "1s" }}
        />
        <Icon name="users" className="text-6xl" />
      </div>
    );
  }

  return (
    <div className="relative h-32 w-20 overflow-hidden rounded-b-2xl border-4 border-white">
      <div className="absolute bottom-0 left-0 right-0 bg-white/40 mission-narrative-liquid" />
      <Icon name="microscope" className="absolute inset-0 flex items-center justify-center text-white" />
    </div>
  );
}

const getThemeClassName = (theme: NarrativeTheme): string => {
  if (theme === "growth") return "mission-narrative-theme-growth";
  if (theme === "horizon") return "mission-narrative-theme-horizon";
  if (theme === "mosaic") return "mission-narrative-theme-mosaic";
  if (theme === "blueprint") return "mission-narrative-theme-blueprint";
  if (theme === "ripple") return "mission-narrative-theme-ripple";
  return "mission-narrative-theme-discovery";
};

const DEFAULT_OVERLAY_BY_THEME: Record<NarrativeTheme, string> = {
  growth: "rgb(0 139 139 / 0.55)",
  horizon: "rgb(1 42 42 / 0.62)",
  mosaic: "rgb(0 139 139 / 0.56)",
  blueprint: "rgb(26 54 93 / 0.6)",
  ripple: "rgb(255 193 7 / 0.55)",
  discovery: "rgb(0 139 139 / 0.58)"
};

export default function MissionSection({ section }: { section: MissionSectionType }) {
  const [activeNarrative, setActiveNarrative] = useState<NarrativeState | null>(null);
  const [axesContainer, setAxesContainer] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!activeNarrative) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveNarrative(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeNarrative]);

  const sanitizedPopupContent = useMemo(
    () => (activeNarrative?.content ? DOMPurify.sanitize(activeNarrative.content) : ""),
    [activeNarrative]
  );

  const generatedValuesPopupContent = useMemo(() => {
    const labels = section.values.map((value) => value.label).filter(Boolean);
    if (!labels.length) return "";
    return `<ul>${labels.map((label) => `<li>${label}</li>`).join("")}</ul>`;
  }, [section.values]);

  const hasValuesPopup = Boolean(section.valuesPopupTitle || section.valuesPopupContent || generatedValuesPopupContent);

  const popupBackgroundStyle = useMemo<CSSProperties | undefined>(() => {
    if (!activeNarrative?.backgroundImageUrl) return undefined;
    const overlay = activeNarrative.overlayColor || DEFAULT_OVERLAY_BY_THEME[activeNarrative.theme];
    return {
      backgroundImage: `linear-gradient(${overlay}, ${overlay}), url("${activeNarrative.backgroundImageUrl}")`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat"
    };
  }, [activeNarrative]);

  useEffect(() => {
    if (!axesContainer) return;
    let active = true;
    let revert: (() => void) | undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const axisCards = Array.from(axesContainer.querySelectorAll(".mission-axis-card"));
    if (!axisCards.length) return;

    void getGsap().then(({ gsap }) => {
      if (!active) return;
      const context = gsap.context(() => {
        gsap.set(axisCards, { autoAlpha: 0, y: 30 });
        gsap.to(axisCards, {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: axesContainer,
            start: "top 90%",
            once: true
          }
        });
      }, axesContainer);

      revert = () => context.revert();
    });

    return () => {
      active = false;
      if (revert) {
        revert();
      }
    };
  }, [axesContainer, section.axes.length]);

  return (
    <>
      <section id="mission" className="perf-section py-16 bg-slate-50 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            {(section.pillarsTitle || section.pillarsAccent) && (
              <h2 className="text-3xl font-bold">
                {section.pillarsTitle} {section.pillarsAccent ? <span className="text-teal-600">{section.pillarsAccent}</span> : null}
              </h2>
            )}
            <div className="w-24 h-1 bg-red-300 mx-auto mt-2 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {section.pillars.map((pillar, index) => {
              const popupTitle = pillar.popupTitle || pillar.title || "";
              const popupContent = pillar.popupContent || pillar.description || "";
              const popupTheme = pillar.popupTheme || PILLAR_THEMES[index] || "growth";
              const hasPopup = Boolean(popupTitle || popupContent);

              return (
                <div
                  key={`${pillar.title}-${index}`}
                  className={`bg-white p-8 rounded-2xl shadow-md text-center border-b-4 transition-all duration-300 ${
                    hasPopup ? "cursor-pointer hover:-translate-y-2 hover:shadow-xl" : ""
                  }`}
                  style={{ borderBottomColor: pillar.accentColor || "#0d9488" }}
                  onClick={
                    hasPopup
                      ? () =>
                          setActiveNarrative({
                            title: popupTitle,
                            content: popupContent,
                            theme: popupTheme,
                            backgroundImageUrl: pillar.popupBackgroundImage?.url ?? null,
                            overlayColor: pillar.popupOverlayColor ?? null
                          })
                      : undefined
                  }
                >
                  {pillar.iconName ? (
                    <div className="text-4xl mb-4 flex justify-center" style={{ color: pillar.accentColor || "#0d9488" }}>
                      <Icon name={pillar.iconName} />
                    </div>
                  ) : null}
                  {pillar.title ? <h4 className="font-bold mb-3">{pillar.title}</h4> : null}
                  {pillar.description ? <p className="text-xs text-gray-500 italic">{pillar.description}</p> : null}
                </div>
              );
            })}
            {section.values.length ? (
              <div
                className={`bg-teal-600 text-white p-8 rounded-2xl shadow-md transition-all duration-300 ${
                  hasValuesPopup ? "cursor-pointer hover:-translate-y-2 hover:shadow-xl" : ""
                }`}
                onClick={
                  hasValuesPopup
                    ? () =>
                        setActiveNarrative({
                          title: section.valuesPopupTitle || section.valuesTitle || "Nos Valeurs",
                          content: section.valuesPopupContent || generatedValuesPopupContent,
                          theme: section.valuesPopupTheme || "mosaic",
                          backgroundImageUrl: section.valuesPopupBackgroundImage?.url ?? null,
                          overlayColor: section.valuesPopupOverlayColor ?? null
                        })
                    : undefined
                }
              >
                {section.valuesTitle ? <h4 className="font-bold border-b border-slate-100 pb-2 mb-4 text-center">{section.valuesTitle}</h4> : null}
                <ul className="text-sm space-y-3">
                  {section.values.map((value, index) => (
                    <li key={`${value.label}-${index}`} className="flex items-center">
                      {value.iconName ? <Icon name={value.iconName} className="text-yellow-400 mr-3" /> : null}
                      {value.label}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          {section.axes.length ? (
            <>
              <div className="text-center mb-12">
                {section.axesTitle ? <h2 className="text-3xl font-bold text-teal-600">{section.axesTitle}</h2> : null}
                <div className="w-24 h-1 bg-red-300 mx-auto mt-2 rounded-full"></div>
              </div>

              <div ref={setAxesContainer} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {section.axes.map((axis, index) => {
                  const popupTitle = axis.popupTitle || axis.title || "";
                  const popupContent = axis.popupContent || axis.description || "";
                  const popupTheme = axis.popupTheme || AXIS_THEMES[index] || "discovery";
                  const hasPopup = Boolean(popupTitle || popupContent);

                  return (
                    <div
                      key={`${axis.title}-${index}`}
                      className={`mission-axis-card relative bg-white p-8 rounded-2xl shadow-md pt-12 transition-all duration-300 ${
                        hasPopup ? "cursor-pointer hover:-translate-y-2 hover:shadow-xl" : ""
                      }`}
                      onClick={
                        hasPopup
                          ? () =>
                              setActiveNarrative({
                                title: popupTitle,
                                content: popupContent,
                                theme: popupTheme,
                                backgroundImageUrl: axis.popupBackgroundImage?.url ?? null,
                                overlayColor: axis.popupOverlayColor ?? null
                              })
                          : undefined
                      }
                    >
                      <div
                        className="absolute -top-4 left-4 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold"
                        style={{ backgroundColor: axis.badgeColor || "#f87171" }}
                      >
                        {axis.order ?? index + 1}
                      </div>
                      {axis.iconName ? (
                        <div className="text-4xl mb-4" style={{ color: axis.badgeColor || "#0f766e" }}>
                          <Icon name={axis.iconName} />
                        </div>
                      ) : null}
                      {axis.title ? <h4 className="font-bold text-lg mb-2">{axis.title}</h4> : null}
                      {axis.description ? <p className="text-xs text-gray-500 leading-relaxed">{axis.description}</p> : null}
                    </div>
                  );
                })}
              </div>
            </>
          ) : null}
        </div>
      </section>

      {activeNarrative && typeof document !== "undefined"
        ? createPortal(
            <div
              role="dialog"
              aria-modal="true"
              className={`fixed inset-0 z-50 flex items-center justify-center px-6 py-8 mission-narrative-overlay ${getThemeClassName(
                activeNarrative.theme
              )}`}
              style={popupBackgroundStyle}
              onClick={() => setActiveNarrative(null)}
            >
              <button
                type="button"
                className="absolute right-6 top-6 text-white/90 transition-transform duration-300 hover:rotate-90"
                aria-label="Close popup"
                onClick={() => setActiveNarrative(null)}
              >
                <Icon name="xmark" className="text-5xl" />
              </button>

              <div className="w-full max-w-4xl text-center text-white mission-narrative-modal">
                <div className="mb-8 flex justify-center mission-narrative-stagger mission-narrative-stagger-1">
                  <NarrativeVisual theme={activeNarrative.theme} />
                </div>
                <h2 className="mb-6 text-4xl font-bold uppercase tracking-tight md:text-6xl mission-narrative-stagger mission-narrative-stagger-2">
                  {activeNarrative.title}
                </h2>
                <div
                  className="mx-auto max-w-2xl text-xl leading-relaxed md:text-2xl mission-narrative-stagger mission-narrative-stagger-3"
                  dangerouslySetInnerHTML={{ __html: sanitizedPopupContent }}
                />
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  );
}

