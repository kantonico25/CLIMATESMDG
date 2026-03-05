import { useEffect } from "react";
import ContactSection from "../sections/ContactSection";
import { useContactModal } from "./ContactModalContext";
import Icon from "../Icon/Icon";

export default function ContactModal() {
  const { isOpen, close, contactSection } = useContactModal();

  if (!isOpen || !contactSection) return null;

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [close]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 py-8"
      onClick={close}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-4xl rounded-[16px] bg-white shadow-2xl overflow-hidden"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex justify-end bg-white/90 backdrop-blur border-b border-gray-100 px-6 py-4">
          <button
            type="button"
            onClick={close}
            className="rounded-full bg-gray-100 p-2 text-gray-700 hover:bg-gray-200"
            aria-label="Fermer"
          >
            <Icon name="xmark" />
          </button>
        </div>
        <div className="max-h-[85vh] overflow-y-auto">
          <ContactSection section={contactSection} />
        </div>
      </div>
    </div>
  );
}
