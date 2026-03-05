import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ContactSection } from "../../api/types";

type ContactModalContextValue = {
  isOpen: boolean;
  contactSection: ContactSection | null;
  open: () => void;
  close: () => void;
  setContactSection: (section: ContactSection | null) => void;
};

const ContactModalContext = createContext<ContactModalContextValue | null>(null);

export function ContactModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [contactSection, setContactSection] = useState<ContactSection | null>(null);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo(
    () => ({ isOpen, contactSection, open, close, setContactSection }),
    [isOpen, contactSection, open, close]
  );

  return <ContactModalContext.Provider value={value}>{children}</ContactModalContext.Provider>;
}

export function useContactModal() {
  const context = useContext(ContactModalContext);
  if (!context) {
    throw new Error("useContactModal must be used within ContactModalProvider");
  }
  return context;
}
