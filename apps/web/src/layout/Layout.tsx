import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { api } from "../api/client";
import { useAsync } from "../api/useAsync";
import ContactModal from "../components/ContactModal/ContactModal";
import { ContactModalProvider, useContactModal } from "../components/ContactModal/ContactModalContext";
import Icon from "../components/Icon/Icon";

const isExternal = (href: string) => href.startsWith("http");
const isAnchor = (href: string) => href.startsWith("#") || href.startsWith("/#");
const isInternalRoute = (href: string) => href.startsWith("/") && !href.startsWith("/#");
const normalizeNavHref = (href: string) => {
  if (href.startsWith("/#")) return href;
  if (href.startsWith("#")) return `/${href}`;
  return href;
};

function LayoutContent() {
  const { data: global, error } = useAsync(api.getGlobal, []);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { open: openContactModal, contactSection } = useContactModal();

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const navLinks = global?.navbarLinks ?? [];
  const footerQuickLinksColumns = Math.max(1, Math.min(2, global?.footerQuickLinksColumns ?? 2));
  const resolveSocialIcon = (label?: string | null, iconName?: string | null) => {
    if (iconName) return iconName;
    const lower = (label ?? "").toLowerCase();
    if (lower.includes("facebook")) return "facebook";
    if (lower.includes("instagram")) return "instagram";
    if (lower.includes("email") || lower.includes("mail")) return "envelope";
    return "";
  };

  const handleContactLink = (event: React.MouseEvent, href: string) => {
    if (href.includes("#contact") && contactSection) {
      event.preventDefault();
      openContactModal();
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-3">
          {global?.logo?.url ? (
            <Link to="/" aria-label={global?.siteName ?? "CliMates"}>
              <img
                className="h-[60px] w-auto object-contain"
                src={global.logo.url}
                alt={global.logo.alternativeText || "Logo"}
                decoding="async"
                fetchPriority="high"
              />
            </Link>
          ) : (
            <div className="h-[60px] w-[160px] rounded-xl skeleton" aria-hidden="true" />
          )}
        </div>

        <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-600">
          {(navLinks.length ? navLinks : Array.from({ length: 4 }).map((_, index) => ({ href: `placeholder-${index}`, label: "" }))).map((link, index) => {
            if (!link.label) {
              return <div key={`placeholder-link-${index}`} className="h-4 w-16 rounded skeleton" aria-hidden="true" />;
            }

            const normalizedHref = normalizeNavHref(link.href);
            const isContact = link.label.toLowerCase().includes("contact") || link.href.includes("contact");
            const className = isContact
              ? "bg-yellow-400 text-black px-6 py-2 rounded-full font-bold hover:bg-yellow-500 transition"
              : "hover:text-teal-700 transition";

            if (isExternal(normalizedHref) || isAnchor(normalizedHref)) {
              return (
                <a
                  key={link.href}
                  href={normalizedHref}
                  className={className}
                  rel={isExternal(normalizedHref) ? "noreferrer" : undefined}
                  onClick={(event) => handleContactLink(event, normalizedHref)}
                >
                  {link.label}
                </a>
              );
            }

            return (
              <Link key={link.href} to={normalizedHref} className={className}>
                {link.label}
              </Link>
            );
          })}
        </div>

        {global?.contactPhone ? (
          <div className="hidden lg:flex items-center text-gray-600 text-sm">
            <Icon name="phone" className="mr-2 text-pink-400" />
            <span>{global.contactPhone}</span>
          </div>
        ) : null}

        <button
          className="md:hidden text-2xl"
          type="button"
          aria-controls="mobile-menu"
          aria-expanded={isMobileMenuOpen}
          onClick={toggleMobileMenu}
        >
          <span className="sr-only">Toggle menu</span>
          <Icon name="bars" />
        </button>
      </nav>

      <div
        id="mobile-menu"
        className={`md:hidden ${isMobileMenuOpen ? "" : "hidden"} bg-white border-t border-gray-100 shadow-sm`}
      >
        <div className="px-6 py-4 space-y-4 text-sm font-medium text-gray-700">
          {navLinks.map((link) => {
            const normalizedHref = normalizeNavHref(link.href);
            const onClick = (event: React.MouseEvent) => {
              handleContactLink(event, normalizedHref);
              closeMobileMenu();
            };

            if (isExternal(normalizedHref) || isAnchor(normalizedHref)) {
              return (
                <a key={`mobile-${link.href}`} href={normalizedHref} className="block hover:text-teal-700 transition" onClick={onClick}>
                  {link.label}
                </a>
              );
            }

            if (isInternalRoute(normalizedHref)) {
              return (
                <Link key={`mobile-${link.href}`} to={normalizedHref} className="block hover:text-teal-700 transition" onClick={onClick}>
                  {link.label}
                </Link>
              );
            }

            return (
              <a key={`mobile-${link.href}`} href={normalizedHref} className="block hover:text-teal-700 transition" onClick={onClick}>
                {link.label}
              </a>
            );
          })}
          {global?.contactPhone ? (
            <div className="flex items-center text-gray-600 text-sm pt-2">
              <Icon name="phone" className="mr-2 text-pink-400" />
              <span>{global.contactPhone}</span>
            </div>
          ) : null}
        </div>
      </div>

      {error ? (
        <div className="border-b border-red-200 bg-red-50 px-6 py-3 text-center text-sm text-red-700">
          Unable to load navigation metadata. Page content is still available.
        </div>
      ) : null}

      <main className="flex-1">
        <Outlet />
      </main>

      <footer id="contact" className="perf-section bg-[#008282] text-white pt-16 pb-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-12">
            <div className="space-y-6">
              <div className="text-2xl font-bold flex items-center">
                {global?.footerLogo?.url ? (
                  <img
                    className="h-[60px] w-auto object-contain"
                    src={global.footerLogo.url}
                    alt={global.footerLogo.alternativeText || "Logo"}
                    loading="lazy"
                    decoding="async"
                  />
                ) : global?.logo?.url ? (
                  <img
                    className="h-[60px] w-auto object-contain"
                    src={global.logo.url}
                    alt={global.logo.alternativeText || "Logo"}
                    loading="lazy"
                    decoding="async"
                  />
                ) : null}
              </div>
              {global?.footerText ? (
                <p className="text-sm leading-relaxed opacity-90">{global.footerText}</p>
              ) : null}
              <div className="flex space-x-4 text-2xl">
                {global?.socialLinks?.map((link) => (
                  <a key={link.url} href={link.url} className="hover:text-yellow-400 transition" rel="noreferrer">
                    <Icon name={resolveSocialIcon(link.label, link.iconName)} />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-yellow-400 font-bold uppercase mb-6 tracking-wider">Contact</h4>
              <ul className="space-y-4 text-sm">
                {global?.contactPhone ? (
                  <li className="flex items-center gap-3">
                    <Icon name="phone" className="text-xs" /> {global.contactPhone}
                  </li>
                ) : null}
                {global?.contactEmail ? (
                  <li className="flex items-center gap-3">
                    <Icon name="envelope" className="text-xs" /> {global.contactEmail}
                  </li>
                ) : null}
                {global?.contactAddress ? (
                  <li className="flex items-center gap-3">
                    <Icon name="location" className="text-xs" /> {global.contactAddress}
                  </li>
                ) : null}
              </ul>
            </div>

            <div>
              <h4 className="text-yellow-400 font-bold uppercase mb-6 tracking-wider">Liens Rapide</h4>
              <ul
                className="grid gap-y-3 gap-x-8 text-sm"
                style={{ gridTemplateColumns: `repeat(${footerQuickLinksColumns}, minmax(0, 1fr))` }}
              >
                {navLinks.map((link) => {
                  const normalizedHref = normalizeNavHref(link.href);
                  if (isInternalRoute(normalizedHref)) {
                    return (
                      <li key={`footer-${link.href}`}>
                        <Link to={normalizedHref} className="hover:underline opacity-90">
                          {link.label}
                        </Link>
                      </li>
                    );
                  }

                  return (
                    <li key={`footer-${link.href}`}>
                      <a href={normalizedHref} className="hover:underline opacity-90">
                        {link.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="bg-[#006e6e] rounded-2xl p-8 border border-white/10 shadow-xl text-center">
              {global?.footerCtaTitle ? (
                <h4 className="text-yellow-400 text-xl font-bold mb-2">{global.footerCtaTitle}</h4>
              ) : null}
              {global?.footerCtaText ? <p className="text-xs mb-6 opacity-90">{global.footerCtaText}</p> : null}
              {global?.footerCtaLabel && global?.footerCtaUrl ? (
                <a
                  href={global.footerCtaUrl}
                  className="bg-[#f87171] hover:bg-[#ef4444] text-white font-bold py-3 px-10 rounded-2xl transition block shadow-lg"
                  onClick={(event) => {
                    if (global.footerCtaUrl) {
                      handleContactLink(event, global.footerCtaUrl);
                    }
                  }}
                >
                  {global.footerCtaLabel}
                </a>
              ) : null}
            </div>
          </div>

          <div className="border-t border-white/20 pt-8 text-center text-[10px] opacity-70 tracking-widest uppercase">
            © {new Date().getFullYear()} {global?.siteName ?? "CliMates Madagascar"}. Tous droits réservés.
          </div>
        </div>
      </footer>
      <ContactModal />
    </div>
  );
}

export default function Layout() {
  return (
    <ContactModalProvider>
      <LayoutContent />
    </ContactModalProvider>
  );
}
