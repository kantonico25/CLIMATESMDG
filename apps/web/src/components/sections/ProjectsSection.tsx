import type { ProjectsSection as ProjectsSectionType } from "../../api/types";

const resolveColor = (value?: string | null, fallback?: string) => {
  if (!value) return fallback;
  return value;
};

export default function ProjectsSection({ section }: { section: ProjectsSectionType }) {
  return (
    <section id="projects" className="perf-section py-20 bg-white px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          {section.title ? <h2 className="text-3xl font-bold">{section.title}</h2> : null}
          <div className="w-24 h-1 bg-red-300 mx-auto mt-2 rounded-full"></div>
        </div>

        <div className="relative overflow-hidden p-10 h-full">
          <div className="absolute border-opacity-20 border-gray-700 h-full border" style={{ left: "50%" }}></div>

          {section.items.map((item, index) => {
            const isLeft = item.side === "left";
            const markerStyle = resolveColor(item.markerColor, isLeft ? "#facc15" : "#0f766e");
            const hasImpactContent =
              Boolean(item.impactTitle || item.impactText) ||
              item.extraNotes.some((note) => Boolean(note.text));

            return (
              <div
                key={`${item.period}-${index}`}
                className={`mb-8 flex justify-between items-center w-full ${
                  isLeft ? "flex-row-reverse" : ""
                }`}
              >
                <div className={`order-1 w-5/12 ${isLeft ? "text-left" : "text-right"}`}>
                  {item.period ? <h3 className="mb-1 font-bold text-gray-800 text-xl">{item.period}</h3> : null}
                  {item.title ? <h4 className="text-sm font-bold text-gray-500 mb-2">{item.title}</h4> : null}
                  {item.subtitle ? <p className="text-xs leading-snug tracking-wide text-gray-400">{item.subtitle}</p> : null}
                  {item.description ? (
                    <p className="text-xs leading-snug tracking-wide text-gray-400">{item.description}</p>
                  ) : null}
                </div>

                <div
                  className="z-20 flex items-center order-1 shadow-xl w-4 h-4 rounded-full"
                  style={{ backgroundColor: markerStyle || "#0f766e" }}
                ></div>

                {hasImpactContent ? (
                  <div className="order-1 bg-white rounded-2xl shadow-md w-5/12 px-6 py-4 border border-gray-100">
                    {item.impactTitle ? (
                      <span className="text-red-400 font-bold text-sm">{item.impactTitle}</span>
                    ) : null}
                    {item.impactText ? <p className="text-xs text-gray-500 mt-1">{item.impactText}</p> : null}
                    {item.extraNotes.length ? (
                      <div className="mt-2 space-y-1">
                        {item.extraNotes.map((note, noteIndex) => (
                          <p key={`${note.text}-${noteIndex}`} className="text-xs text-gray-500 italic">
                            {note.text}
                          </p>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <div className="order-1 w-5/12" aria-hidden="true" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
