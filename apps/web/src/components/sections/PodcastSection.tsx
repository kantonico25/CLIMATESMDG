import { useState } from "react";
import type { PodcastSection as PodcastSectionType } from "../../api/types";
import { Link } from "react-router-dom";
import { getMediaSrcSet, getMediaUrl } from "../media/mediaUtils";
import PodcastPlayerModal from "../podcast/PodcastPlayerModal";

const DEFAULT_ACCENT = "Podcasts";
const EMISSIONS_ROUTE = "/emissions";
const HOME_PODCAST_LIMIT = 6;

const normalizeText = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const shouldUseEmissionsRoute = (buttonLabel?: string | null) =>
  Boolean(buttonLabel && normalizeText(buttonLabel).includes("voir toutes les emissions"));

export default function PodcastSection({ section }: { section: PodcastSectionType }) {
  const titlePrefix = section.title?.trim() || "Nos";
  const titleAccent = section.titleAccent?.trim() || DEFAULT_ACCENT;
  const buttonTarget = shouldUseEmissionsRoute(section.buttonLabel) ? EMISSIONS_ROUTE : section.buttonUrl;
  const isInternalRoute = Boolean(buttonTarget && buttonTarget.startsWith("/") && !buttonTarget.startsWith("/#"));
  const [activeMedia, setActiveMedia] = useState<{ title: string; url: string } | null>(null);
  const resolvePlayableUrl = (listenUrl?: string | null, mediaUrl?: string | null) => mediaUrl || listenUrl;
  const visibleItems = section.items.slice(0, HOME_PODCAST_LIMIT);

  const openPlayer = (title: string, url?: string | null) => {
    if (!url || url === "#") return;
    setActiveMedia({ title, url });
  };

  return (
    <section id="podcasts" className="perf-section bg-slate-100 py-20 px-4 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-slate-900 md:text-5xl">
            {titlePrefix}{" "}
            <span className="relative inline-block text-teal-700 after:absolute after:left-1/2 after:top-[calc(100%+8px)] after:h-[3px] after:w-14 after:-translate-x-1/2 after:rounded-full after:bg-[#ff7f6f]">
              {titleAccent}
            </span>
          </h2>
          {section.subtitle ? <p className="mx-auto mt-7 text-base leading-relaxed text-slate-600">{section.subtitle}</p> : null}
        </div>

        {visibleItems.length ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {visibleItems.map((item, index) => (
              <article
                key={`${item.title}-${index}`}
                className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl"
              >
                <div className="relative aspect-video overflow-hidden bg-slate-200">
                  {item.coverImage?.url ? (
                    <img
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      src={getMediaUrl(item.coverImage, ["large", "medium", "small"]) || item.coverImage.url}
                      srcSet={getMediaSrcSet(item.coverImage)}
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      alt={item.coverImage.alternativeText || item.title}
                      loading="lazy"
                      decoding="async"
                      width={item.coverImage.width ?? undefined}
                      height={item.coverImage.height ?? undefined}
                    />
                  ) : null}

                  <button
                    type="button"
                    className="absolute inset-0 flex items-center justify-center bg-teal-700/30 transition-colors duration-300 group-hover:bg-teal-700/50"
                    onClick={() => openPlayer(item.title, resolvePlayableUrl(item.listenUrl, item.mediaFile?.url))}
                    aria-label={`Lire ${item.title}`}
                  >
                    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-teal-700 shadow-lg">
                      <svg aria-hidden="true" className="ml-1 h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </span>
                  </button>

                  {item.duration ? (
                    <span className="absolute bottom-4 right-4 rounded bg-black/60 px-2 py-1 text-xs text-white">{item.duration}</span>
                  ) : null}
                </div>

                <div className="flex h-full flex-col p-6">
                  <div className="mb-3 flex items-center gap-2">
                    {item.episodeLabel ? (
                      <span className="text-xs font-semibold uppercase tracking-wider text-teal-700">{item.episodeLabel}</span>
                    ) : null}
                    {item.episodeLabel && item.publishedAtLabel ? <span className="text-slate-300">|</span> : null}
                    {item.publishedAtLabel ? <time className="text-xs text-slate-500">{item.publishedAtLabel}</time> : null}
                  </div>

                  <h3 className="mb-3 text-2xl font-bold leading-tight text-slate-900 transition-colors group-hover:text-teal-700">
                    {item.title}
                  </h3>

                  {item.description ? <p className="mb-6 text-sm leading-relaxed text-slate-600">{item.description}</p> : null}

                  <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
                    <span className="text-sm font-medium text-slate-700">{item.guestLabel}</span>
                    {resolvePlayableUrl(item.listenUrl, item.mediaFile?.url) ? (
                      <a
                        href={resolvePlayableUrl(item.listenUrl, item.mediaFile?.url) || "#"}
                        className="inline-flex items-center gap-1 text-sm font-semibold text-teal-700 transition-colors hover:text-teal-900"
                        onClick={(event) => {
                          event.preventDefault();
                          openPlayer(item.title, resolvePlayableUrl(item.listenUrl, item.mediaFile?.url));
                        }}
                      >
                        <span>{item.listenLabel || "Ecouter"}</span>
                        <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                        </svg>
                      </a>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-teal-700">
                        <span>{item.listenLabel || "Ecouter"}</span>
                        <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                        </svg>
                      </span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : null}

        {section.buttonLabel && buttonTarget ? (
          <div className="mt-12 text-right">
            {isInternalRoute ? (
              <Link
                to={buttonTarget}
                className="group inline-flex items-center gap-2 text-lg font-semibold text-teal-700 transition-all hover:text-teal-900"
              >
                <span>{section.buttonLabel}</span>
                <svg aria-hidden="true" className="h-5 w-5 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M17 8l4 4m0 0l-4 4m4-4H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </Link>
            ) : (
              <a
                href={buttonTarget}
                className="group inline-flex items-center gap-2 text-lg font-semibold text-teal-700 transition-all hover:text-teal-900"
              >
                <span>{section.buttonLabel}</span>
                <svg aria-hidden="true" className="h-5 w-5 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M17 8l4 4m0 0l-4 4m4-4H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </a>
            )}
          </div>
        ) : null}
      </div>
      <PodcastPlayerModal
        title={activeMedia?.title}
        url={activeMedia?.url}
        onClose={() => setActiveMedia(null)}
      />
    </section>
  );
}
