import DOMPurify from "dompurify";
import { Link, useParams } from "react-router-dom";
import { api } from "../api/client";
import { useAsync } from "../api/useAsync";
import PageLoader from "../components/loading/PageLoader";
import Reveal from "../components/Reveal/Reveal";
import { getMediaSrcSet, getMediaUrl } from "../components/media/mediaUtils";

const formatPublishedDate = (value?: string | null) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(date);
};

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params.slug ?? "";

  const { data, loading, error } = useAsync(
    async () => {
      const [post, list] = await Promise.all([api.getBlogPost(slug), api.getBlogList({ page: 1, limit: 8 })]);
      return {
        post,
        related: list.items.filter((item) => item.slug !== slug).slice(0, 3)
      };
    },
    [slug],
    { keepPreviousData: true }
  );

  if (loading && !data?.post) return <PageLoader label="Loading article..." />;
  if (error || !data?.post) return <div className="py-16 text-center text-red-600">Article not found.</div>;

  const post = data.post;
  const sanitizedBody = DOMPurify.sanitize(post.body);
  const categoryName = post.categories[0]?.name ?? post.tags[0]?.name ?? null;
  const dateLabel = formatPublishedDate(post.publishedAt);
  const fallbackQuote = post.excerpt ? stripHtml(post.excerpt) : "";

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const onShare = async () => {
    if (!shareUrl) return;
    if (navigator.share) {
      try {
        await navigator.share({ title: post.title, url: shareUrl });
        return;
      } catch {
        return;
      }
    }
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`, "_blank", "noopener,noreferrer");
  };

  const onFacebook = () => {
    if (!shareUrl) return;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank", "noopener,noreferrer");
  };

  const onCopy = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      // no-op
    }
  };

  return (
    <article className="bg-slate-50 text-slate-900">
      <Reveal>
        <section className="max-w-4xl mx-auto px-6 pt-16 pb-12 text-center">
          <div className="flex justify-center items-center gap-2 mb-6 text-xs">
            {categoryName ? (
              <span className="bg-teal-700/10 text-teal-700 px-3 py-1 rounded-full font-bold uppercase tracking-widest text-[10px]">
                {categoryName}
              </span>
            ) : null}
            {dateLabel ? <span className="text-slate-400">•</span> : null}
            {dateLabel ? <time className="text-slate-500 italic">{dateLabel}</time> : null}
          </div>

          <h1 className="text-4xl md:text-6xl font-black leading-tight mb-8 tracking-tight [font-family:'Newsreader',serif]">
            {post.title}
          </h1>

          <div className="flex flex-col items-center gap-2">
            <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Written by</span>
            <span className="text-lg font-bold text-teal-700">{post.authorName || "CliMates Team"}</span>
          </div>
        </section>
      </Reveal>

      {post.coverImage?.url ? (
        <Reveal>
          <section className="max-w-7xl mx-auto px-6 mb-20">
            <div className="aspect-[21/9] w-full rounded-2xl overflow-hidden shadow-2xl relative">
              <img
                src={getMediaUrl(post.coverImage, ["xlarge", "large", "medium"]) || post.coverImage.url}
                srcSet={getMediaSrcSet(post.coverImage)}
                sizes="(min-width: 1280px) 1280px, 100vw"
                alt={post.coverImage.alternativeText || post.title}
                className="w-full h-full object-cover"
                fetchPriority="high"
                decoding="async"
                width={post.coverImage.width ?? undefined}
                height={post.coverImage.height ?? undefined}
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-2xl" />
            </div>
          </section>
        </Reveal>
      ) : null}

      <Reveal>
        <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 pb-24">
          <div className="lg:col-span-8 lg:pr-8 space-y-8">
            {post.excerpt ? (
              <p className="text-2xl leading-relaxed text-slate-700 first-letter:text-7xl first-letter:font-bold first-letter:text-teal-700 first-letter:mr-3 first-letter:float-left first-letter:leading-none [font-family:'Newsreader',serif]">
                {post.excerpt}
              </p>
            ) : null}

            <div
              className="prose prose-slate max-w-none prose-headings:font-black prose-headings:[font-family:'Newsreader',serif] prose-p:text-lg prose-p:leading-relaxed"
              dangerouslySetInnerHTML={{ __html: sanitizedBody }}
            />

            {post.quoteText || fallbackQuote ? (
              <blockquote className="my-16 py-8 border-y border-teal-700/20 relative">
                <p className="text-4xl text-center italic leading-snug px-8 font-bold [font-family:'Newsreader',serif]">
                  "{post.quoteText || fallbackQuote}"
                </p>
                <cite className="block text-center mt-6 text-sm uppercase tracking-[0.2em] text-teal-700 font-bold not-italic">
                  — {post.quoteSource || "Climates Manifesto"}
                </cite>
              </blockquote>
            ) : null}
          </div>

          <aside className="lg:col-span-4 border-l border-slate-200 pl-10 hidden lg:block">
            <div className="sticky top-24 space-y-8 max-h-[calc(100vh-7rem)] overflow-y-auto pr-2">
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Share Article</h3>
                <div className="flex flex-col gap-3">
                  <button onClick={onShare} className="text-left flex items-center gap-3 p-3 rounded-xl bg-white hover:bg-teal-700 hover:text-white transition border border-slate-200 text-sm font-semibold">
                    Share on Twitter
                  </button>
                  <button onClick={onFacebook} className="text-left flex items-center gap-3 p-3 rounded-xl bg-white hover:bg-teal-700 hover:text-white transition border border-slate-200 text-sm font-semibold">
                    Post to Facebook
                  </button>
                  <button onClick={onCopy} className="text-left flex items-center gap-3 p-3 rounded-xl bg-white hover:bg-teal-700 hover:text-white transition border border-slate-200 text-sm font-semibold">
                    Copy Link
                  </button>
                </div>
              </div>

              <div className="bg-teal-700/5 p-6 rounded-2xl border border-teal-700/10">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-teal-700 mb-4">About the Author</h3>
                <p className="font-bold text-slate-900 leading-tight">{post.authorName || "CliMates Team"}</p>
                <p className="text-xs text-slate-500 mb-3">{post.authorRole || "Multidisciplinary Lab"}</p>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {post.authorBio || "A collective of researchers and climate practitioners dedicated to collaborative action."}
                </p>
              </div>

              {post.highlightTitle || post.impactMetricValue ? (
                <div className="space-y-4">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Contextual Highlights</h3>

                  {post.highlightTitle ? (
                    <div className="p-4 border border-slate-200 rounded-xl bg-white">
                      {post.highlightLabel ? <span className="text-rose-500 text-[10px] font-bold uppercase">{post.highlightLabel}</span> : null}
                      <h4 className="font-bold text-slate-900 mt-1">{post.highlightTitle}</h4>
                      {post.highlightDescription ? <p className="text-xs text-slate-500 mt-2">{post.highlightDescription}</p> : null}
                    </div>
                  ) : null}

                  {post.impactMetricValue ? (
                    <div className="p-4 bg-slate-900 text-white rounded-xl shadow-lg">
                      {post.impactMetricLabel ? <span className="text-teal-400 text-[10px] font-bold uppercase">{post.impactMetricLabel}</span> : null}
                      <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-3xl font-bold">{post.impactMetricValue}</span>
                        {post.impactMetricSuffix ? <span className="text-xs opacity-70 italic">{post.impactMetricSuffix}</span> : null}
                      </div>
                      {post.impactMetricDescription ? <p className="text-[11px] mt-2 opacity-70">{post.impactMetricDescription}</p> : null}
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          </aside>
        </section>
      </Reveal>

      <Reveal>
        <section className="py-24 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-teal-700 mb-4">Continue Reading</h2>
                <p className="text-4xl font-black [font-family:'Newsreader',serif]">Related Research</p>
              </div>
              <Link to="/blog" className="text-teal-700 font-bold hover:underline">
                View archive
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {data.related.map((item) => (
                <article key={item.slug} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-slate-100 group">
                  <div className="aspect-video overflow-hidden">
                    {item.coverImage?.url ? (
                      <img
                        src={getMediaUrl(item.coverImage, ["medium", "small"]) || item.coverImage.url}
                        srcSet={getMediaSrcSet(item.coverImage)}
                        sizes="(min-width: 768px) 33vw, 100vw"
                        alt={item.coverImage.alternativeText || item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        decoding="async"
                        width={item.coverImage.width ?? undefined}
                        height={item.coverImage.height ?? undefined}
                      />
                    ) : null}
                  </div>
                  <div className="p-6">
                    {item.categories[0]?.name || item.tags[0]?.name ? (
                      <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">
                        {item.categories[0]?.name || item.tags[0]?.name}
                      </span>
                    ) : null}
                    <h3 className="text-2xl font-bold mt-2 mb-3 [font-family:'Newsreader',serif] group-hover:text-teal-700 transition-colors">
                      {item.title}
                    </h3>
                    {item.excerpt ? <p className="text-slate-600 text-sm line-clamp-2">{item.excerpt}</p> : null}
                    <Link to={`/blog/${item.slug}`} className="mt-4 inline-block text-sm font-semibold text-teal-700 hover:underline">
                      Read article
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </Reveal>
    </article>
  );
}
