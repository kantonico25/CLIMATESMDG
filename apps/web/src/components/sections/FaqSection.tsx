import type { FaqSection as FaqSectionType } from "../../api/types";

export default function FaqSection({ section }: { section: FaqSectionType }) {
  return (
    <section className="perf-section py-20 bg-white px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          {section.title ? <h2 className="text-3xl font-bold">{section.title}</h2> : null}
        </div>
        <div className="space-y-4">
          {section.items.map((item, index) => (
            <details key={`${item.question}-${index}`} className="bg-slate-50 rounded-2xl p-5">
              <summary className="cursor-pointer font-semibold text-gray-800">{item.question}</summary>
              <p className="text-sm text-gray-600 mt-3">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
