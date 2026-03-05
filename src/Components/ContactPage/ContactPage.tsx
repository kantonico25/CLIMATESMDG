import React from "react";
import NavigationBar from "../NavigationBar/NavigationBar";
import Footer from "../Footer/Footer";
import BackToTop from "../BackToTop/BackToTop";
import ContactForm from "../ContactForm/ContactForm";
import Seo from "../Seo/Seo";

const ContactPage: React.FC = () => {
  return (
    <>
      <Seo
        title="Contact"
        description="Rejoignez le mouvement CliMates Madagascar : inscrivez-vous comme volontaire ou contactez notre équipe."
        path="/contact"
      />
      <NavigationBar />
      <ContactForm />
      <Footer />
      <BackToTop />
    </>
  );
};

export default ContactPage;

