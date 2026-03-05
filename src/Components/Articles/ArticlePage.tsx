import React from "react";
import { Link, useParams } from "react-router-dom";
import NavigationBar from "../NavigationBar/NavigationBar";
import Footer from "../Footer/Footer";
import BackToTop from "../BackToTop/BackToTop";
import ResponsiveImage from "../ResponsiveImage/ResponsiveImage";
import { articles } from "../../data/articles";
import Seo from "../Seo/Seo";

const ArticlePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const article = articles.find((item) => item.slug === slug);
  const articlePath = article ? `/articles/${article.slug}` : "/articles";
  const seoTitle = article ? article.title : "Article introuvable";
  const seoDescription = article
    ? article.excerpt
    : "L'article demandé n'existe pas ou a été déplacé.";

  return (
    <>
      <Seo
        title={seoTitle}
        description={seoDescription}
        path={articlePath}
        type={article ? "article" : "website"}
        noIndex={!article}
      />
      <NavigationBar />
      <main className="bg-white min-h-screen">
        <section className="max-w-5xl mx-auto px-6 py-16">
          {!article ? (
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Article introuvable</h1>
              <p className="text-sm text-gray-600 mb-6">L'article demandé n'existe pas ou a été déplacé.</p>
              <Link
                to="/"
                className="inline-flex items-center justify-center rounded-full bg-[#0d8a8a] text-white px-6 py-2 text-sm font-semibold hover:bg-teal-800 transition"
              >
                Retour à l'accueil
              </Link>
            </div>
          ) : (
            <article>
              <div className="mb-10">
                <ResponsiveImage
                  className="block w-full h-[360px] rounded-3xl overflow-hidden"
                  imgClassName="w-full h-full object-cover"
                  imgSrc={article.image.webp900}
                  dataSaverImgSrc={article.image.webp600}
                  alt={article.image.alt}
                  loading="eager"
                  decoding="async"
                  sources={[
                    {
                      type: "image/avif",
                      srcSet: `${article.image.avif600} 600w, ${article.image.avif900} 900w, ${article.image.avif1200} 1200w`,
                      sizes: "(min-width: 1024px) 900px, 100vw",
                    },
                    {
                      type: "image/webp",
                      srcSet: `${article.image.webp600} 600w, ${article.image.webp900} 900w, ${article.image.webp1200} 1200w`,
                      sizes: "(min-width: 1024px) 900px, 100vw",
                    },
                  ]}
                  dataSaverSources={[
                    {
                      type: "image/webp",
                      srcSet: `${article.image.webp600} 600w`,
                      sizes: "(min-width: 1024px) 900px, 100vw",
                    },
                  ]}
                />
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">{article.title}</h1>
              <div className="space-y-4 text-sm md:text-base text-gray-700 leading-relaxed">
                {article.content.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              <div className="mt-10">
                <Link
                  to="/"
                  className="inline-flex items-center justify-center rounded-full border border-teal-700 text-teal-700 px-6 py-2 text-sm font-semibold hover:bg-teal-700 hover:text-white transition"
                >
                  Retour à l'accueil
                </Link>
              </div>
            </article>
          )}
        </section>
      </main>
      <Footer />
      <BackToTop />
    </>
  );
};

export default ArticlePage;
