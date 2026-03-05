import React, { useState } from "react";
import Icon from "../Icon/Icon";
import logo from "../../assets/logo/logo.webp";

const NavigationBar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-sm sticky top-0 z-50">
        <div className="flex items-center">
          <div className="text-teal-700 font-bold text-2xl flex items-center">
            <img className="h-[60px]" src={logo} alt="CliMates Logo" />
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-600">
          <a href="#about" className="hover:text-teal-700 transition">
            À propos
          </a>
          <a href="#mission" className="hover:text-teal-700 transition">
            Missions
          </a>
          <a href="#team" className="hover:text-teal-700 transition">
            Équipes
          </a>
          <a href="#projects" className="hover:text-teal-700 transition">
            Projets
          </a>
          <a href="#gallery" className="hover:text-teal-700 transition">
            Galerie
          </a>
          <a
            href="#contact"
            className="bg-yellow-400 text-black px-6 py-2 rounded-full font-bold hover:bg-yellow-500 transition"
          >
            Contact
          </a>
        </div>

        <div className="hidden lg:flex items-center text-gray-600 text-sm">
          <Icon name="phone" className="mr-2 text-pink-400" />
          <span>+261 34 91 259 59</span>
        </div>

        <button
          className="md:hidden text-2xl"
          id="menu-btn"
          type="button"
          aria-controls="mobile-menu"
          aria-expanded={isMobileMenuOpen}
          onClick={toggleMobileMenu}
        >
          <span className="sr-only">Toggle menu</span>
          <Icon name="bars" />
        </button>
      </nav>

      <div
        id="mobile-menu"
        className={`md:hidden ${isMobileMenuOpen ? "" : "hidden"} bg-white border-t border-gray-100 shadow-sm`}
      >
        <div className="px-6 py-4 space-y-4 text-sm font-medium text-gray-700">
          <a href="#about" className="block hover:text-teal-700 transition" onClick={closeMobileMenu}>
            À propos
          </a>
          <a href="#mission" className="block hover:text-teal-700 transition" onClick={closeMobileMenu}>
            Missions
          </a>
          <a href="#team" className="block hover:text-teal-700 transition" onClick={closeMobileMenu}>
            Équipes
          </a>
          <a href="#projects" className="block hover:text-teal-700 transition" onClick={closeMobileMenu}>
            Projets
          </a>
          <a
            href="#contact"
            className="block bg-yellow-400 text-black px-4 py-2 rounded-full font-bold hover:bg-yellow-500 transition w-fit"
            onClick={closeMobileMenu}
          >
            Contact
          </a>
          <div className="flex items-center text-gray-600 text-sm pt-2">
            <Icon name="phone" className="mr-2 text-pink-400" />
            <span>+261 34 91 259 59</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavigationBar;

