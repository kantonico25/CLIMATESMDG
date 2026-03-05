import React from "react";
import Icon from "../Icon/Icon";
import logo from "../../assets/logo/logo2.webp";

type FooterProps = {
  onSignupClick?: () => void;
};

const Footer: React.FC<FooterProps> = ({ onSignupClick }) => {
  return (
    <footer id="contact" className="perf-section bg-[#008282] text-white pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-12">
          <div className="space-y-6">
            <div className="text-2xl font-bold flex items-center">
              <img className="h-[60px]" src={logo} alt="CliMates Madagascar" />
            </div>
            <p className="text-sm leading-relaxed opacity-90">
              Agissons ensemble pour un Madagascar affranchi de la vulnérabilité climatique. Rejoignez le mouvement
              des jeunes leaders.
            </p>
            <div className="flex space-x-4 text-2xl">
              <a href="#" className="hover:text-yellow-400 transition" aria-label="Facebook">
                <Icon name="facebook" />
              </a>
              <a href="#" className="hover:text-yellow-400 transition" aria-label="Instagram">
                <Icon name="instagram" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-yellow-400 font-bold uppercase mb-6 tracking-wider">Contact</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-3">
                <Icon name="phone" className="text-xs" /> +261 34 91 259 59
              </li>
              <li className="flex items-center gap-3">
                <Icon name="envelope" className="text-xs" /> mada@climates.fr
              </li>
              <li className="flex items-center gap-3">
                <Icon name="location" className="text-xs" /> Andravoahangy
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-yellow-400 font-bold uppercase mb-6 tracking-wider">Liens Rapide</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#about" className="hover:underline opacity-90">
                  À propos
                </a>
              </li>
              <li>
                <a href="#mission" className="hover:underline opacity-90">
                  Mission
                </a>
              </li>
              <li>
                <a href="#team" className="hover:underline opacity-90">
                  Équipe
                </a>
              </li>
              <li>
                <a href="#projects" className="hover:underline opacity-90">
                  Projet
                </a>
              </li>
            </ul>
          </div>

          <div className="bg-[#006e6e] rounded-3xl p-8 border border-white/10 shadow-xl text-center">
            <h4 className="text-yellow-400 text-xl font-bold mb-2">Devenir Bénévole</h4>
            <p className="text-xs mb-6 opacity-90">Rejoignez nos 1000+ bénévoles à travers l'île.</p>
            {onSignupClick ? (
              <button
                type="button"
                onClick={onSignupClick}
                className="bg-[#f87171] hover:bg-[#ef4444] text-white font-bold py-3 px-10 rounded-2xl transition block shadow-lg w-full"
              >
                S'inscrire
              </button>
            ) : (
              <a
                href="/contact"
                className="bg-[#f87171] hover:bg-[#ef4444] text-white font-bold py-3 px-10 rounded-2xl transition block shadow-lg"
              >
                S'inscrire
              </a>
            )}
          </div>
        </div>

        <div className="border-t border-white/20 pt-8 text-center text-[10px] opacity-70 tracking-widest uppercase">
          © 2026 CliMates Madagascar. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
};

export default React.memo(Footer);

