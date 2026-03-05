import DOMPurify from "dompurify";
import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api/client";
import { useAsync } from "../api/useAsync";
import type { ProjectSummaryDTO } from "../api/types";
import Icon from "../components/Icon/Icon";
import PageLoader from "../components/loading/PageLoader";
import Reveal from "../components/Reveal/Reveal";
import { getMediaSrcSet, getMediaUrl } from "../components/media/mediaUtils";

const toneClass = (tone?: ProjectSummaryDTO["statusTone"] | null) => {
  if (tone === "light") return "bg-slate-100 text-slate-700";
  if (tone === "teal") return "bg-[#0f766e] text-white";
  return "bg-[#f6d44f] text-[#1f2937]";
};

export default function ProjectDetailPage() {
  const params = useParams();
  const slug = params.slug ?? "";
  const { data: project, loading, error } = useAsync(() => api.getProject(slug), [slug], { keepPreviousData: true });
  const { data: allProjects } = useAsync(api.getProjects, []);

  const [query, setQuery] = useState("");
  const [activeStatus, setActiveStatus] = useState("all");
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  const statusFilters = useMemo(() => {
    const statuses = (allProjects ?? [])
      .map((item) => item.statusLabel?.trim())
      .filter((label): label is string => Boolean(label));
    return ["all", ...Array.from(new Set(statuses))];
  }, [allProjects]);

  const sidebarItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return (allProjects ?? []).filter((item) => {
      const matchesStatus = activeStatus === "all" || item.statusLabel === activeStatus;
      const haystack = `${item.title} ${item.category || ""} ${item.excerpt || ""}`.toLowerCase();
      const matchesQuery = !normalizedQuery || haystack.includes(normalizedQuery);
      return matchesStatus && matchesQuery;
    });
  }, [allProjects, activeStatus, query]);

  if (loading && !project) return <PageLoader label="Loading project..." />;
  if (error || !project) return <div className="py-16 text-center text-red-600">Project not found.</div>;

  const sanitizedBody = project.body ? DOMPurify.sanitize(project.body) : "";
  const mainImages = [project.coverImage, ...project.gallery].filter(
    (image): image is NonNullable<typeof image> => Boolean(image)
  );
  const [heroImage, ...secondaryImages] = mainImages;
  const metric = project.stats[0];
  const galleryImages = secondaryImages.length > 0 ? secondaryImages.slice(0, 4) : heroImage ? [heroImage] : [];

  return (
    <Reveal>
      <section className="perf-section min-h-screen bg-[#edf2f2]">
        <div className="mx-auto flex max-w-[1500px] gap-4 px-4 py-8 md:gap-6 md:px-6 lg:gap-8 lg:px-8">
          <aside
            className={`sticky top-24 hidden h-[calc(100vh-7rem)] shrink-0 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-[width] duration-300 lg:block ${
              isSidebarExpanded ? "w-[340px]" : "w-20"
            }`}
          >
            <div className="h-full overflow-y-auto p-3">
              <button
                type="button"
                onClick={() => setIsSidebarExpanded((previous) => !previous)}
                className="flex h-12 w-12 items-center justify-center rounded-xl text-[#007f80] transition hover:bg-[#e7f4f4]"
                aria-label={isSidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
              >
                <Icon name={isSidebarExpanded ? "xmark" : "bars"} className="text-2xl" />
              </button>

              {isSidebarExpanded ? (
                <>
                  <h1 className="mt-5 text-2xl font-bold text-[#0f172a]">Nos Projets</h1>
                  <p className="mt-1 text-sm text-slate-500">Selectionnez un projet pour voir le detail.</p>
                  <input
                    type="text"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Rechercher un projet..."
                    className="mt-4 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#007f80]"
                  />
                  <div className="mt-3 flex flex-wrap gap-2">
                    {statusFilters.map((status) => (
                      <button
                        key={status}
                        type="button"
                        className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                          activeStatus === status
                            ? "bg-[#007f80] text-white"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                        onClick={() => setActiveStatus(status)}
                      >
                        {status === "all" ? "Tout" : status}
                      </button>
                    ))}
                  </div>

                  <div className="mt-4 space-y-2 pb-3">
                    {sidebarItems.map((item) => (
                      <Link
                        key={item.slug}
                        to={`/projets/${item.slug}`}
                        className={`block rounded-2xl border p-2.5 transition ${
                          item.slug === slug
                            ? "border-[#007f80] bg-[#ecf8f8]"
                            : "border-transparent bg-slate-50 hover:border-slate-200"
                        }`}
                      >
                        <div className="flex gap-3">
                          {item.coverImage?.url ? (
                            <img
                              src={getMediaUrl(item.coverImage, ["thumbnail", "small"]) || item.coverImage.url}
                              srcSet={getMediaSrcSet(item.coverImage)}
                              sizes="56px"
                              alt={item.coverImage.alternativeText || item.title}
                              className="h-14 w-14 rounded-xl object-cover"
                              loading="lazy"
                              decoding="async"
                              width={item.coverImage.width ?? undefined}
                              height={item.coverImage.height ?? undefined}
                            />
                          ) : (
                            <div className="h-14 w-14 rounded-xl bg-slate-200" />
                          )}
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h2 className="truncate text-sm font-semibold text-[#0f172a]">{item.title}</h2>
                              {item.statusLabel ? (
                                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${toneClass(item.statusTone)}`}>
                                  {item.statusLabel}
                                </span>
                              ) : null}
                            </div>
                            {item.category ? <p className="truncate text-xs text-[#007f80]">{item.category}</p> : null}
                            {item.excerpt ? <p className="truncate text-xs text-slate-500">{item.excerpt}</p> : null}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <div className="mt-5 flex flex-col items-center gap-3">
                  <button
                    type="button"
                    className="h-12 w-12 rounded-xl bg-[#e7f4f4] text-[#007f80]"
                    aria-label="Search projects"
                  >
                    <Icon name="eye" className="mx-auto text-xl" />
                  </button>
                  <button
                    type="button"
                    className="h-12 w-12 rounded-xl bg-[#e7f4f4] text-[#007f80]"
                    aria-label="Project categories"
                  >
                    <Icon name="bars" className="mx-auto text-xl" />
                  </button>
                  <button
                    type="button"
                    className="h-12 w-12 rounded-xl bg-[#007f80] text-white"
                    aria-label="Current project"
                  >
                    <Icon name="landmark" className="mx-auto text-xl" />
                  </button>
                </div>
              )}
            </div>
          </aside>

          <div className="min-w-0 flex-1 rounded-3xl bg-transparent px-1 md:px-2 lg:px-4">
            <nav className="mb-8 flex items-center gap-2 text-sm font-medium text-[#007f80]">
              <Link to="/galerie" className="hover:underline">
                Projets
              </Link>
              <span>/</span>
              <span>{project.category || "Projet"}</span>
              <span>/</span>
              <span className="text-slate-700">{project.title}</span>
            </nav>

            <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="space-y-4">
                {project.statusLabel ? (
                  <span
                    className={`inline-flex rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest ${toneClass(project.statusTone)}`}
                  >
                    {project.statusLabel}
                  </span>
                ) : null}
                <h1 className="text-4xl font-extrabold leading-tight text-[#0f172a] md:text-5xl">{project.title}</h1>
                <p className="text-sm font-medium text-[#007f80]">{project.year || "Projet en cours"}</p>
              </div>

              {metric ? (
                <div className="flex min-w-[210px] items-center gap-4 rounded-2xl bg-[#007f80] p-5 text-white shadow-xl shadow-[#007f80]/20">
                  <div className="rounded-xl bg-white/20 p-3">
                    <Icon name="users" className="text-3xl" />
                  </div>
                  <div>
                    <p className="text-3xl font-black leading-none">{metric.value}</p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-white/85">{metric.label}</p>
                  </div>
                </div>
              ) : null}
            </div>

            {heroImage?.url ? (
              <div className="relative mb-12 overflow-hidden rounded-[1.75rem] border-4 border-white shadow-2xl">
                <img
                  src={getMediaUrl(heroImage, ["xlarge", "large", "medium"]) || heroImage.url}
                  srcSet={getMediaSrcSet(heroImage)}
                  sizes="(min-width: 1024px) 70vw, 100vw"
                  alt={heroImage.alternativeText || project.title}
                  className="aspect-video w-full object-cover"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  width={heroImage.width ?? undefined}
                  height={heroImage.height ?? undefined}
                />
              </div>
            ) : null}

            <div className="mb-16 grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
              <div>
                <h2 className="text-3xl font-bold text-[#007f80]">A propos du projet</h2>
                {project.summary ? <p className="mt-5 text-lg leading-relaxed text-slate-700">{project.summary}</p> : null}
                {sanitizedBody ? (
                  <article className="prose mt-6 max-w-none text-slate-700" dangerouslySetInnerHTML={{ __html: sanitizedBody }} />
                ) : null}
              </div>

              <aside className="h-fit rounded-3xl border border-[#007f80]/15 bg-[#e8f3f3] p-6">
                <h3 className="text-lg font-bold text-[#007f80]">Details du projet</h3>
                <div className="mt-4 space-y-3 text-sm text-slate-700">
                  {project.category ? (
                    <div className="flex items-center gap-2">
                      <Icon name="landmark" className="text-[#007f80]" />
                      <span className="font-medium">{project.category}</span>
                    </div>
                  ) : null}
                  {project.year ? (
                    <div className="flex items-center gap-2">
                      <Icon name="bullseye" className="text-[#007f80]" />
                      <span className="font-medium">Annee : {project.year}</span>
                    </div>
                  ) : null}
                  {project.stats.slice(1, 3).map((stat, index) => (
                    <div key={`${stat.label}-${index}`} className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#007f80]" aria-hidden="true" />
                      <span className="font-medium">
                        {stat.label} : {stat.value}
                      </span>
                    </div>
                  ))}
                </div>
              </aside>
            </div>

            {galleryImages.length > 0 ? (
              <section className="pb-6">
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="text-3xl font-bold text-slate-900">Galerie Photo</h2>
                  {secondaryImages.length > 4 ? (
                    <button type="button" className="text-sm font-bold text-[#007f80] hover:underline">
                      Voir tout
                    </button>
                  ) : null}
                </div>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  {galleryImages.map((image, index) => (
                    <div key={`${image.url}-${index}`} className="overflow-hidden rounded-2xl shadow-lg">
                      <img
                        src={getMediaUrl(image, ["medium", "small"]) || image.url}
                        srcSet={getMediaSrcSet(image)}
                        sizes="(min-width: 768px) 25vw, 50vw"
                        alt={image.alternativeText || project.title}
                        className="aspect-square w-full object-cover transition duration-300 hover:scale-105"
                        loading="lazy"
                        decoding="async"
                        width={image.width ?? undefined}
                        height={image.height ?? undefined}
                      />
                    </div>
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        </div>
      </section>
    </Reveal>
  );
}
