import React from "react";

const Projects: React.FC = () => {
  return (
    <section id="projects" className="py-20 bg-white px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold">
            Nos <span className="text-teal-600">Réalisations & Impacts</span>
          </h2>
          <div className="w-24 h-1 bg-red-300 mx-auto mt-2 rounded-full"></div>
        </div>

        <div className="relative wrap overflow-hidden p-10 h-full">
          <div className="absolute border-opacity-20 border-gray-700 h-full border" style={{ left: "50%" }}></div>

          <div className="mb-8 flex justify-between items-center w-full right-timeline">
            <div className="order-1 w-5/12 text-right">
              <h3 className="mb-1 font-bold text-gray-800 text-xl">2015-2022</h3>
              <h4 className="text-sm font-bold text-gray-500 mb-2">COP in my city & Mobilisation</h4>
              <p className="text-xs leading-snug tracking-wide text-gray-400">
                COP in my city, Global strike for the future, Plaidoyer climatique, Simulation Conseil Municipal
                Écologique, COYs.
              </p>
            </div>
            <div className="z-20 flex items-center order-1 bg-teal-800 shadow-xl w-4 h-4 rounded-full"></div>
            <div className="order-1 bg-white rounded-2xl shadow-md w-5/12 px-6 py-4 border border-gray-100">
              <span className="text-red-400 font-bold text-sm">Impact</span>
              <p className="text-xs text-gray-500 mt-1">Plus de 2 200 jeunes et enfants impactés à Madagascar.</p>
            </div>
          </div>

          <div className="mb-8 flex justify-between flex-row-reverse items-center w-full left-timeline">
            <div className="order-1 w-5/12 text-left">
              <h3 className="mb-1 font-bold text-yellow-500 text-xl">2023</h3>
              <h4 className="text-sm font-bold text-gray-500 mb-2">Politique & COP 28</h4>
              <p className="text-xs leading-snug tracking-wide text-gray-400">
                La présidentielle du climat (TAFA), Participation COP 28 (Negotrackers), Outils de sensibilisation
                élections.
              </p>
            </div>
            <div className="z-20 flex items-center order-1 bg-yellow-400 shadow-xl w-4 h-4 rounded-full"></div>
            <div className="order-1 bg-white rounded-2xl shadow-md w-5/12 px-6 py-4 border border-gray-100">
              <span className="text-red-400 font-bold text-sm">Impact</span>
              <p className="text-xs text-gray-500 mt-1">
                Renforcement de la participation de la jeunesse malgache aux COPs.
              </p>
            </div>
          </div>

          <div className="mb-8 flex justify-between items-center w-full right-timeline">
            <div className="order-1 w-5/12 text-right">
              <h3 className="mb-1 font-bold text-teal-600 text-xl">2024</h3>
              <h4 className="text-sm font-bold text-gray-500 mb-2">Recherche & Expansion</h4>
              <p className="text-xs leading-snug tracking-wide text-gray-400">
                Recherche handicap & climat, Youth Hackathon Award (UNESCO), Suivi délégation EU (COP 28) & Mada
                (COP 16).
              </p>
            </div>
            <div className="z-20 flex items-center order-1 bg-teal-600 shadow-xl w-4 h-4 rounded-full"></div>
            <div className="order-1 bg-white rounded-2xl shadow-md w-5/12 px-6 py-4 border border-gray-100">
              <span className="text-red-400 font-bold text-sm">Collaborations</span>
              <p className="text-xs text-gray-500">25 collaborations engagées</p>
              <span className="text-red-400 font-bold text-sm mt-2 block">Formation</span>
              <p className="text-xs text-gray-500">1300 jeunes sensibilisés</p>
            </div>
          </div>

          <div className="mb-8 flex justify-between flex-row-reverse items-center w-full left-timeline">
            <div className="order-1 w-5/12 text-left">
              <h3 className="mb-1 font-bold text-teal-500 text-xl">2025</h3>
              <p className="text-xs leading-snug tracking-wide text-gray-400">
                MIONJO, Idea's Echo, Community of practices avec Impulseouth, Volontariat (France), Festival
                initiatives vertes.
              </p>
            </div>
            <div className="z-20 flex items-center order-1 bg-teal-500 shadow-xl w-4 h-4 rounded-full"></div>
            <div className="order-1 bg-white rounded-2xl shadow-md w-5/12 px-6 py-4 border border-gray-100">
              <p className="text-xs text-gray-500 italic">80 jeunes formés dans le grand Sud (WASH, Agri-verte)</p>
              <p className="text-xs text-gray-500 italic">520 jeunes sensibilisés à Antananarivo</p>
              <p className="text-xs text-gray-500 italic">1 VSI en volontariat en France</p>
            </div>
          </div>

          <div className="mb-8 flex justify-between items-center w-full right-timeline">
            <div className="order-1 w-5/12 text-right">
              <h3 className="mb-1 font-bold text-teal-600 text-xl">2026</h3>
              <p className="text-sm font-bold text-gray-500 italic">À venir</p>
            </div>
            <div className="z-20 flex items-center order-1 bg-teal-600 shadow-xl w-4 h-4 rounded-full"></div>
            <div className="order-1 w-5/12"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(Projects);

