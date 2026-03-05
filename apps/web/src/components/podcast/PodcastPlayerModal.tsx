import { useEffect } from "react";
import { resolvePlayerSource } from "./player";

type PodcastPlayerModalProps = {
  title?: string;
  url?: string | null;
  onClose: () => void;
};

export default function PodcastPlayerModal({ title, url, onClose }: PodcastPlayerModalProps) {
  const source = resolvePlayerSource(url);

  useEffect(() => {
    if (!source) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, source]);

  if (!source) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div
        className="relative w-full max-w-4xl rounded-2xl bg-slate-950 p-2 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Fermer la lecture"
          className="absolute -right-3 -top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-700 shadow-lg transition-colors hover:text-teal-700"
          onClick={onClose}
        >
          <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </button>

        <div className="aspect-video overflow-hidden rounded-xl bg-black">
          {source.type === "video" ? (
            <video className="h-full w-full" src={source.src} controls autoPlay playsInline />
          ) : (
            <iframe
              className="h-full w-full"
              src={source.src}
              title={title || "Podcast video"}
              allow="autoplay; encrypted-media; picture-in-picture; web-share"
              allowFullScreen
            />
          )}
        </div>
      </div>
    </div>
  );
}
