import React from "react";
import { Link } from "react-router-dom";
import ResponsiveImage from "../ResponsiveImage/ResponsiveImage";
import { articles } from "../../data/articles";

const ArticlesSection: React.FC = () => {
  return (
    <section className="perf-section py-20 bg-slate-50 px-6" id="articles">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#006666]">Articles & Actualités</h2>
          <p className="text-sm text-gray-600 mt-3">Explorez nos derniers récits et analyses climatiques.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <article
              key={article.slug}
              className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100 flex flex-col"
            >
              <div className="h-48">
                <ResponsiveImage
                  className="block w-full h-full"
                  imgClassName="w-full h-full object-cover"
                  imgSrc={article.image.webp900}
                  dataSaverImgSrc={article.image.webp600}
                  alt={article.image.alt}
                  loading="lazy"
                  decoding="async"
                  sources={[
                    {
                      type: "image/avif",
                      srcSet: `${article.image.avif600} 600w, ${article.image.avif900} 900w, ${article.image.avif1200} 1200w`,
                      sizes: "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw",
                    },
                    {
                      type: "image/webp",
                      srcSet: `${article.image.webp600} 600w, ${article.image.webp900} 900w, ${article.image.webp1200} 1200w`,
                      sizes: "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw",
                    },
                  ]}
                  dataSaverSources={[
                    {
                      type: "image/webp",
                      srcSet: `${article.image.webp600} 600w`,
                      sizes: "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw",
                    },
                  ]}
                />
              </div>
              <div className="p-6 flex flex-col h-full">
                <h3 className="text-lg font-bold text-gray-900 mb-3">{article.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-6 line-clamp-3">{article.excerpt}</p>
                <div className="mt-auto">
                  <Link
                    to={`/articles/${article.slug}`}
                    className="inline-flex items-center justify-center rounded-full bg-[#0d8a8a] text-white px-5 py-2 text-sm font-semibold hover:bg-teal-800 transition"
                  >
                    Read More
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default React.memo(ArticlesSection);

