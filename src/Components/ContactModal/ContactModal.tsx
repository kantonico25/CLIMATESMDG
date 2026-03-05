import React, { useEffect } from "react";
import Icon from "../Icon/Icon";
import ContactFormPanel from "../ContactForm/ContactFormPanel";

type ContactModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    document.documentElement.style.overscrollBehavior = "contain";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overscrollBehavior = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 px-4 py-10 overflow-hidden"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-5xl mx-auto rounded-3xl bg-white shadow-2xl relative max-h-[90vh] overflow-y-auto overscroll-contain scrollbar-hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Inscription bénévolat"
        onWheelCapture={(event) => event.stopPropagation()}
        onTouchMoveCapture={(event) => event.stopPropagation()}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="sticky top-4 float-right mr-4 z-10 text-gray-500 hover:text-gray-700"
          aria-label="Fermer"
          onClick={onClose}
        >
          <Icon name="xmark" className="text-xl" />
        </button>
        <div className="p-6 sm:p-10">
          <div className="mb-8 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-teal-600">Contact</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-3">Écrivons ensemble la suite</h2>
            <p className="text-sm text-gray-600 mt-3 max-w-2xl mx-auto">
              Laissez-nous vos coordonnées et notre équipe vous répondra rapidement.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            <div className="lg:col-span-2 bg-slate-50 rounded-3xl p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Coordonnées</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                Vous pouvez aussi nous joindre directement ou passer nous voir à notre antenne locale.
              </p>
              <div className="space-y-4 text-sm text-gray-700">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center">
                    <Icon name="phone" />
                  </span>
                  <span>+261 34 91 259 59</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center">
                    <Icon name="envelope" />
                  </span>
                  <span>mada@climates.fr</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center">
                    <Icon name="location" />
                  </span>
                  <span>Andravoahangy, Antananarivo</span>
                </div>
              </div>
            </div>

            <ContactFormPanel className="lg:col-span-3" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;

