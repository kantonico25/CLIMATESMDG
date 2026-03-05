export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  image: {
    webp600: string;
    webp900: string;
    webp1200: string;
    avif600: string;
    avif900: string;
    avif1200: string;
    alt: string;
  };
};

import gallery1Avif600 from "../assets/generated/gallery-1-600.avif";
import gallery1Avif900 from "../assets/generated/gallery-1-900.avif";
import gallery1Avif1200 from "../assets/generated/gallery-1-1200.avif";
import gallery1Webp600 from "../assets/generated/gallery-1-600.webp";
import gallery1Webp900 from "../assets/generated/gallery-1-900.webp";
import gallery1Webp1200 from "../assets/generated/gallery-1-1200.webp";
import gallery2Avif600 from "../assets/generated/gallery-2-600.avif";
import gallery2Avif900 from "../assets/generated/gallery-2-900.avif";
import gallery2Avif1200 from "../assets/generated/gallery-2-1200.avif";
import gallery2Webp600 from "../assets/generated/gallery-2-600.webp";
import gallery2Webp900 from "../assets/generated/gallery-2-900.webp";
import gallery2Webp1200 from "../assets/generated/gallery-2-1200.webp";
import gallery3Avif600 from "../assets/generated/gallery-3-600.avif";
import gallery3Avif900 from "../assets/generated/gallery-3-900.avif";
import gallery3Avif1200 from "../assets/generated/gallery-3-1200.avif";
import gallery3Webp600 from "../assets/generated/gallery-3-600.webp";
import gallery3Webp900 from "../assets/generated/gallery-3-900.webp";
import gallery3Webp1200 from "../assets/generated/gallery-3-1200.webp";

export const articles: Article[] = [
  {
    slug: "mobilisation-jeunesse",
    title: "Mobiliser la jeunesse pour l'action climatique",
    excerpt: "Découvrez comment nos campagnes locales ont amplifié la voix des jeunes face aux urgences climatiques.",
    content: [
      "Dans plusieurs régions de Madagascar, nous avons soutenu des collectifs locaux pour organiser des marches et des ateliers de sensibilisation.",
      "Ces initiatives mettent l'accent sur l'action citoyenne, l'engagement communautaire et la formation de nouveaux leaders pour porter des solutions durables.",
      "Nos équipes travaillent avec les écoles, associations et autorités locales pour faire émerger des projets concrets et mesurables.",
    ],
    image: {
      avif600: gallery1Avif600,
      avif900: gallery1Avif900,
      avif1200: gallery1Avif1200,
      webp600: gallery1Webp600,
      webp900: gallery1Webp900,
      webp1200: gallery1Webp1200,
      alt: "Mobilisation jeunesse",
    },
  },
  {
    slug: "plaidoyer-climatique",
    title: "Former des ambassadeurs du plaidoyer",
    excerpt: "Un aperçu de nos formations pour aider les jeunes à porter des messages climatiques clairs et efficaces.",
    content: [
      "Nous co-construisons des modules de formation sur la prise de parole, la compréhension des politiques publiques et la négociation.",
      "Les participants repartent avec des outils concrets pour mobiliser leurs communautés et dialoguer avec les décideurs.",
      "Cette approche permet de transformer la sensibilisation en actions et alliances durables.",
    ],
    image: {
      avif600: gallery2Avif600,
      avif900: gallery2Avif900,
      avif1200: gallery2Avif1200,
      webp600: gallery2Webp600,
      webp900: gallery2Webp900,
      webp1200: gallery2Webp1200,
      alt: "Plaidoyer climatique",
    },
  },
  {
    slug: "recherche-inclusive",
    title: "Recherche inclusive et résilience",
    excerpt: "Comment nos études sur le handicap et le climat inspirent des solutions inclusives et équitables.",
    content: [
      "Nos projets de recherche croisent données de terrain et expertise locale pour mieux comprendre les vulnérabilités.",
      "Les résultats sont partagés avec des ONG et des institutions publiques pour adapter les politiques climatiques.",
      "Nous mettons en avant l'inclusion comme principe clé pour renforcer la résilience des communautés.",
    ],
    image: {
      avif600: gallery3Avif600,
      avif900: gallery3Avif900,
      avif1200: gallery3Avif1200,
      webp600: gallery3Webp600,
      webp900: gallery3Webp900,
      webp1200: gallery3Webp1200,
      alt: "Recherche inclusive",
    },
  },
];

