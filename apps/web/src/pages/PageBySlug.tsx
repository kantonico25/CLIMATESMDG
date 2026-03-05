import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/client";
import { useAsync } from "../api/useAsync";
import SectionRenderer from "../components/SectionRenderer";
import { useContactModal } from "../components/ContactModal/ContactModalContext";
import PageLoader from "../components/loading/PageLoader";

export default function PageBySlug() {
  const params = useParams();
  const slug = params.slug ?? "";
  const { data, loading, error } = useAsync(() => api.getPage(slug), [slug]);
  const { setContactSection } = useContactModal();

  useEffect(() => {
    if (!data) return;
    const contact = data.sections.find((section) => section.type === "contact") ?? null;
    setContactSection(contact);
  }, [data, setContactSection]);

  if (loading) return <PageLoader label="Loading page..." />;
  if (error || !data) return <div className="status error">Page not found.</div>;

  return <SectionRenderer sections={data.sections} />;
}
