import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { api } from "../api/client";
import { useAsync } from "../api/useAsync";
import SectionRenderer from "../components/SectionRenderer";
import { useContactModal } from "../components/ContactModal/ContactModalContext";

export default function HomePage() {
  const { data, loading, error } = useAsync(() => api.getPage("home"), []);
  const { setContactSection } = useContactModal();
  const location = useLocation();

  useEffect(() => {
    if (!data) return;
    const contact = data.sections.find((section) => section.type === "contact") ?? null;
    setContactSection(contact);
  }, [data, setContactSection]);

  useEffect(() => {
    if (!data || !location.hash) return;
    const id = location.hash.replace("#", "");
    const target = document.getElementById(id);
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [data, location.hash]);

  if (loading) return null;
  if (error || !data) return <div className="status error">Home page not found.</div>;

  return <SectionRenderer sections={data.sections} />;
}
