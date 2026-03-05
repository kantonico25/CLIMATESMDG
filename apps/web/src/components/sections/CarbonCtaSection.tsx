import { Link } from "react-router-dom";
import type { CarbonCtaSection as CarbonCtaSectionType } from "../../api/types";

export default function CarbonCtaSection({ section }: { section: CarbonCtaSectionType }) {
  const buttonLabel = section.buttonLabel ?? "Lancer le calculateur";
  const buttonUrl = section.buttonUrl ?? "/carbon-footprint";

  return (
    <section className="perf-section py-20 px-6 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-800 text-white rounded-2xl p-10 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 shadow-xl">
          <div className="max-w-2xl">
            {section.title ? <h2 className="text-3xl md:text-4xl font-bold mb-3">{section.title}</h2> : null}
            {section.subtitle ? <p className="text-sm md:text-base opacity-90">{section.subtitle}</p> : null}
          </div>
          {buttonLabel && buttonUrl ? (
            <Link
              to={buttonUrl}
              className="inline-flex items-center gap-2 bg-white text-emerald-800 font-semibold px-6 py-3 rounded-full hover:bg-emerald-50 transition"
            >
              {buttonLabel}
              
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
