import React, { useState } from "react";

type FormStatus = "idle" | "loading" | "success" | "error";

type ContactFormState = {
  name: string;
  email: string;
  phone: string;
  reason: string;
  company: string;
};

type ContactFormPanelProps = {
  className?: string;
};

const initialState: ContactFormState = {
  name: "",
  email: "",
  phone: "",
  reason: "",
  company: "",
};

const ContactFormPanel: React.FC<ContactFormPanelProps> = ({ className }) => {
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
      const apiBase = import.meta.env.VITE_API_URL || "";
      const response = await fetch(`${apiBase}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Une erreur est survenue lors de l'envoi.");
      }

      setStatus("success");
      setStatusMessage("Merci ! Votre demande a bien été envoyée.");
      setFormData(initialState);
    } catch (error) {
      setStatus("error");
      setStatusMessage(error instanceof Error ? error.message : "Impossible d'envoyer le formulaire.");
    }
  };

  return (
    <form
      className={`${className ?? ""} bg-white rounded-3xl shadow-lg p-8 border border-gray-100`}
      onSubmit={handleSubmit}
    >
      <h2 className="text-xl font-bold text-gray-900 mb-6">Inscription bénévolat</h2>

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
        {status === "loading" ? "Envoi en cours..." : "Envoyer la demande"}
      </button>

      {statusMessage ? (
        <p className={`mt-4 text-sm ${status === "success" ? "text-teal-600" : "text-red-500"}`} aria-live="polite">
          {statusMessage}
        </p>
      ) : null}
    </form>
  );
};

export default ContactFormPanel;

