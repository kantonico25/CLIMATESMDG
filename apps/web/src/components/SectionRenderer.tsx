import type { Section } from "../api/types";
import AboutSection from "./sections/AboutSection";
import ArticlesSection from "./sections/ArticlesSection";
import CarbonCtaSection from "./sections/CarbonCtaSection";
import CarbonPredictorSection from "./sections/CarbonPredictorSection";
import CtaSection from "./sections/CtaSection";
import FaqSection from "./sections/FaqSection";
import FeaturesSection from "./sections/FeaturesSection";
import GallerySection from "./sections/GallerySection";
import HeroSection from "./sections/HeroSection";
import LogosSection from "./sections/LogosSection";
import MissionSection from "./sections/MissionSection";
import PodcastSection from "./sections/PodcastSection";
import TeamPageSection from "./sections/TeamPageSection";
import ProjectGallerySection from "./sections/ProjectGallerySection";
import ProjectsSection from "./sections/ProjectsSection";
import RichTextSection from "./sections/RichTextSection";
import TeamSection from "./sections/TeamSection";
import TestimonialsSection from "./sections/TestimonialsSection";
import Reveal from "./Reveal/Reveal";

const renderSection = (section: Section, index: number) => {
  switch (section.type) {
    case "hero":
      return <HeroSection key={`hero-${index}`} section={section} />;
    case "features":
      return (
        <Reveal key={`features-${index}`}>
          <FeaturesSection section={section} />
        </Reveal>
      );
    case "logos":
      return (
        <Reveal key={`logos-${index}`}>
          <LogosSection section={section} />
        </Reveal>
      );
    case "about":
      return (
        <Reveal key={`about-${index}`}>
          <AboutSection section={section} />
        </Reveal>
      );
    case "mission":
      return (
        <Reveal key={`mission-${index}`}>
          <MissionSection section={section} />
        </Reveal>
      );
    case "team":
      return (
        <Reveal key={`team-${index}`}>
          <TeamSection section={section} />
        </Reveal>
      );
    case "teamPage":
      return (
        <Reveal key={`teamPage-${index}`}>
          <TeamPageSection section={section} />
        </Reveal>
      );
    case "projects":
      return (
        <Reveal key={`projects-${index}`}>
          <ProjectsSection section={section} />
        </Reveal>
      );
    case "gallery":
      return (
        <Reveal key={`gallery-${index}`}>
          <GallerySection section={section} />
        </Reveal>
      );
    case "projectGallery":
      return (
        <Reveal key={`projectGallery-${index}`}>
          <ProjectGallerySection section={section} />
        </Reveal>
      );
    case "articles":
      return (
        <Reveal key={`articles-${index}`}>
          <ArticlesSection section={section} />
        </Reveal>
      );
    case "podcast":
      return (
        <Reveal key={`podcast-${index}`}>
          <PodcastSection section={section} />
        </Reveal>
      );
    case "contact":
      return <div key={`contact-${index}`} id="contact" className="hidden" />;
    case "testimonials":
      return (
        <Reveal key={`testimonials-${index}`}>
          <TestimonialsSection section={section} />
        </Reveal>
      );
    case "faq":
      return (
        <Reveal key={`faq-${index}`}>
          <FaqSection section={section} />
        </Reveal>
      );
    case "cta":
      return (
        <Reveal key={`cta-${index}`}>
          <CtaSection section={section} />
        </Reveal>
      );
    case "richText":
      return (
        <Reveal key={`richText-${index}`}>
          <RichTextSection section={section} />
        </Reveal>
      );
    case "carbonPredictor":
      return (
        <Reveal key={`carbonPredictor-${index}`}>
          <CarbonPredictorSection section={section} />
        </Reveal>
      );
    case "carbonCta":
      return (
        <Reveal key={`carbonCta-${index}`}>
          <CarbonCtaSection section={section} />
        </Reveal>
      );
    default:
      return null;
  }
};

export default function SectionRenderer({ sections }: { sections: Section[] }) {
  return <div className="space-y-0">{sections.map(renderSection)}</div>;
}
