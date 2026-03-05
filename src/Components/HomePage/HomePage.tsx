import React, { Suspense, useState } from "react";
import NavigationBar from "../NavigationBar/NavigationBar";
import Hero from "../Hero/Hero";
import About from "../About/About";
import Mission from "../Mission/Mission";
import Team from "../Team/Team";
import Projects from "../Projects/Projects";
import Gallery from "../Gallery/Gallery";
import ArticlesSection from "../Articles/ArticlesSection";
import Footer from "../Footer/Footer";
import BackToTop from "../BackToTop/BackToTop";
import ScrollEffects from "../ScrollEffects/ScrollEffects";
import Seo from "../Seo/Seo";

const ContactModal = React.lazy(() => import("../ContactModal/ContactModal"));

const HomePage: React.FC = () => {
  const [isContactOpen, setIsContactOpen] = useState(false);

  const openContact = () => setIsContactOpen(true);
  const closeContact = () => setIsContactOpen(false);

  return (
    <>
      <Seo
        title="Accueil"
        description="Think-and do-tank international mobilisant la jeunesse malgache pour l'action climatique, l'innovation et le plaidoyer."
        path="/"
      />
      <ScrollEffects />
      <NavigationBar />
      <Hero onCtaClick={openContact} />
      <About />
      <Mission />
      <Team />
      <Projects />
      <Gallery />
      <ArticlesSection />
      <Footer onSignupClick={openContact} />
      <BackToTop />
      {isContactOpen ? (
        <Suspense fallback={null}>
          <ContactModal isOpen={isContactOpen} onClose={closeContact} />
        </Suspense>
      ) : null}
    </>
  );
};

export default HomePage;

