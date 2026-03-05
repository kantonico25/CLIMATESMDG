import { env } from "../env.js";
import {
  ProjectDTO,
  ProjectSummaryDTO,
  BlogListDTO,
  BlogPostDTO,
  BlogPostSummaryDTO,
  GlobalDTO,
  Media,
  PageDTO,
  Section,
  Seo
} from "../types.js";
import { StrapiEntity, StrapiResponse } from "./client.js";

const toAbsoluteUrl = (url?: string | null): string => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return new URL(url, env.STRAPI_URL).toString();
};

const withCacheVersion = (url: string, version?: string | null): string => {
  if (!url || !version) return url;
  try {
    const parsed = new URL(url);
    parsed.searchParams.set("v", version);
    return parsed.toString();
  } catch {
    return url;
  }
};

type StrapiMedia = {
  data: null | {
    id: number;
    attributes: {
      url: string;
      alternativeText?: string | null;
      width?: number | null;
      height?: number | null;
      mime?: string | null;
      updatedAt?: string | null;
      formats?: Record<
        string,
        {
          url?: string;
          width?: number | null;
          height?: number | null;
          mime?: string | null;
        }
      > | null;
    };
  };
};

type StrapiSeo = {
  metaTitle?: string | null;
  metaDescription?: string | null;
  ogImage?: StrapiMedia | null;
};

type StrapiNavbarLink = { label: string; href: string };

type StrapiSocialLink = { label: string; url: string; iconName?: string | null };

export type StrapiGlobal = {
  siteName: string;
  logo?: StrapiMedia | null;
  navbarLinks?: StrapiNavbarLink[];
  footerQuickLinksColumns?: number | null;
  footerText?: string | null;
  contactPhone?: string | null;
  contactEmail?: string | null;
  contactAddress?: string | null;
  footerCtaTitle?: string | null;
  footerCtaText?: string | null;
  footerCtaLabel?: string | null;
  footerCtaUrl?: string | null;
  socialLinks?: StrapiSocialLink[];
  defaultSeo?: StrapiSeo | null;
};

type StrapiHero = {
  __component: "sections.hero";
  eyebrow?: string | null;
  headline: string;
  subheadline?: string | null;
  primaryCtaLabel?: string | null;
  primaryCtaUrl?: string | null;
  secondaryCtaLabel?: string | null;
  secondaryCtaUrl?: string | null;
  image?: StrapiMedia | null;
};

type StrapiFeatureItem = {
  iconName?: string | null;
  title: string;
  description?: string | null;
};

type StrapiFeatures = {
  __component: "sections.features";
  title?: string | null;
  subtitle?: string | null;
  items?: StrapiFeatureItem[];
};

type StrapiLogos = {
  __component: "sections.logos";
  title?: string | null;
  logos?: {
    data?: Array<{
      id: number;
      attributes: {
        url: string;
        alternativeText?: string | null;
        width?: number | null;
        height?: number | null;
        mime?: string | null;
      };
    }>;
  };
};

type StrapiTestimonialItem = {
  name: string;
  role?: string | null;
  quote: string;
  avatar?: StrapiMedia | null;
};

type StrapiTestimonials = {
  __component: "sections.testimonials";
  title?: string | null;
  items?: StrapiTestimonialItem[];
};

type StrapiFaqItem = {
  question: string;
  answer: string;
};

type StrapiFaq = {
  __component: "sections.faq";
  title?: string | null;
  items?: StrapiFaqItem[];
};

type StrapiCta = {
  __component: "sections.cta";
  title?: string | null;
  text?: string | null;
  buttonLabel?: string | null;
  buttonUrl?: string | null;
};

type StrapiRichText = {
  __component: "sections.rich-text";
  title?: string | null;
  body: string;
};

type StrapiCountryTag = {
  label: string;
  isHighlighted?: boolean | null;
  url?: string | null;
};

type StrapiAbout = {
  __component: "sections.about";
  title?: string | null;
  titleAccent?: string | null;
  subtitle?: string | null;
  body?: string | null;
  quote?: string | null;
  countries?: StrapiCountryTag[];
  image?: StrapiMedia | null;
  imageCaptionTitle?: string | null;
  imageCaptionSubtitle?: string | null;
  badgeLabel?: string | null;
  badgeValue?: string | null;
  badgeSuffix?: string | null;
};

type StrapiMissionPillar = {
  iconName?: string | null;
  title?: string | null;
  description?: string | null;
  accentColor?: string | null;
  popupTitle?: string | null;
  popupContent?: string | null;
  popupTheme?: "growth" | "horizon" | "mosaic" | "blueprint" | "ripple" | "discovery" | null;
  popupBackgroundImage?: StrapiMedia | null;
  popupOverlayColor?: string | null;
};

type StrapiMissionValue = {
  iconName?: string | null;
  label?: string | null;
};

type StrapiMissionAxis = {
  order?: number | null;
  iconName?: string | null;
  title?: string | null;
  description?: string | null;
  badgeColor?: string | null;
  popupTitle?: string | null;
  popupContent?: string | null;
  popupTheme?: "growth" | "horizon" | "mosaic" | "blueprint" | "ripple" | "discovery" | null;
  popupBackgroundImage?: StrapiMedia | null;
  popupOverlayColor?: string | null;
};

type StrapiMission = {
  __component: "sections.mission";
  pillarsTitle?: string | null;
  pillarsAccent?: string | null;
  pillars?: StrapiMissionPillar[];
  valuesTitle?: string | null;
  valuesPopupTitle?: string | null;
  valuesPopupContent?: string | null;
  valuesPopupTheme?: "growth" | "horizon" | "mosaic" | "blueprint" | "ripple" | "discovery" | null;
  valuesPopupBackgroundImage?: StrapiMedia | null;
  valuesPopupOverlayColor?: string | null;
  values?: StrapiMissionValue[];
  axesTitle?: string | null;
  axes?: StrapiMissionAxis[];
};

type StrapiTeamStat = {
  value?: string | null;
  label?: string | null;
};

type StrapiTeamLocation = {
  label?: string | null;
};

type StrapiTeam = {
  __component: "sections.team";
  title?: string | null;
  stats?: StrapiTeamStat[];
  note?: string | null;
  locations?: StrapiTeamLocation[];
  textColor?: string | null;
  titleColor?: string | null;
  mutedTextColor?: string | null;
  locationTextColor?: string | null;
  statLabelColor?: string | null;
  statValueColor?: string | null;
};

type StrapiTeamMember = {
  name: string;
  role?: string | null;
  bio?: string | null;
  avatar?: StrapiMedia | null;
  email?: string | null;
  linkedinUrl?: string | null;
};

type StrapiTeamPage = {
  __component: "sections.team-page";
  eyebrow?: string | null;
  title: string;
  titleAccent?: string | null;
  intro?: string | null;
  heroCtaLabel?: string | null;
  heroCtaUrl?: string | null;
  heroImage?: StrapiMedia | null;
  heroCardEyebrow?: string | null;
  heroCardTitle?: string | null;
  heroCardText?: string | null;
  organizationTitle?: string | null;
  organizationAccent?: string | null;
  organizationSubtitle?: string | null;
  orgDirectorLabel?: string | null;
  orgDirectorTone?: "outline" | "teal" | "yellow" | "orange" | null;
  orgBranches?: Array<{
    leadLabel: string;
    leadTone?: "outline" | "teal" | "yellow" | "orange" | null;
    roles?: Array<{
      label: string;
      tone?: "outline" | "teal" | "yellow" | "orange" | null;
    }>;
  }>;
  organizationImage?: StrapiMedia | null;
  executiveTitle?: string | null;
  executiveAccent?: string | null;
  executiveSubtitle?: string | null;
  executiveMembers?: StrapiTeamMember[];
  boardTitle?: string | null;
  boardAccent?: string | null;
  boardSubtitle?: string | null;
  boardMembers?: StrapiTeamMember[];
  joinTitle?: string | null;
  joinText?: string | null;
  joinPrimaryLabel?: string | null;
  joinPrimaryUrl?: string | null;
  joinSecondaryLabel?: string | null;
  joinSecondaryUrl?: string | null;
  joinImage?: StrapiMedia | null;
};

type StrapiTimelineNote = {
  text?: string | null;
};

type StrapiTimelineItem = {
  period?: string | null;
  title?: string | null;
  subtitle?: string | null;
  description?: string | null;
  impactTitle?: string | null;
  impactText?: string | null;
  extraNotes?: StrapiTimelineNote[];
  side?: "left" | "right" | null;
  markerColor?: string | null;
};

type StrapiProjects = {
  __component: "sections.projects";
  title?: string | null;
  items?: StrapiTimelineItem[];
};

type StrapiGalleryItem = {
  title?: string | null;
  tag?: string | null;
  tagColor?: string | null;
  description?: string | null;
  image?: StrapiMedia | null;
};

type StrapiGallery = {
  __component: "sections.gallery";
  title?: string | null;
  limit?: number | null;
  items?: StrapiGalleryItem[];
};

type StrapiProjectGalleryFilter = {
  label: string;
  value: string;
};

type StrapiProjectGallery = {
  __component: "sections.project-gallery";
  eyebrow?: string | null;
  title: string;
  titleAccent?: string | null;
  description?: string | null;
  backgroundImage?: StrapiMedia | null;
  filters?: StrapiProjectGalleryFilter[];
  limit?: number | null;
  initialVisible?: number | null;
  loadMoreLabel?: string | null;
  emptyStateText?: string | null;
};

type StrapiArticles = {
  __component: "sections.articles";
  title?: string | null;
  subtitle?: string | null;
  limit?: number | null;
  categorySlug?: string | null;
  tagSlug?: string | null;
  buttonLabel?: string | null;
  buttonUrl?: string | null;
};

type StrapiPodcastItem = {
  episodeLabel?: string | null;
  publishedAtLabel?: string | null;
  duration?: string | null;
  title: string;
  description?: string | null;
  guestLabel?: string | null;
  listenLabel?: string | null;
  listenUrl?: string | null;
  mediaFile?: StrapiMedia | null;
  coverImage?: StrapiMedia | null;
};

type StrapiPodcast = {
  __component: "sections.podcast";
  title?: string | null;
  titleAccent?: string | null;
  subtitle?: string | null;
  buttonLabel?: string | null;
  buttonUrl?: string | null;
  items?: StrapiPodcastItem[];
};

type StrapiContactItem = {
  iconName?: string | null;
  value?: string | null;
};

type StrapiContact = {
  __component: "sections.contact";
  eyebrow?: string | null;
  title?: string | null;
  subtitle?: string | null;
  infoTitle?: string | null;
  infoText?: string | null;
  contacts?: StrapiContactItem[];
  formTitle?: string | null;
  submitLabel?: string | null;
  successMessage?: string | null;
  buttonLabel?: string | null;
  buttonUrl?: string | null;
};

type StrapiCarbonPredictor = {
  __component: "sections.carbon-predictor";
  title?: string | null;
  subtitle?: string | null;
  loadingTitle?: string | null;
  loadingSubtitle?: string | null;
  resultTitle?: string | null;
  resultSubtitle?: string | null;
  buttonLabel?: string | null;
};

type StrapiCarbonCta = {
  __component: "sections.carbon-cta";
  title?: string | null;
  subtitle?: string | null;
  buttonLabel?: string | null;
  buttonUrl?: string | null;
};

type StrapiProjectStat = {
  value: string;
  label: string;
};

type StrapiProject = {
  title: string;
  slug: string;
  category?: string | null;
  statusLabel?: string | null;
  statusTone?: "yellow" | "light" | "teal" | null;
  year?: string | null;
  excerpt?: string | null;
  summary?: string | null;
  body?: string | null;
  coverImage?: StrapiMedia | null;
  gallery?: {
    data?: Array<{
      id: number;
      attributes: {
        url: string;
        alternativeText?: string | null;
        width?: number | null;
        height?: number | null;
        mime?: string | null;
      };
    }>;
  };
  stats?: StrapiProjectStat[];
  isFeatured?: boolean | null;
};

type StrapiSection =
  | StrapiHero
  | StrapiFeatures
  | StrapiLogos
  | StrapiTestimonials
  | StrapiFaq
  | StrapiCta
  | StrapiRichText
  | StrapiAbout
  | StrapiMission
  | StrapiTeam
  | StrapiTeamPage
  | StrapiProjects
  | StrapiGallery
  | StrapiProjectGallery
  | StrapiArticles
  | StrapiPodcast
  | StrapiContact
  | StrapiCarbonPredictor
  | StrapiCarbonCta;

type StrapiPage = {
  title: string;
  slug: string;
  seo?: StrapiSeo | null;
  sections?: StrapiSection[];
};

type StrapiCategory = { name: string; slug: string };

type StrapiTag = { name: string; slug: string };

type StrapiBlogPost = {
  title: string;
  slug: string;
  excerpt?: string | null;
  coverImage?: StrapiMedia | null;
  authorName?: string | null;
  authorRole?: string | null;
  authorBio?: string | null;
  publishedAt?: string | null;
  quoteText?: string | null;
  quoteSource?: string | null;
  highlightLabel?: string | null;
  highlightTitle?: string | null;
  highlightDescription?: string | null;
  impactMetricLabel?: string | null;
  impactMetricValue?: string | null;
  impactMetricSuffix?: string | null;
  impactMetricDescription?: string | null;
  body: string;
  categories?: { data: Array<StrapiEntity<StrapiCategory>> };
  tags?: { data: Array<StrapiEntity<StrapiTag>> };
};

const unwrapAttributes = <T>(entity: unknown): T | null => {
  if (!entity || typeof entity !== "object") return null;
  const anyEntity = entity as { attributes?: T };
  return anyEntity.attributes ?? (entity as T);
};

const normalizeRelationList = <T>(relation: unknown): T[] => {
  if (!relation) return [];
  const anyRelation = relation as { data?: T[] };
  if (Array.isArray(anyRelation.data)) return anyRelation.data;
  if (Array.isArray(relation)) return relation as T[];
  return [];
};

const toMedia = (media?: StrapiMedia | null): Media | null => {
  if (!media) return null;
  const mediaEntity = (media as { data?: unknown }).data ?? media;
  const attributes = unwrapAttributes<{
    url?: string;
    alternativeText?: string | null;
    width?: number | null;
    height?: number | null;
    mime?: string | null;
    updatedAt?: string | null;
    formats?: Record<
      string,
      {
        url?: string;
        width?: number | null;
        height?: number | null;
        mime?: string | null;
      }
    > | null;
  }>(mediaEntity);
  if (!attributes?.url) return null;
  const normalizedFormats = attributes.formats
    ? Object.entries(attributes.formats).reduce<NonNullable<Media["formats"]>>((acc, [key, format]) => {
        if (!format?.url) return acc;
        const absoluteUrl = toAbsoluteUrl(format.url);
        acc[key] = {
          url: withCacheVersion(absoluteUrl, attributes.updatedAt ?? null),
          width: format.width ?? null,
          height: format.height ?? null,
          mime: format.mime ?? null
        };
        return acc;
      }, {})
    : null;

  const absoluteUrl = toAbsoluteUrl(attributes.url);
  return {
    url: withCacheVersion(absoluteUrl, attributes.updatedAt ?? null),
    alternativeText: attributes.alternativeText ?? null,
    width: attributes.width ?? null,
    height: attributes.height ?? null,
    mime: attributes.mime ?? null,
    formats: normalizedFormats
  };
};

const toSeo = (seo?: StrapiSeo | null): Seo | null => {
  if (!seo) return null;
  return {
    metaTitle: seo.metaTitle ?? null,
    metaDescription: seo.metaDescription ?? null,
    ogImage: toMedia(seo.ogImage ?? null)
  };
};

export function toGlobalDTO(response: StrapiResponse<StrapiEntity<StrapiGlobal>>): GlobalDTO {
  const attributes = unwrapAttributes<StrapiGlobal>(response.data);
  if (!attributes) {
    return {
      siteName: "",
      navbarLinks: [],
      socialLinks: []
    };
  }

    return {
      siteName: attributes.siteName,
      logo: toMedia(attributes.logo ?? null),
      footerLogo: toMedia((attributes as { footerLogo?: StrapiMedia | null }).footerLogo ?? null),
      navbarLinks: attributes.navbarLinks ?? [],
    footerQuickLinksColumns: attributes.footerQuickLinksColumns ?? 2,
    footerText: attributes.footerText ?? null,
    contactPhone: attributes.contactPhone ?? null,
    contactEmail: attributes.contactEmail ?? null,
    contactAddress: attributes.contactAddress ?? null,
    footerCtaTitle: attributes.footerCtaTitle ?? null,
    footerCtaText: attributes.footerCtaText ?? null,
    footerCtaLabel: attributes.footerCtaLabel ?? null,
    footerCtaUrl: attributes.footerCtaUrl ?? null,
    socialLinks: (attributes.socialLinks ?? []).map((link) => ({
      label: link.label,
      url: link.url,
      iconName: link.iconName ?? null
    })),
    defaultSeo: toSeo(attributes.defaultSeo ?? null)
  };
}

const toSection = (section: StrapiSection): Section | null => {
  switch (section.__component) {
    case "sections.hero":
      return {
        type: "hero",
        eyebrow: section.eyebrow ?? null,
        headline: section.headline,
        subheadline: section.subheadline ?? null,
        primaryCtaLabel: section.primaryCtaLabel ?? null,
        primaryCtaUrl: section.primaryCtaUrl ?? null,
        secondaryCtaLabel: section.secondaryCtaLabel ?? null,
        secondaryCtaUrl: section.secondaryCtaUrl ?? null,
        image: toMedia(section.image ?? null)
      };
    case "sections.features":
      return {
        type: "features",
        title: section.title ?? null,
        subtitle: section.subtitle ?? null,
        items: (section.items ?? []).map((item) => ({
          iconName: item.iconName ?? null,
          title: item.title,
          description: item.description ?? null
        }))
      };
      case "sections.logos":
        return {
          type: "logos",
          title: section.title ?? null,
          logos: normalizeRelationList(section.logos)
            .map((logo) => {
              const attributes = unwrapAttributes<{
                url?: string;
                alternativeText?: string | null;
                width?: number | null;
                height?: number | null;
                mime?: string | null;
              }>(logo);
              if (!attributes?.url) return null;
              return {
                url: toAbsoluteUrl(attributes.url),
                alternativeText: attributes.alternativeText ?? null,
                width: attributes.width ?? null,
                height: attributes.height ?? null,
                mime: attributes.mime ?? null
              };
            })
            .filter((logo): logo is NonNullable<typeof logo> => logo !== null)
        };
    case "sections.testimonials":
      return {
        type: "testimonials",
        title: section.title ?? null,
        items: (section.items ?? []).map((item) => ({
          name: item.name,
          role: item.role ?? null,
          quote: item.quote,
          avatar: toMedia(item.avatar ?? null)
        }))
      };
    case "sections.faq":
      return {
        type: "faq",
        title: section.title ?? null,
        items: (section.items ?? []).map((item) => ({
          question: item.question,
          answer: item.answer
        }))
      };
    case "sections.cta":
      return {
        type: "cta",
        title: section.title ?? null,
        text: section.text ?? null,
        buttonLabel: section.buttonLabel ?? null,
        buttonUrl: section.buttonUrl ?? null
      };
    case "sections.rich-text":
      return {
        type: "richText",
        title: section.title ?? null,
        body: section.body
      };
    case "sections.about":
      return {
        type: "about",
        title: section.title ?? null,
        titleAccent: section.titleAccent ?? null,
        subtitle: section.subtitle ?? null,
        body: section.body ?? null,
        quote: section.quote ?? null,
        countries: (section.countries ?? []).map((country) => ({
          label: country.label,
          isHighlighted: country.isHighlighted ?? null,
          url: country.url ?? null
        })),
        image: toMedia(section.image ?? null),
        imageCaptionTitle: section.imageCaptionTitle ?? null,
        imageCaptionSubtitle: section.imageCaptionSubtitle ?? null,
        badgeLabel: section.badgeLabel ?? null,
        badgeValue: section.badgeValue ?? null,
        badgeSuffix: section.badgeSuffix ?? null
      };
    case "sections.mission":
      return {
        type: "mission",
        pillarsTitle: section.pillarsTitle ?? null,
        pillarsAccent: section.pillarsAccent ?? null,
        pillars: (section.pillars ?? []).map((pillar) => ({
          iconName: pillar.iconName ?? null,
          title: pillar.title ?? null,
          description: pillar.description ?? null,
          accentColor: pillar.accentColor ?? null,
          popupTitle: pillar.popupTitle ?? null,
          popupContent: pillar.popupContent ?? null,
          popupTheme: pillar.popupTheme ?? null,
          popupBackgroundImage: toMedia(pillar.popupBackgroundImage ?? null),
          popupOverlayColor: pillar.popupOverlayColor ?? null
        })),
        valuesTitle: section.valuesTitle ?? null,
        valuesPopupTitle: section.valuesPopupTitle ?? null,
        valuesPopupContent: section.valuesPopupContent ?? null,
        valuesPopupTheme: section.valuesPopupTheme ?? null,
        valuesPopupBackgroundImage: toMedia(section.valuesPopupBackgroundImage ?? null),
        valuesPopupOverlayColor: section.valuesPopupOverlayColor ?? null,
        values: (section.values ?? []).map((value) => ({
          iconName: value.iconName ?? null,
          label: value.label ?? null
        })),
        axesTitle: section.axesTitle ?? null,
        axes: (section.axes ?? []).map((axis) => ({
          order: axis.order ?? null,
          iconName: axis.iconName ?? null,
          title: axis.title ?? null,
          description: axis.description ?? null,
          badgeColor: axis.badgeColor ?? null,
          popupTitle: axis.popupTitle ?? null,
          popupContent: axis.popupContent ?? null,
          popupTheme: axis.popupTheme ?? null,
          popupBackgroundImage: toMedia(axis.popupBackgroundImage ?? null),
          popupOverlayColor: axis.popupOverlayColor ?? null
        }))
      };
    case "sections.team":
      return {
        type: "team",
        title: section.title ?? null,
        stats: (section.stats ?? []).map((stat) => ({
          value: stat.value ?? null,
          label: stat.label ?? null
        })),
        note: section.note ?? null,
        locations: (section.locations ?? []).map((location) => ({
          label: location.label ?? null
        })),
        textColor: section.textColor ?? null,
        titleColor: section.titleColor ?? null,
        mutedTextColor: section.mutedTextColor ?? null,
        locationTextColor: section.locationTextColor ?? null,
        statLabelColor: section.statLabelColor ?? null,
        statValueColor: section.statValueColor ?? null
      };
    case "sections.team-page":
      return {
        type: "teamPage",
        eyebrow: section.eyebrow ?? null,
        title: section.title,
        titleAccent: section.titleAccent ?? null,
        intro: section.intro ?? null,
        heroCtaLabel: section.heroCtaLabel ?? null,
        heroCtaUrl: section.heroCtaUrl ?? null,
        heroImage: toMedia(section.heroImage ?? null),
        heroCardEyebrow: section.heroCardEyebrow ?? null,
        heroCardTitle: section.heroCardTitle ?? null,
        heroCardText: section.heroCardText ?? null,
        organizationTitle: section.organizationTitle ?? null,
        organizationAccent: section.organizationAccent ?? null,
        organizationSubtitle: section.organizationSubtitle ?? null,
        orgDirectorLabel: section.orgDirectorLabel ?? null,
        orgDirectorTone: section.orgDirectorTone ?? null,
        orgBranches: (section.orgBranches ?? []).map((branch) => ({
          leadLabel: branch.leadLabel,
          leadTone: branch.leadTone ?? null,
          roles: (branch.roles ?? []).map((role) => ({
            label: role.label,
            tone: role.tone ?? null
          }))
        })),
        organizationImage: toMedia(section.organizationImage ?? null),
        executiveTitle: section.executiveTitle ?? null,
        executiveAccent: section.executiveAccent ?? null,
        executiveSubtitle: section.executiveSubtitle ?? null,
        executiveMembers: (section.executiveMembers ?? []).map((member) => ({
          name: member.name,
          role: member.role ?? null,
          bio: member.bio ?? null,
          avatar: toMedia(member.avatar ?? null),
          email: member.email ?? null,
          linkedinUrl: member.linkedinUrl ?? null
        })),
        boardTitle: section.boardTitle ?? null,
        boardAccent: section.boardAccent ?? null,
        boardSubtitle: section.boardSubtitle ?? null,
        boardMembers: (section.boardMembers ?? []).map((member) => ({
          name: member.name,
          role: member.role ?? null,
          bio: member.bio ?? null,
          avatar: toMedia(member.avatar ?? null),
          email: member.email ?? null,
          linkedinUrl: member.linkedinUrl ?? null
        })),
        joinTitle: section.joinTitle ?? null,
        joinText: section.joinText ?? null,
        joinPrimaryLabel: section.joinPrimaryLabel ?? null,
        joinPrimaryUrl: section.joinPrimaryUrl ?? null,
        joinSecondaryLabel: section.joinSecondaryLabel ?? null,
        joinSecondaryUrl: section.joinSecondaryUrl ?? null,
        joinImage: toMedia(section.joinImage ?? null)
      };
    case "sections.projects":
      return {
        type: "projects",
        title: section.title ?? null,
        items: (section.items ?? []).map((item) => ({
          period: item.period ?? null,
          title: item.title ?? null,
          subtitle: item.subtitle ?? null,
          description: item.description ?? null,
          impactTitle: item.impactTitle ?? null,
          impactText: item.impactText ?? null,
          extraNotes: (item.extraNotes ?? []).map((note) => ({
            text: note.text ?? null
          })),
          side: item.side ?? null,
          markerColor: item.markerColor ?? null
        }))
      };
    case "sections.gallery":
      return {
        type: "gallery",
        title: section.title ?? null,
        limit: section.limit ?? null,
        items: (section.items ?? []).map((item) => ({
          title: item.title ?? null,
          tag: item.tag ?? null,
          tagColor: item.tagColor ?? null,
          description: item.description ?? null,
          image: toMedia(item.image ?? null)
        }))
      };
    case "sections.project-gallery":
      return {
        type: "projectGallery",
        eyebrow: section.eyebrow ?? null,
        title: section.title,
        titleAccent: section.titleAccent ?? null,
        description: section.description ?? null,
        backgroundImage: toMedia(section.backgroundImage ?? null),
        filters: (section.filters ?? []).map((filter) => ({
          label: filter.label,
          value: filter.value
        })),
        limit: section.limit ?? null,
        initialVisible: section.initialVisible ?? null,
        loadMoreLabel: section.loadMoreLabel ?? null,
        emptyStateText: section.emptyStateText ?? null
      };
    case "sections.articles":
      return {
        type: "articles",
        title: section.title ?? null,
        subtitle: section.subtitle ?? null,
        limit: section.limit ?? null,
        categorySlug: section.categorySlug ?? null,
        tagSlug: section.tagSlug ?? null,
        buttonLabel: section.buttonLabel ?? null,
        buttonUrl: section.buttonUrl ?? null
      };
    case "sections.podcast":
      return {
        type: "podcast",
        title: section.title ?? null,
        titleAccent: section.titleAccent ?? null,
        subtitle: section.subtitle ?? null,
        buttonLabel: section.buttonLabel ?? null,
        buttonUrl: section.buttonUrl ?? null,
        items: (section.items ?? []).map((item) => ({
          episodeLabel: item.episodeLabel ?? null,
          publishedAtLabel: item.publishedAtLabel ?? null,
          duration: item.duration ?? null,
          title: item.title,
          description: item.description ?? null,
          guestLabel: item.guestLabel ?? null,
          listenLabel: item.listenLabel ?? null,
          listenUrl: item.listenUrl ?? null,
          mediaFile: toMedia(item.mediaFile ?? null),
          coverImage: toMedia(item.coverImage ?? null)
        }))
      };
    case "sections.contact":
      return {
        type: "contact",
        eyebrow: section.eyebrow ?? null,
        title: section.title ?? null,
        subtitle: section.subtitle ?? null,
        infoTitle: section.infoTitle ?? null,
        infoText: section.infoText ?? null,
        contacts: (section.contacts ?? []).map((item) => ({
          iconName: item.iconName ?? null,
          value: item.value ?? null
        })),
        formTitle: section.formTitle ?? null,
        submitLabel: section.submitLabel ?? null,
        successMessage: section.successMessage ?? null,
        buttonLabel: section.buttonLabel ?? null,
        buttonUrl: section.buttonUrl ?? null
      };
    case "sections.carbon-predictor":
      return {
        type: "carbonPredictor",
        title: section.title ?? null,
        subtitle: section.subtitle ?? null,
        loadingTitle: section.loadingTitle ?? null,
        loadingSubtitle: section.loadingSubtitle ?? null,
        resultTitle: section.resultTitle ?? null,
        resultSubtitle: section.resultSubtitle ?? null,
        buttonLabel: section.buttonLabel ?? null
      };
    case "sections.carbon-cta":
      return {
        type: "carbonCta",
        title: section.title ?? null,
        subtitle: section.subtitle ?? null,
        buttonLabel: section.buttonLabel ?? null,
        buttonUrl: section.buttonUrl ?? null
      };
    default:
      return null;
  }
};

export function toPageDTO(response: StrapiResponse<Array<StrapiEntity<StrapiPage>>>): PageDTO | null {
  const list = Array.isArray(response.data) ? response.data : response.data ? [response.data] : [];
  const entity = list[0];
  const attributes = unwrapAttributes<StrapiPage>(entity);
  if (!attributes) return null;
  const sections = (attributes.sections ?? [])
    .map((section) => toSection(section as StrapiSection))
    .filter((section): section is Section => section !== null);

  return {
    title: attributes.title,
    slug: attributes.slug,
    seo: toSeo(attributes.seo ?? null),
    sections
  };
}

const toCategory = (entity: StrapiEntity<StrapiCategory>) => {
  const attributes = unwrapAttributes<StrapiCategory>(entity);
  return {
    name: attributes?.name ?? "",
    slug: attributes?.slug ?? ""
  };
};

const toTag = (entity: StrapiEntity<StrapiTag>) => {
  const attributes = unwrapAttributes<StrapiTag>(entity);
  return {
    name: attributes?.name ?? "",
    slug: attributes?.slug ?? ""
  };
};

const toBlogPost = (entity: StrapiEntity<StrapiBlogPost>): BlogPostDTO => {
  const attributes = unwrapAttributes<StrapiBlogPost>(entity);
  return {
    title: attributes?.title ?? "",
    slug: attributes?.slug ?? "",
    excerpt: attributes?.excerpt ?? null,
    coverImage: toMedia(attributes?.coverImage ?? null),
    authorName: attributes?.authorName ?? null,
    authorRole: attributes?.authorRole ?? null,
    authorBio: attributes?.authorBio ?? null,
    publishedAt: attributes?.publishedAt ?? null,
    quoteText: attributes?.quoteText ?? null,
    quoteSource: attributes?.quoteSource ?? null,
    highlightLabel: attributes?.highlightLabel ?? null,
    highlightTitle: attributes?.highlightTitle ?? null,
    highlightDescription: attributes?.highlightDescription ?? null,
    impactMetricLabel: attributes?.impactMetricLabel ?? null,
    impactMetricValue: attributes?.impactMetricValue ?? null,
    impactMetricSuffix: attributes?.impactMetricSuffix ?? null,
    impactMetricDescription: attributes?.impactMetricDescription ?? null,
    body: attributes?.body ?? "",
    categories: normalizeRelationList<StrapiEntity<StrapiCategory>>(attributes?.categories).map(toCategory),
    tags: normalizeRelationList<StrapiEntity<StrapiTag>>(attributes?.tags).map(toTag)
  };
};

const toBlogPostSummary = (
  entity: StrapiEntity<StrapiBlogPost>
): BlogPostSummaryDTO => {
  const { body, ...summary } = toBlogPost(entity);
  return summary;
};

export function toBlogListDTO(
  response: StrapiResponse<Array<StrapiEntity<StrapiBlogPost>>>
): BlogListDTO {
  const list = Array.isArray(response.data) ? response.data : response.data ? [response.data] : [];
  const items: BlogPostSummaryDTO[] = list.map((entity) => toBlogPostSummary(entity));
  return {
    items,
    pagination: response.meta.pagination ?? {
      page: 1,
      pageSize: items.length,
      pageCount: 1,
      total: items.length
    }
  };
}

export function toBlogPostDTO(
  response: StrapiResponse<Array<StrapiEntity<StrapiBlogPost>>>
): BlogPostDTO | null {
  const list = Array.isArray(response.data) ? response.data : response.data ? [response.data] : [];
  const entity = list[0];
  return entity ? toBlogPost(entity) : null;
}

const toProjectSummary = (entity: StrapiEntity<StrapiProject>): ProjectSummaryDTO => {
  const attributes = unwrapAttributes<StrapiProject>(entity);
  return {
    title: attributes?.title ?? "",
    slug: attributes?.slug ?? "",
    category: attributes?.category ?? null,
    statusLabel: attributes?.statusLabel ?? null,
    statusTone: attributes?.statusTone ?? null,
    year: attributes?.year ?? null,
    excerpt: attributes?.excerpt ?? null,
    coverImage: toMedia(attributes?.coverImage ?? null),
    isFeatured: attributes?.isFeatured ?? null
  };
};

export function toProjectListDTO(
  response: StrapiResponse<Array<StrapiEntity<StrapiProject>>>
): ProjectSummaryDTO[] {
  const list = Array.isArray(response.data) ? response.data : response.data ? [response.data] : [];
  return list.map((entity) => toProjectSummary(entity));
}

export function toProjectDTO(
  response: StrapiResponse<Array<StrapiEntity<StrapiProject>>>
): ProjectDTO | null {
  const list = Array.isArray(response.data) ? response.data : response.data ? [response.data] : [];
  const entity = list[0];
  const summary = entity ? toProjectSummary(entity) : null;
  if (!summary) return null;
  const attributes = unwrapAttributes<StrapiProject>(entity);

  const gallery = normalizeRelationList(attributes?.gallery)
    .map((image) => toMedia(image as unknown as StrapiMedia))
    .filter((image): image is NonNullable<typeof image> => image !== null);

  return {
    ...summary,
    summary: attributes?.summary ?? null,
    body: attributes?.body ?? null,
    gallery,
    stats: (attributes?.stats ?? []).map((stat) => ({
      value: stat.value,
      label: stat.label
    }))
  };
}

