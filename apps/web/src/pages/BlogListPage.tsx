import { Link } from "react-router-dom";
import { api } from "../api/client";
import { useAsync } from "../api/useAsync";
import PageLoader from "../components/loading/PageLoader";
import Reveal from "../components/Reveal/Reveal";
import { getMediaSrcSet, getMediaUrl } from "../components/media/mediaUtils";

export default function BlogListPage() {
  const { data, loading, error } = useAsync(() => api.getBlogList({ page: 1, limit: 9 }), []);

  if (loading) return <PageLoader label="Loading blog posts..." />;
  if (error || !data) return <div className="py-16 text-center text-red-600">Unable to load blog.</div>;

  return (
    <Reveal>
      <section className="perf-section py-20 bg-slate-50 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-[#006666]">Blog</h1>
            <p className="text-sm text-gray-600 mt-3">Stories, insights, and project updates.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.items.map((post) => (
              <article key={post.slug} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 flex flex-col">
                {post.coverImage?.url ? (
                  <img
                    src={getMediaUrl(post.coverImage, ["medium", "small"]) || post.coverImage.url}
                    srcSet={getMediaSrcSet(post.coverImage)}
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    alt={post.coverImage.alternativeText || post.title}
                    className="h-48 w-full object-cover"
                    loading="lazy"
                    decoding="async"
                    width={post.coverImage.width ?? undefined}
                    height={post.coverImage.height ?? undefined}
                  />
                ) : null}
                <div className="p-6 flex flex-col h-full">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{post.title}</h3>
                  {post.excerpt ? <p className="text-sm text-gray-600 leading-relaxed mb-6">{post.excerpt}</p> : null}
                  <div className="mt-auto flex items-center justify-between text-xs text-gray-500">
                    {post.authorName ? <span>{post.authorName}</span> : <span></span>}
                    {post.publishedAt ? <time>{new Date(post.publishedAt).toLocaleDateString()}</time> : null}
                  </div>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="mt-4 inline-flex items-center justify-center rounded-full bg-[#0d8a8a] text-white px-5 py-2 text-sm font-semibold hover:bg-teal-800 transition"
                  >
                    Read article
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </Reveal>
  );
}
