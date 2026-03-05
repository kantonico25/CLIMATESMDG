import type { LogosSection as LogosSectionType } from "../../api/types";

export default function LogosSection({ section }: { section: LogosSectionType }) {
  return (
    <section className="perf-section py-16 bg-white px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          {section.title ? <h2 className="text-2xl font-bold">{section.title}</h2> : null}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
          {section.logos.map((logo, index) => (
            <div key={`${logo.url}-${index}`} className="bg-white rounded-2xl shadow-sm p-4 flex items-center justify-center">
              <img
                src={logo.url}
                alt={logo.alternativeText || `Logo ${index + 1}`}
                loading="lazy"
                decoding="async"
                className="max-h-16 w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
