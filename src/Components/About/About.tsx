import React from "react";
import ResponsiveImage from "../ResponsiveImage/ResponsiveImage";
import aboutAvif600 from "../../assets/generated/about-600.avif";
import aboutAvif900 from "../../assets/generated/about-900.avif";
import aboutAvif1200 from "../../assets/generated/about-1200.avif";
import aboutWebp600 from "../../assets/generated/about-600.webp";
import aboutWebp900 from "../../assets/generated/about-900.webp";
import aboutWebp1200 from "../../assets/generated/about-1200.webp";

const About: React.FC = () => {
  return (
    <section id="about" className="perf-section py-20 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-bold mb-2">
            Notre <span className="text-teal-600">Histoire</span>
          </h2>
          <h3 className="text-4xl font-extrabold mb-6">De Paris à Antananarivo</h3>

          <p className="text-sm leading-relaxed mb-6">
            <span className="text-red-400 font-semibold">Fondée en 2011 à Paris</span> à la suite de
            la COP de Durban, CliMates est un think-and-do-tank international qui regroupe des jeunes
            professionnels sur la justice climatique.
          </p>

          <div className="border-l-4 border-teal-600 pl-4 mb-8">
            <p className="text-sm italic text-gray-700">
              En 2015, une branche a été créée à Madagascar, sachant que CliMates est présent dans
              plusieurs pays tels que la France, l'Autriche, l'Australie, la Chine, le Mali et le
              Népal.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="px-4 py-1 bg-gray-100 text-teal-700 rounded-full text-xs font-medium border border-gray-200">France</span>
            <span className="px-4 py-1 bg-gray-100 text-teal-700 rounded-full text-xs font-medium border border-gray-200">Autriche</span>
            <span className="px-4 py-1 bg-gray-100 text-teal-700 rounded-full text-xs font-medium border border-gray-200">Chine</span>
            <span className="px-4 py-1 bg-gray-100 text-teal-700 rounded-full text-xs font-medium border border-gray-200">Mali</span>
            <span className="px-4 py-1 bg-gray-100 text-teal-700 rounded-full text-xs font-medium border border-gray-200">Népal</span>
            <span className="px-4 py-1 bg-yellow-400 text-black rounded-full text-xs font-bold shadow-sm">Madagascar</span>
          </div>
        </div>

        <div className="relative">
          <div className="rounded-3xl overflow-hidden shadow-2xl relative">
            <ResponsiveImage
              className="block w-full h-full"
              imgClassName="w-full h-[400px] object-cover brightness-50"
              imgSrc={aboutWebp900}
              dataSaverImgSrc={aboutWebp600}
              alt="Team meeting"
              loading="lazy"
              decoding="async"
              sources={[
                {
                  type: "image/avif",
                  srcSet: `${aboutAvif600} 600w, ${aboutAvif900} 900w, ${aboutAvif1200} 1200w`,
                  sizes: "(min-width: 1024px) 50vw, 100vw",
                },
                {
                  type: "image/webp",
                  srcSet: `${aboutWebp600} 600w, ${aboutWebp900} 900w, ${aboutWebp1200} 1200w`,
                  sizes: "(min-width: 1024px) 50vw, 100vw",
                },
              ]}
              dataSaverSources={[
                {
                  type: "image/webp",
                  srcSet: `${aboutWebp600} 600w`,
                  sizes: "(min-width: 1024px) 50vw, 100vw",
                },
              ]}
            />

            <div className="absolute bottom-6 left-6 text-white">
              <h4 className="text-xl font-bold">Une Présence Internationale</h4>
              <p className="text-xs text-yellow-400 font-semibold">Action Locale, Impact Global</p>
            </div>
          </div>

          <div className="absolute -top-6 -right-6 bg-yellow-400 w-24 h-24 rounded-full flex flex-col items-center justify-center text-center shadow-lg border-4 border-white">
            <span className="text-[10px] uppercase font-bold leading-none">Depuis</span>
            <span className="text-2xl font-black">2015</span>
            <span className="text-[10px] font-bold">à Mada</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(About);

