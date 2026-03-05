import { useState } from "react";
import type { ContactSection as ContactSectionType } from "../../api/types";
import Icon from "../Icon/Icon";

type FormStatus = "idle" | "loading" | "success" | "error";

type ContactFormState = {
  name: string;
  email: string;
  phone: string;
  reason: string;
  company: string;
};

const initialState: ContactFormState = {
  name: "",
  email: "",
  phone: "",
  reason: "",
  company: ""
};

export default function ContactSection({ section }: { section: ContactSectionType }) {
  const [formData, setFormData] = useState<ContactFormState>(initialState);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setStatusMessage("");

    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || "";
      const response = await fetch(`${apiBase}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Une erreur est survenue lors de l'envoi.");
      }

      setStatus("success");
      setStatusMessage(section.successMessage || "Merci ! Votre demande a bien été envoyée.");
      setFormData(initialState);
    } catch (error) {
      setStatus("error");
      setStatusMessage(error instanceof Error ? error.message : "Impossible d'envoyer le formulaire.");
    }
  };

  return (
    <section className="perf-section bg-slate-50 px-6 py-16" id="contact">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 text-center">
          {section.eyebrow ? <p className="text-sm uppercase tracking-[0.3em] text-teal-600">{section.eyebrow}</p> : null}
          {section.title ? <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mt-3">{section.title}</h1> : null}
          {section.subtitle ? (
            <p className="text-sm md:text-base text-gray-600 mt-4 max-w-2xl mx-auto">{section.subtitle}</p>
          ) : null}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            {section.infoTitle ? <h2 className="text-xl font-bold text-gray-900 mb-3">{section.infoTitle}</h2> : null}
            {section.infoText ? <p className="text-sm text-gray-600 leading-relaxed mb-6">{section.infoText}</p> : null}
            {section.contacts.length ? (
              <div className="space-y-4 text-sm text-gray-700">
                {section.contacts.map((item, index) => (
                  <div key={`${item.value}-${index}`} className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center">
                      {item.iconName ? <Icon name={item.iconName} /> : null}
                    </span>
                    <span>{item.value}</span>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <form
            className="lg:col-span-3 bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
            onSubmit={handleSubmit}
          >
            {section.formTitle ? <h2 className="text-xl font-bold text-gray-900 mb-6">{section.formTitle}</h2> : null}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="contact-name" className="text-sm font-semibold text-gray-700">
                  Nom complet
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  placeholder="Votre nom"
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="contact-email" className="text-sm font-semibold text-gray-700">
                  Email
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  placeholder="vous@email.com"
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label htmlFor="contact-phone" className="text-sm font-semibold text-gray-700">
                  Numéro de téléphone
                </label>
                <input
                  id="contact-phone"
                  name="phone"
                  type="tel"
                  placeholder="+261 ..."
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label htmlFor="contact-reason" className="text-sm font-semibold text-gray-700">
                  Pourquoi souhaitez-vous devenir bénévole ?
                </label>
                <textarea
                  id="contact-reason"
                  name="reason"
                  placeholder="Parlez-nous de votre motivation"
                  rows={5}
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  value={formData.reason}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              <div className="hidden" aria-hidden="true">
                <label htmlFor="contact-company">Company</label>
                <input
                  id="contact-company"
                  name="company"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData.company}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-8 w-full bg-[#0d8a8a] text-white font-semibold py-3 rounded-2xl hover:bg-teal-800 transition disabled:opacity-60"
              disabled={status === "loading"}
            >
              {status === "loading" ? "Envoi en cours..." : section.submitLabel || "Envoyer la demande"}
            </button>

            {statusMessage ? (
              <p
                className={`mt-4 text-sm ${status === "success" ? "text-teal-600" : "text-red-500"}`}
                aria-live="polite"
              >
                {statusMessage}
              </p>
            ) : null}
          </form>
        </div>
      </div>
    </section>
  );
}
