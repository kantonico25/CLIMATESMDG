import type { Media } from "../../api/types";

type MediaFormat = NonNullable<Media["formats"]>[string];

const PREFERRED_ORDER = ["xlarge", "large", "medium", "small", "xsmall", "thumbnail"] as const;
const HD_MAX_WIDTH = 1920;

const toSortedFormats = (media?: Media | null): MediaFormat[] => {
  if (!media?.formats) return [];
  return Object.values(media.formats)
    .filter((format): format is MediaFormat => Boolean(format?.url))
    .sort((a, b) => (a.width ?? Number.MAX_SAFE_INTEGER) - (b.width ?? Number.MAX_SAFE_INTEGER));
};

const getOriginalCandidate = (media?: Media | null): MediaFormat | null => {
  if (!media?.url || !media.width) return null;
  return {
    url: media.url,
    width: media.width,
    height: media.height ?? undefined
  };
};

export const getMediaUrl = (media?: Media | null, preferredKeys: string[] = []): string | null => {
  if (!media) return null;

  const preferredFormats = toSortedFormats(media);
  const original = getOriginalCandidate(media);
  const hdFormats = preferredFormats.filter((format) => (format.width ?? Number.MAX_SAFE_INTEGER) <= HD_MAX_WIDTH);
  const smallestAboveHd = preferredFormats.find(
    (format) => (format.width ?? Number.MAX_SAFE_INTEGER) > HD_MAX_WIDTH
  );

  for (const key of preferredKeys) {
    const candidate = media.formats?.[key];
    if (candidate?.url && (candidate.width ?? Number.MAX_SAFE_INTEGER) <= HD_MAX_WIDTH) return candidate.url;
  }

  for (const key of PREFERRED_ORDER.filter((formatKey) => formatKey !== "thumbnail")) {
    const candidate = media.formats?.[key];
    if (candidate?.url && (candidate.width ?? Number.MAX_SAFE_INTEGER) <= HD_MAX_WIDTH) return candidate.url;
  }

  if (original?.url && (original.width ?? Number.MAX_SAFE_INTEGER) <= HD_MAX_WIDTH) {
    return original.url;
  }

  if (hdFormats.length > 0) {
    return hdFormats[hdFormats.length - 1]?.url ?? null;
  }

  const thumbnail = media.formats?.thumbnail;
  if (thumbnail?.url && (thumbnail.width ?? Number.MAX_SAFE_INTEGER) <= HD_MAX_WIDTH) {
    return thumbnail.url;
  }

  if (smallestAboveHd?.url) {
    return smallestAboveHd.url;
  }

  return media.url || null;
};

export const getMediaSrcSet = (media?: Media | null): string | undefined => {
  const formats = toSortedFormats(media);
  const original = getOriginalCandidate(media);
  const allCandidates = original ? [...formats, original] : formats;
  const uniqueByWidth = new Map<number, MediaFormat>();

  for (const candidate of allCandidates) {
    if (typeof candidate.width !== "number") continue;
    if (candidate.width > HD_MAX_WIDTH) continue;
    const existing = uniqueByWidth.get(candidate.width);
    if (!existing) {
      uniqueByWidth.set(candidate.width, candidate);
    }
  }

  const sortedCandidates = Array.from(uniqueByWidth.values()).sort(
    (a, b) => (a.width ?? Number.MAX_SAFE_INTEGER) - (b.width ?? Number.MAX_SAFE_INTEGER)
  );
  if (sortedCandidates.length === 0) {
    const smallestAboveHd = [...formats, ...(original ? [original] : [])]
      .filter((candidate): candidate is MediaFormat => Boolean(candidate?.url && candidate.width))
      .sort((a, b) => (a.width ?? Number.MAX_SAFE_INTEGER) - (b.width ?? Number.MAX_SAFE_INTEGER))[0];
    if (!smallestAboveHd?.url || !smallestAboveHd.width) return undefined;
    return `${smallestAboveHd.url} ${smallestAboveHd.width}w`;
  }

  const srcSet = sortedCandidates
    .map((format) => `${format.url} ${format.width}w`)
    .join(", ");

  return srcSet || undefined;
};
