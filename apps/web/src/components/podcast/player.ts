export type PlayerSource =
  | { type: "video"; src: string }
  | { type: "iframe"; src: string };

const VIDEO_EXTENSIONS = [".mp4", ".webm", ".ogg", ".mov", ".m4v"];

const isVideoFile = (url: string) => {
  const loweredPath = url.split("?")[0]?.toLowerCase() ?? "";
  return VIDEO_EXTENSIONS.some((extension) => loweredPath.endsWith(extension));
};

const extractYouTubeId = (url: URL) => {
  if (url.hostname.includes("youtu.be")) {
    return url.pathname.replace("/", "").trim();
  }

  if (url.hostname.includes("youtube.com")) {
    if (url.pathname.startsWith("/shorts/")) {
      return url.pathname.replace("/shorts/", "").split("/")[0];
    }

    const videoId = url.searchParams.get("v");
    if (videoId) return videoId;

    if (url.pathname.startsWith("/embed/")) {
      return url.pathname.replace("/embed/", "").split("/")[0];
    }
  }

  return "";
};

const extractVimeoId = (url: URL) => {
  if (!url.hostname.includes("vimeo.com")) return "";
  const parts = url.pathname.split("/").filter(Boolean);
  return parts[parts.length - 1] ?? "";
};

export const resolvePlayerSource = (rawUrl?: string | null): PlayerSource | null => {
  if (!rawUrl || rawUrl === "#") return null;

  try {
    const url = new URL(rawUrl, window.location.origin);
    const href = url.href;

    if (isVideoFile(href)) {
      return { type: "video", src: href };
    }

    const youtubeId = extractYouTubeId(url);
    if (youtubeId) {
      return { type: "iframe", src: `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0` };
    }

    const vimeoId = extractVimeoId(url);
    if (vimeoId) {
      return { type: "iframe", src: `https://player.vimeo.com/video/${vimeoId}?autoplay=1` };
    }

    if (url.pathname.includes("/embed/")) {
      return { type: "iframe", src: href };
    }

    return { type: "iframe", src: href };
  } catch {
    return null;
  }
};
