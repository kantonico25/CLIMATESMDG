import type { CtaSection as CtaSectionType } from "../../api/types";

export default function CtaSection({ section }: { section: CtaSectionType }) {
  return (
    <section className="perf-section py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-gradient-to-r from-teal-700 to-teal-900 text-white rounded-2xl p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            {section.title ? <h2 className="text-3xl font-bold mb-2">{section.title}</h2> : null}
            {section.text ? <p className="text-sm opacity-90">{section.text}</p> : null}
          </div>
          {section.buttonLabel && section.buttonUrl ? (
            <a
              className="bg-white text-teal-800 font-semibold px-8 py-3 rounded-full hover:bg-slate-100 transition"
              href={section.buttonUrl}
            >
              {section.buttonLabel}
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
