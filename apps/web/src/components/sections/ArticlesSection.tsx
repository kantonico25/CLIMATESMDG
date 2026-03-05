import { Link } from "react-router-dom";
import { api } from "../../api/client";
import { useAsync } from "../../api/useAsync";
import type { ArticlesSection as ArticlesSectionType } from "../../api/types";
import { getMediaSrcSet, getMediaUrl } from "../media/mediaUtils";

export default function ArticlesSection({ section }: { section: ArticlesSectionType }) {
  const { data, loading, error } = useAsync(
    () =>
      api.getBlogList({
        page: 1,
        limit: section.limit ?? 3,
        category: section.categorySlug ?? undefined,
        tag: section.tagSlug ?? undefined
      }),
    [section.limit, section.categorySlug, section.tagSlug]
  );

  return (
    <section className="perf-section py-20 bg-slate-50 px-6" id="articles">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          {section.title ? <h2 className="text-3xl md:text-4xl font-bold text-[#006666]">{section.title}</h2> : null}
          {section.subtitle ? <p className="text-sm text-gray-600 mt-3">{section.subtitle}</p> : null}
        </div>

        {loading ? <div className="text-center text-sm text-gray-500">Chargement...</div> : null}
        {error ? <div className="text-center text-sm text-red-500">Erreur de chargement.</div> : null}

        {data ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.items.map((post) => (
              <article
                key={post.slug}
                className="bg-white rounded-[1rem] shadow-lg overflow-hidden border border-gray-100 flex flex-col"
              >
                <div className="h-48">
                  {post.coverImage?.url ? (
                    <img
                      className="w-full h-full object-cover"
                      src={getMediaUrl(post.coverImage, ["medium", "small"]) || post.coverImage.url}
                      srcSet={getMediaSrcSet(post.coverImage)}
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      alt={post.coverImage.alternativeText || post.title}
                      loading="lazy"
                      decoding="async"
                      width={post.coverImage.width ?? undefined}
                      height={post.coverImage.height ?? undefined}
                    />
                  ) : null}
                </div>
                <div className="p-6 flex flex-col h-full">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{post.title}</h3>
                  {post.excerpt ? <p className="text-sm text-gray-600 leading-relaxed mb-6">{post.excerpt}</p> : null}
                  <div className="mt-auto">
                    <Link
                      to={`/blog/${post.slug}`}
                      className="inline-flex items-center justify-center rounded-full bg-[#0d8a8a] text-white px-5 py-2 text-sm font-semibold hover:bg-teal-800 transition"
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : null}

        {section.buttonLabel && section.buttonUrl ? (
          <div className="mt-10 flex justify-end">
            <a
              href={section.buttonUrl}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#006666] hover:text-teal-800 transition"
            >
              <span className="underline underline-offset-4">{section.buttonLabel}</span>
              <span aria-hidden="true">→</span>
            </a>
          </div>
        ) : null}
      </div>
    </section>
  );
}
