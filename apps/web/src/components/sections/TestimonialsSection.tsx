import type { TestimonialsSection as TestimonialsSectionType } from "../../api/types";

export default function TestimonialsSection({
  section
}: {
  section: TestimonialsSectionType;
}) {
  return (
    <section className="perf-section py-20 bg-slate-50 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          {section.title ? <h2 className="text-3xl font-bold">{section.title}</h2> : null}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {section.items.map((item, index) => (
            <article key={`${item.name}-${index}`} className="bg-white rounded-2xl shadow-md p-6">
              <p className="text-sm text-gray-600 mb-6">“{item.quote}”</p>
              <div className="flex items-center gap-3">
                {item.avatar?.url ? (
                  <img
                    src={item.avatar.url}
                    alt={item.avatar.alternativeText || item.name}
                    className="w-12 h-12 rounded-full object-cover"
                    loading="lazy"
                    decoding="async"
                    width={item.avatar.width ?? 48}
                    height={item.avatar.height ?? 48}
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-teal-100" aria-hidden="true" />
                )}
                <div>
                  <strong className="block">{item.name}</strong>
                  {item.role ? <span className="text-xs text-gray-500">{item.role}</span> : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
