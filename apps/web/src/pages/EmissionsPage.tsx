import { useMemo, useState } from "react";
import { api } from "../api/client";
import type { Media, PodcastSection } from "../api/types";
import { useAsync } from "../api/useAsync";
import { getMediaSrcSet, getMediaUrl } from "../components/media/mediaUtils";
import PodcastPlayerModal from "../components/podcast/PodcastPlayerModal";

type Episode = {
  category: string;
  title: string;
  guest: string;
  date: string;
  duration?: string | null;
  listenLabel: string;
  playUrl: string;
  coverImage?: Media | null;
  coverFallback?: string;
};

const FALLBACK_IMAGES = [
  "/assets/images/hero.webp",
  "/assets/images/image%20(1).webp",
  "/assets/images/image%20(2).webp",
  "/assets/images/image%20(3).webp",
  "/assets/images/image%20(4).webp",
  "/assets/images/image%20(5).webp"
];

const FALLBACK_EPISODES: Episode[] = [
  {
    category: "Energie",
    title: "L'avenir de l'hydrogene vert",
    guest: "Jean Dupont",
    date: "12 Oct 2023",
    duration: "45:12",
    listenLabel: "ECOUTER",
    playUrl: "#",
    coverFallback: FALLBACK_IMAGES[0]
  },
  {
    category: "Oceans",
    title: "Restaurer les recifs coralliens",
    guest: "Marie Curie",
    date: "10 Oct 2023",
    duration: "32:05",
    listenLabel: "ECOUTER",
    playUrl: "#",
    coverFallback: FALLBACK_IMAGES[1]
  },
  {
    category: "Urbanisme",
    title: "La transition energetique urbaine",
    guest: "Lucas Martin",
    date: "05 Oct 2023",
    duration: "58:30",
    listenLabel: "ECOUTER",
    playUrl: "#",
    coverFallback: FALLBACK_IMAGES[2]
  },
  {
    category: "Forets",
    title: "Protection des forets primaires",
    guest: "Sarah Legrand",
    date: "01 Oct 2023",
    duration: "41:20",
    listenLabel: "ECOUTER",
    playUrl: "#",
    coverFallback: FALLBACK_IMAGES[3]
  },
  {
    category: "Solaire",
    title: "Democratiser l'energie solaire",
    guest: "Marc Vasseur",
    date: "28 Sep 2023",
    duration: "28:45",
    listenLabel: "ECOUTER",
    playUrl: "#",
    coverFallback: FALLBACK_IMAGES[4]
  },
  {
    category: "Dechets",
    title: "Economie circulaire : mythe ou realite ?",
    guest: "Julie Bernard",
    date: "25 Sep 2023",
    duration: "35:50",
    listenLabel: "ECOUTER",
    playUrl: "#",
    coverFallback: FALLBACK_IMAGES[5]
  },
  {
    category: "Science",
    title: "Comprendre le rapport du GIEC",
    guest: "Pr. Alain Morel",
    date: "20 Sep 2023",
    duration: "52:10",
    listenLabel: "ECOUTER",
    playUrl: "#",
    coverFallback: FALLBACK_IMAGES[1]
  },
  {
    category: "Philosophie",
    title: "Retrouver le sens de la nature",
    guest: "Sophie Calvet",
    date: "15 Sep 2023",
    duration: "39:15",
    listenLabel: "ECOUTER",
    playUrl: "#",
    coverFallback: FALLBACK_IMAGES[3]
  }
];

export default function EmissionsPage() {
  const { data } = useAsync(() => api.getPage("home"), []);
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [sortMode, setSortMode] = useState<"recent" | "alpha">("recent");
  const [activeMedia, setActiveMedia] = useState<{ title: string; url: string } | null>(null);

  const openPlayer = (title: string, url?: string | null) => {
    if (!url || url === "#") return;
    setActiveMedia({ title, url });
  };

  const podcastSection = useMemo(
    () => data?.sections.find((section): section is PodcastSection => section.type === "podcast") ?? null,
    [data]
  );

  const episodes = useMemo(() => {
    if (!podcastSection?.items.length) return FALLBACK_EPISODES;

    return podcastSection.items.map((item, index): Episode => {
      const guest = item.guestLabel?.replace(/^avec\s+/i, "").trim() || "Equipe CliMates";
      return {
        category: item.episodeLabel?.trim() || "Podcast",
        title: item.title,
        guest,
        date: item.publishedAtLabel?.trim() || "Date a venir",
        duration: item.duration,
        listenLabel: (item.listenLabel || "Ecouter").toUpperCase(),
        playUrl: item.mediaFile?.url || item.listenUrl || "#",
        coverImage: item.coverImage,
        coverFallback: FALLBACK_IMAGES[index % FALLBACK_IMAGES.length]
      };
    });
  }, [podcastSection]);

  const categories = useMemo(
    () => ["Tous", ...new Set(episodes.map((episode) => episode.category))],
    [episodes]
  );

  const visibleEpisodes = useMemo(() => {
    const filtered =
      activeCategory === "Tous"
        ? episodes
        : episodes.filter((episode) => episode.category === activeCategory);

    if (sortMode === "alpha") {
      return [...filtered].sort((a, b) => a.title.localeCompare(b.title, "fr"));
    }

    return filtered;
  }, [activeCategory, episodes, sortMode]);

  return (
    <section className="bg-slate-50 px-4 py-12 sm:px-6 md:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 border-b border-slate-200 pb-6 md:mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-6xl">
            Toutes nos emissions
          </h1>
          <p className="mt-4 max-w-3xl text-base text-slate-600 md:text-2xl">
            Plongez au coeur des enjeux ecologiques contemporains a travers nos entretiens, reportages et analyses
            d&apos;experts.
          </p>
        </div>

        <div className="mb-10 flex flex-wrap items-center gap-3 border-y border-slate-200 py-4">
          {categories.map((category) => {
            const selected = category === activeCategory;
            return (
              <button
                key={category}
                type="button"
                className={
                  selected
                    ? "rounded-full bg-teal-700 px-5 py-2 text-sm font-semibold text-white shadow-md"
                    : "rounded-full bg-slate-100 px-5 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-200"
                }
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            );
          })}

          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Trier par:</span>
            <select
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-teal-700 outline-none"
              value={sortMode}
              onChange={(event) => setSortMode(event.target.value as "recent" | "alpha")}
            >
              <option value="recent">Plus recents</option>
              <option value="alpha">A-Z</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-4">
          {visibleEpisodes.map((episode, index) => (
            <article key={`${episode.title}-${index}`} className="group flex flex-col gap-4">
              <div className="relative aspect-video overflow-hidden rounded-2xl shadow-md transition-shadow duration-300 group-hover:shadow-xl">
                {episode.coverImage?.url ? (
                  <img
                    src={getMediaUrl(episode.coverImage, ["large", "medium", "small"]) || episode.coverImage.url}
                    srcSet={getMediaSrcSet(episode.coverImage)}
                    sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
                    alt={episode.coverImage.alternativeText || episode.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <img
                    src={episode.coverFallback || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length]}
                    alt={episode.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                )}

                {episode.duration ? (
                  <span className="absolute bottom-3 right-3 rounded bg-black/70 px-2 py-1 text-[10px] font-bold text-white">
                    {episode.duration}
                  </span>
                ) : null}

                <button
                  type="button"
                  className="absolute inset-0 flex items-center justify-center bg-slate-900/20 opacity-0 transition-all duration-300 group-hover:opacity-100"
                  onClick={() => openPlayer(episode.title, episode.playUrl)}
                  aria-label={`Lire ${episode.title}`}
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-700 text-white shadow-xl">
                    <svg aria-hidden="true" className="ml-0.5 h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                </button>
              </div>

              <div>
                <span className="rounded bg-teal-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-teal-700">
                  {episode.category}
                </span>
                <h2 className="mt-3 text-2xl font-bold leading-snug text-slate-900 transition-colors group-hover:text-teal-700">
                  {episode.title}
                </h2>
                <p className="mt-1 text-base text-slate-500">
                  avec <span className="font-semibold text-slate-700">{episode.guest}</span>
                </p>
                <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4">
                  <span className="text-sm text-slate-400">{episode.date}</span>
                  <a
                    href={episode.playUrl}
                    className="inline-flex items-center gap-1 text-sm font-bold text-teal-700 transition-all hover:gap-2"
                    onClick={(event) => {
                      event.preventDefault();
                      openPlayer(episode.title, episode.playUrl);
                    }}
                  >
                    {episode.listenLabel}
                    <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-14 flex items-center justify-center gap-2 sm:gap-4">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition-colors hover:border-teal-700 hover:text-teal-700"
          >
            <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </button>
          <button type="button" className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-700 font-bold text-white">
            1
          </button>
          <button type="button" className="flex h-10 w-10 items-center justify-center rounded-full font-bold text-slate-600 transition-colors hover:bg-slate-100">
            2
          </button>
          <button type="button" className="flex h-10 w-10 items-center justify-center rounded-full font-bold text-slate-600 transition-colors hover:bg-slate-100">
            3
          </button>
          <span className="text-slate-400">...</span>
          <button type="button" className="flex h-10 w-10 items-center justify-center rounded-full font-bold text-slate-600 transition-colors hover:bg-slate-100">
            12
          </button>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition-colors hover:border-teal-700 hover:text-teal-700"
          >
            <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </button>
        </div>
      </div>
      <PodcastPlayerModal
        title={activeMedia?.title}
        url={activeMedia?.url}
        onClose={() => setActiveMedia(null)}
      />
    </section>
  );
}
