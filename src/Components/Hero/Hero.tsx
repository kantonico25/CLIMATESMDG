import React from "react";
import ResponsiveImage from "../ResponsiveImage/ResponsiveImage";
import heroAvif1200 from "../../assets/generated/hero-1200.avif";
import heroAvif1800 from "../../assets/generated/hero-1800.avif";
import heroWebp1200 from "../../assets/generated/hero-1200.webp";
import heroWebp1800 from "../../assets/generated/hero-1800.webp";

type HeroProps = {
  onCtaClick?: () => void;
  ctaHref?: string;
};

const Hero: React.FC<HeroProps> = ({ onCtaClick, ctaHref = "#" }) => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center text-center px-4">
      <ResponsiveImage
        className="absolute inset-0 -z-10"
        imgClassName="w-full h-full object-cover object-top"
        imgSrc={heroWebp1200}
        dataSaverImgSrc={heroWebp1200}
        alt=""
        loading="eager"
        decoding="async"
        fetchPriority="high"
        ariaHidden
        sources={[
          {
            type: "image/avif",
            srcSet: `${heroAvif1200} 1200w, ${heroAvif1800} 1800w`,
            sizes: "100vw",
          },
          {
            type: "image/webp",
            srcSet: `${heroWebp1200} 1200w, ${heroWebp1800} 1800w`,
            sizes: "100vw",
          },
        ]}
        dataSaverSources={[
          {
            type: "image/webp",
            srcSet: `${heroWebp1200} 1200w`,
            sizes: "100vw",
          },
        ]}
      />
      <div className="absolute inset-0 -z-10 bg-black/40"></div>

      <div className="max-w-4xl">
        <p className="text-white text-sm md:text-sm font-medium mb-2">Think-and do-tank International</p>

        <h1 className="text-white text-3xl md:text-3xl font-bold uppercase tracking-tight mb-4">
          Madagascar affranchi de <br />
          <span className="text-yellow-400">la vulnérabilité climatique</span>
        </h1>

        <p className="text-white text-sm md:text-sm max-w-4xl mx-auto mb-10 leading-relaxed">
          Nous développons l'agilité des acteurs stratégiques et des innovations communautaires pour faire face au
          changement climatique
        </p>

        {onCtaClick ? (
          <button
            type="button"
            onClick={onCtaClick}
            className="bg-[#0d8a8a] text-white px-8 py-4 rounded-full text-base font-semibold hover:bg-teal-800 transition shadow-lg inline-block"
          >
            Rejoindre le mouvement
          </button>
        ) : (
          <a
            href={ctaHref}
            className="bg-[#0d8a8a] text-white px-10 py-4 rounded-full text-lg font-semibold hover:bg-teal-800 transition shadow-lg inline-block"
          >
            Rejoindre le mouvement
          </a>
        )}
      </div>
    </section>
  );
};

export default React.memo(Hero);

