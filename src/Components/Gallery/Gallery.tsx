import React from "react";
import ResponsiveImage from "../ResponsiveImage/ResponsiveImage";
import gallery1Avif600 from "../../assets/generated/gallery-1-600.avif";
import gallery1Avif900 from "../../assets/generated/gallery-1-900.avif";
import gallery1Avif1200 from "../../assets/generated/gallery-1-1200.avif";
import gallery1Webp600 from "../../assets/generated/gallery-1-600.webp";
import gallery1Webp900 from "../../assets/generated/gallery-1-900.webp";
import gallery1Webp1200 from "../../assets/generated/gallery-1-1200.webp";
import gallery2Avif600 from "../../assets/generated/gallery-2-600.avif";
import gallery2Avif900 from "../../assets/generated/gallery-2-900.avif";
import gallery2Avif1200 from "../../assets/generated/gallery-2-1200.avif";
import gallery2Webp600 from "../../assets/generated/gallery-2-600.webp";
import gallery2Webp900 from "../../assets/generated/gallery-2-900.webp";
import gallery2Webp1200 from "../../assets/generated/gallery-2-1200.webp";
import gallery3Avif600 from "../../assets/generated/gallery-3-600.avif";
import gallery3Avif900 from "../../assets/generated/gallery-3-900.avif";
import gallery3Avif1200 from "../../assets/generated/gallery-3-1200.avif";
import gallery3Webp600 from "../../assets/generated/gallery-3-600.webp";
import gallery3Webp900 from "../../assets/generated/gallery-3-900.webp";
import gallery3Webp1200 from "../../assets/generated/gallery-3-1200.webp";
import gallery4Avif600 from "../../assets/generated/gallery-4-600.avif";
import gallery4Avif900 from "../../assets/generated/gallery-4-900.avif";
import gallery4Avif1200 from "../../assets/generated/gallery-4-1200.avif";
import gallery4Webp600 from "../../assets/generated/gallery-4-600.webp";
import gallery4Webp900 from "../../assets/generated/gallery-4-900.webp";
import gallery4Webp1200 from "../../assets/generated/gallery-4-1200.webp";
import gallery5Avif600 from "../../assets/generated/gallery-5-600.avif";
import gallery5Avif900 from "../../assets/generated/gallery-5-900.avif";
import gallery5Avif1200 from "../../assets/generated/gallery-5-1200.avif";
import gallery5Webp600 from "../../assets/generated/gallery-5-600.webp";
import gallery5Webp900 from "../../assets/generated/gallery-5-900.webp";
import gallery5Webp1200 from "../../assets/generated/gallery-5-1200.webp";

type GalleryItem = {
  title: string;
  tag: string;
  tagClassName: string;
  description: string;
  imgSrc: string;
  dataSaverImgSrc: string;
  sources: { type: string; srcSet: string; sizes: string }[];
  dataSaverSources: { type: string; srcSet: string; sizes: string }[];
};

const defaultSizes = "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw";

const createSources = (
  avif600: string,
  avif900: string,
  avif1200: string,
  webp600: string,
  webp900: string,
  webp1200: string
) => ({
  sources: [
    {
      type: "image/avif",
      srcSet: `${avif600} 600w, ${avif900} 900w, ${avif1200} 1200w`,
      sizes: defaultSizes,
    },
    {
      type: "image/webp",
      srcSet: `${webp600} 600w, ${webp900} 900w, ${webp1200} 1200w`,
      sizes: defaultSizes,
    },
  ],
  dataSaverSources: [
    {
      type: "image/webp",
      srcSet: `${webp600} 600w`,
      sizes: defaultSizes,
    },
  ],
});

const galleryItems: GalleryItem[] = [
  {
    title: "Global Strike",
    tag: "Mobilisation",
    tagClassName: "text-yellow-400",
    description: "Marches citoyennes et mobilisation de la jeunesse pour la justice climatique.",
    imgSrc: gallery1Webp900,
    dataSaverImgSrc: gallery1Webp600,
    ...createSources(gallery1Avif600, gallery1Avif900, gallery1Avif1200, gallery1Webp600, gallery1Webp900, gallery1Webp1200),
  },
  {
    title: "Plaidoyer Climatique",
    tag: "Formation",
    tagClassName: "text-red-400",
    description: "Ateliers pour outiller les jeunes à porter la voix du climat.",
    imgSrc: gallery2Webp900,
    dataSaverImgSrc: gallery2Webp600,
    ...createSources(gallery2Avif600, gallery2Avif900, gallery2Avif1200, gallery2Webp600, gallery2Webp900, gallery2Webp1200),
  },
  {
    title: "Handicap & Climat",
    tag: "Recherche",
    tagClassName: "text-yellow-400",
    description: "Étude et plaidoyer pour une résilience inclusive face aux crises.",
    imgSrc: gallery3Webp900,
    dataSaverImgSrc: gallery3Webp600,
    ...createSources(gallery3Avif600, gallery3Avif900, gallery3Avif1200, gallery3Webp600, gallery3Webp900, gallery3Webp1200),
  },
  {
    title: "COP in my City",
    tag: "Evènement",
    tagClassName: "text-red-400",
    description: "Simulations et échanges pour rapprocher les COP des communautés.",
    imgSrc: gallery4Webp900,
    dataSaverImgSrc: gallery4Webp600,
    ...createSources(gallery4Avif600, gallery4Avif900, gallery4Avif1200, gallery4Webp600, gallery4Webp900, gallery4Webp1200),
  },
  {
    title: "Conseil Municipal Écologique",
    tag: "Simulation",
    tagClassName: "text-yellow-400",
    description: "Éduquer les jeunes à la gouvernance locale et à l'action verte.",
    imgSrc: gallery5Webp900,
    dataSaverImgSrc: gallery5Webp600,
    ...createSources(gallery5Avif600, gallery5Avif900, gallery5Avif1200, gallery5Webp600, gallery5Webp900, gallery5Webp1200),
  },
];

const Gallery: React.FC = () => {
  return (
    <section className="perf-section py-20 bg-white px-6" id="gallery">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#006666]">Galerie de projets</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {galleryItems.map((item) => (
            <div key={item.title} className="group relative rounded-[2.5rem] overflow-hidden shadow-lg h-64 cursor-pointer">
              <ResponsiveImage
                className="block w-full h-full"
                imgClassName="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                imgSrc={item.imgSrc}
                dataSaverImgSrc={item.dataSaverImgSrc}
                alt={item.title}
                loading="lazy"
                decoding="async"
                sources={item.sources}
                dataSaverSources={item.dataSaverSources}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
                <div className="mt-auto transition-all duration-300 group-hover:opacity-0 group-hover:translate-y-2">
                  <span className={`${item.tagClassName} font-bold text-xs uppercase mb-1`}>{item.tag}</span>
                  <h4 className="text-white text-xl font-bold">{item.title}</h4>
                </div>
                <div className="absolute left-8 right-8 bottom-8 opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:translate-y-0">
                  <p className="text-white/80 text-xs leading-relaxed">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default React.memo(Gallery);

