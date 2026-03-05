import type { FeaturesSection as FeaturesSectionType } from "../../api/types";
import Icon from "../Icon/Icon";

export default function FeaturesSection({ section }: { section: FeaturesSectionType }) {
  return (
    <section className="perf-section py-20 bg-white px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          {section.title ? <h2 className="text-3xl font-bold">{section.title}</h2> : null}
          {section.subtitle ? <p className="text-sm text-gray-600 mt-3">{section.subtitle}</p> : null}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {section.items.map((item, index) => (
            <article key={`${item.title}-${index}`} className="bg-white p-8 rounded-2xl shadow-md text-center">
              {item.iconName ? (
                <span className="text-teal-500 text-4xl mb-4 flex justify-center">
                  <Icon name={item.iconName} />
                </span>
              ) : null}
              <h3 className="font-bold mb-3">{item.title}</h3>
              {item.description ? <p className="text-sm text-gray-500">{item.description}</p> : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
