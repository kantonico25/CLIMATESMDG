import React from "react";

const Team: React.FC = () => {
  return (
    <section id="team" className="bg-[#008282] py-16 px-6 text-white text-center">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-12">L'équipe & Notre Impact</h2>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
          <div className="flex flex-col items-center">
            <span className="text-yellow-400 text-4xl md:text-5xl font-black mb-2">6</span>
            <p className="text-sm md:text-base font-bold uppercase tracking-tight">Conseil d'Admin</p>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-yellow-400 text-4xl md:text-5xl font-black mb-2">4</span>
            <p className="text-sm md:text-base font-bold uppercase tracking-tight">Bureau Exécutif</p>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-yellow-400 text-4xl md:text-5xl font-black mb-2">28</span>
            <p className="text-sm md:text-base font-bold uppercase tracking-tight">Membres Actifs</p>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-yellow-400 text-4xl md:text-5xl font-black mb-2">6</span>
            <p className="text-sm md:text-base font-bold uppercase tracking-tight">Points Focaux</p>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-yellow-400 text-4xl md:text-5xl font-black mb-2">1000+</span>
            <p className="text-sm md:text-base font-bold uppercase tracking-tight">Bénévoles</p>
          </div>
        </div>

        <p className="text-xs md:text-sm font-medium mb-8 opacity-90 italic">
          Nos points focaux sont répartis à :
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <span className="px-6 py-2 bg-[#26a6a6] rounded-xl text-sm font-semibold border border-white/20 shadow-inner">Androy</span>
          <span className="px-6 py-2 bg-[#26a6a6] rounded-xl text-sm font-semibold border border-white/20 shadow-inner">Antsinanana</span>
          <span className="px-6 py-2 bg-[#26a6a6] rounded-xl text-sm font-semibold border border-white/20 shadow-inner">Anosy</span>
          <span className="px-6 py-2 bg-[#26a6a6] rounded-xl text-sm font-semibold border border-white/20 shadow-inner">Boeny</span>
          <span className="px-6 py-2 bg-[#26a6a6] rounded-xl text-sm font-semibold border border-white/20 shadow-inner">Vakinankaratra</span>
          <span className="px-6 py-2 bg-[#26a6a6] rounded-xl text-sm font-semibold border border-white/20 shadow-inner">Menabe</span>
        </div>
      </div>
    </section>
  );
};

export default React.memo(Team);

