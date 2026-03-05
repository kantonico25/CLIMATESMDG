 import { useMemo } from "react";
import { Link } from "react-router-dom";
import { api } from "../../api/client";
import { useAsync } from "../../api/useAsync";
import type { GallerySection as GallerySectionType, Media } from "../../api/types";
import { getMediaSrcSet, getMediaUrl } from "../media/mediaUtils";

type GalleryCard = {
  title?: string | null;
  tag?: string | null;
  tagColor?: string | null;
  description?: string | null;
  image?: Media | null;
  slug?: string | null;
};

export default function GallerySection({ section }: { section: GallerySectionType }) {
  const requestedLimit = section.limit && section.limit > 0 ? section.limit : undefined;
  const { data: projects } = useAsync(() => api.getProjects({ limit: requestedLimit }), [requestedLimit]);

  const items = useMemo<GalleryCard[]>(() => {
    if (projects && projects.length > 0) {
      return projects.map((project) => ({
        title: project.title,
        tag: project.category ?? null,
        tagColor: "#facc15",
        description: project.excerpt ?? null,
        image: project.coverImage ?? null,
        slug: project.slug
      }));
    }

    return section.items.map((item) => ({
      ...item,
      slug: null
    }));
  }, [projects, section.items]);

  return (
    <section className="perf-section py-20 bg-white px-6" id="gallery">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          {section.title ? <h2 className="text-3xl md:text-4xl font-bold text-[#006666]">{section.title}</h2> : null}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, index) => {
            const cardOverlay = (
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
                <div className="mt-auto transition-all duration-300 group-hover:opacity-0 group-hover:translate-y-2">
                  {item.tag ? (
                    <span className="font-bold text-xs uppercase mb-1" style={{ color: item.tagColor || "#facc15" }}>
                      {item.tag}
                    </span>
                  ) : null}
                  {item.title ? <h4 className="text-white text-xl font-bold">{item.title}</h4> : null}
                </div>
                {item.description ? (
                  <div className="absolute left-8 right-8 bottom-8 opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:translate-y-0">
                    <p className="text-white/80 text-xs leading-relaxed">{item.description}</p>
                  </div>
                ) : null}
              </div>
            );

            return (
              <div
                key={`${item.title || "gallery-item"}-${index}`}
                className="group relative rounded-[1rem] overflow-hidden shadow-lg h-64 cursor-pointer"
              >
                {item.image?.url ? (
                  <img
                    className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                    src={getMediaUrl(item.image, ["medium", "small"]) || item.image.url}
                    srcSet={getMediaSrcSet(item.image)}
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    alt={item.image.alternativeText || item.title || "Gallery"}
                    loading="lazy"
                    decoding="async"
                    width={item.image.width ?? undefined}
                    height={item.image.height ?? undefined}
                  />
                ) : null}
                {item.slug ? (
                  <Link to={`/projets/${item.slug}`} className="absolute inset-0 block" aria-label={`Voir ${item.title || "ce projet"}`}>
                    {cardOverlay}
                  </Link>
                ) : (
                  cardOverlay
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
