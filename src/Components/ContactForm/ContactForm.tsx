import React from "react";
import Icon from "../Icon/Icon";
import ContactFormPanel from "./ContactFormPanel";

const ContactForm: React.FC = () => {
  return (
    <main className="bg-slate-50 min-h-screen">
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="mb-10 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-teal-600">Contact</p>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mt-3">Écrivons ensemble la suite</h1>
          <p className="text-sm md:text-base text-gray-600 mt-4 max-w-2xl mx-auto">
            Laissez-nous vos coordonnées et notre équipe vous répondra rapidement.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Coordonnées</h2>
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
      </section>
    </main>
  );
};

export default React.memo(ContactForm);

