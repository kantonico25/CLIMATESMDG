import DOMPurify from "dompurify";
import type { RichTextSection as RichTextSectionType } from "../../api/types";

export default function RichTextSection({
  section
}: {
  section: RichTextSectionType;
}) {
  const sanitized = DOMPurify.sanitize(section.body);

  return (
    <section className="perf-section py-16 px-6">
      <div className="max-w-5xl mx-auto">
        {section.title ? <h2 className="text-3xl font-bold mb-6">{section.title}</h2> : null}
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: sanitized }} />
      </div>
    </section>
  );
}
