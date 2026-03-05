import React from "react";
import Icon from "../Icon/Icon";

const Mission: React.FC = () => {
  return (
    <section id="mission" className="perf-section py-16 bg-slate-50 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">
            Nos <span className="text-teal-600">Piliers & Valeurs</span>
          </h2>
          <div className="w-24 h-1 bg-red-300 mx-auto mt-2 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white p-8 rounded-2xl shadow-md text-center border-b-4 border-teal-500">
            <div className="text-teal-500 text-4xl mb-4 flex justify-center">
              <Icon name="bullseye" />
            </div>
            <h4 className="font-bold mb-3">Mission</h4>
            <p className="text-xs text-gray-500 italic">« Madagascar affranchi de la vulnérabilité climatique »</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-md text-center border-b-4 border-yellow-400">
            <div className="text-yellow-400 text-4xl mb-4 flex justify-center">
              <Icon name="eye" />
            </div>
            <h4 className="font-bold mb-3">Vision</h4>
            <p className="text-xs text-gray-500">
              Développer l'agilité des acteurs et innover pour la résilience communautaire
            </p>
          </div>
          <div className="bg-teal-900 text-white p-8 rounded-2xl shadow-md">
            <h4 className="font-bold border-b border-teal-700 pb-2 mb-4 text-center">Nos Valeurs</h4>
            <ul className="text-sm space-y-3">
              <li className="flex items-center">
                <Icon name="lightbulb" className="text-yellow-400 mr-3" /> INNOVATION
              </li>
              <li className="flex items-center">
                <Icon name="leaf" className="text-yellow-400 mr-3" /> DURABILITÉ
              </li>
              <li className="flex items-center">
                <Icon name="bolt" className="text-yellow-400 mr-3" /> AGILITÉ
              </li>
              <li className="flex items-center">
                <Icon name="shield" className="text-yellow-400 mr-3" /> INTÉGRITÉ
              </li>
            </ul>
          </div>
        </div>

        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-teal-600">Axes Stratégiques</h2>
          <div className="w-24 h-1 bg-red-300 mx-auto mt-2 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="relative bg-white p-8 rounded-2xl shadow-md pt-12">
            <div className="absolute -top-4 left-4 bg-red-400 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
              1
            </div>
            <div className="text-teal-700 text-4xl mb-4">
              <Icon name="landmark" />
            </div>
            <h4 className="font-bold text-lg mb-2">Gouvernance</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Influencer les décisions politiques pour une gouvernance climatique renforcée.
            </p>
          </div>
          <div className="relative bg-white p-8 rounded-2xl shadow-md pt-12">
            <div className="absolute -top-4 left-4 bg-teal-400 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
              2
            </div>
            <div className="text-yellow-400 text-4xl mb-4">
              <Icon name="users" />
            </div>
            <h4 className="font-bold text-lg mb-2">Mobilisation</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Renforcer la mobilisation citoyenne et communautaire face au changement climatique.
            </p>
          </div>
          <div className="relative bg-white p-8 rounded-2xl shadow-md pt-12">
            <div className="absolute -top-4 left-4 bg-yellow-400 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
              3
            </div>
            <div className="text-teal-800 text-4xl mb-4">
              <Icon name="microscope" />
            </div>
            <h4 className="font-bold text-lg mb-2">Recherche</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Promouvoir la recherche et l'innovation pour des solutions climatiques durables.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(Mission);

