import DOMPurify from "dompurify";
import type { AboutSection as AboutSectionType } from "../../api/types";
import { getMediaSrcSet } from "../media/mediaUtils";

export default function AboutSection({ section }: { section: AboutSectionType }) {
  const body = section.body ? DOMPurify.sanitize(section.body) : "";
  const quote = section.quote ? DOMPurify.sanitize(section.quote) : "";

  return (
    <section id="about" className="perf-section py-20 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          {section.title ? (
            <h2 className="text-3xl font-bold mb-2">
              {section.title} {section.titleAccent ? <span className="text-teal-600">{section.titleAccent}</span> : null}
            </h2>
          ) : null}
          {section.subtitle ? <h3 className="text-4xl font-extrabold mb-6">{section.subtitle}</h3> : null}

          {body ? (
            <div className="text-sm leading-relaxed mb-6" dangerouslySetInnerHTML={{ __html: body }} />
          ) : null}

          {quote ? (
            <div className="border-l-4 border-teal-600 pl-4 mb-8">
              <div className="text-sm italic text-gray-700" dangerouslySetInnerHTML={{ __html: quote }} />
            </div>
          ) : null}

          {section.countries.length ? (
            <div className="flex flex-wrap gap-2">
              {section.countries.map((country, index) => {
                const badgeClassName = `inline-flex items-center px-4 py-1 rounded-full text-xs font-medium border border-gray-200 transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.03] hover:shadow-sm ${
                  country.isHighlighted ? "bg-yellow-400 text-black font-bold shadow-sm hover:brightness-95" : "bg-gray-100 text-teal-700 hover:bg-gray-200"
                }`;

                if (country.url) {
                  const isExternal = /^https?:\/\//i.test(country.url);
                  return (
                    <a
                      key={`${country.label}-${index}`}
                      href={country.url}
                      className={badgeClassName}
                      target={isExternal ? "_blank" : undefined}
                      rel={isExternal ? "noreferrer noopener" : undefined}
                    >
                      {country.label}
                    </a>
                  );
                }

                return (
                  <span key={`${country.label}-${index}`} className={badgeClassName}>
                    {country.label}
                  </span>
                );
              })}
            </div>
          ) : null}
        </div>

        <div className="relative">
          <div className="rounded-[1rem] overflow-hidden shadow-2xl relative">
            {section.image?.url ? (
              <img
                key={section.image.url}
                className="w-full h-[400px] object-cover brightness-50"
                src={section.image.url}
                srcSet={getMediaSrcSet(section.image)}
                sizes="(min-width: 1024px) 50vw, 100vw"
                alt={section.image.alternativeText || section.imageCaptionTitle || "About"}
                loading="lazy"
                decoding="async"
                width={section.image.width ?? undefined}
                height={section.image.height ?? undefined}
              />
            ) : null}

            {(section.imageCaptionTitle || section.imageCaptionSubtitle) && (
              <div className="absolute bottom-6 left-6 text-white">
                {section.imageCaptionTitle ? <h4 className="text-xl font-bold">{section.imageCaptionTitle}</h4> : null}
                {section.imageCaptionSubtitle ? (
                  <p className="text-xs text-yellow-400 font-semibold">{section.imageCaptionSubtitle}</p>
                ) : null}
              </div>
            )}
          </div>

          {(section.badgeLabel || section.badgeValue) && (
            <div className="absolute -top-6 -right-6 bg-yellow-400 w-24 h-24 rounded-full flex flex-col items-center justify-center text-center shadow-lg border-4 border-white">
              {section.badgeLabel ? (
                <span className="text-[10px] uppercase font-bold leading-none">{section.badgeLabel}</span>
              ) : null}
              {section.badgeValue ? <span className="text-2xl font-black">{section.badgeValue}</span> : null}
              {section.badgeSuffix ? <span className="text-[10px] font-bold">{section.badgeSuffix}</span> : null}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
