export type Media = {
  url: string;
  alternativeText?: string | null;
  width?: number | null;
  height?: number | null;
  mime?: string | null;
  formats?: Record<
    string,
    {
      url: string;
      width?: number | null;
      height?: number | null;
      mime?: string | null;
    }
  > | null;
};

export type Seo = {
  metaTitle?: string | null;
  metaDescription?: string | null;
  ogImage?: Media | null;
};

export type GlobalDTO = {
  siteName: string;
  logo?: Media | null;
  footerLogo?: Media | null;
  navbarLinks: Array<{ label: string; href: string }>;
  footerQuickLinksColumns?: number | null;
  footerText?: string | null;
  contactPhone?: string | null;
  contactEmail?: string | null;
  contactAddress?: string | null;
  footerCtaTitle?: string | null;
  footerCtaText?: string | null;
  footerCtaLabel?: string | null;
  footerCtaUrl?: string | null;
  socialLinks: Array<{ label: string; url: string; iconName?: string | null }>;
  defaultSeo?: Seo | null;
};

export type HeroSection = {
  type: "hero";
  eyebrow?: string | null;
  headline: string;
  subheadline?: string | null;
  primaryCtaLabel?: string | null;
  primaryCtaUrl?: string | null;
  secondaryCtaLabel?: string | null;
  secondaryCtaUrl?: string | null;
  image?: Media | null;
};

export type FeaturesSection = {
  type: "features";
  title?: string | null;
  subtitle?: string | null;
  items: Array<{ iconName?: string | null; title: string; description?: string | null }>;
};

export type LogosSection = {
  type: "logos";
  title?: string | null;
  logos: Media[];
};

export type TestimonialsSection = {
  type: "testimonials";
  title?: string | null;
  items: Array<{ name: string; role?: string | null; quote: string; avatar?: Media | null }>;
};

export type FaqSection = {
  type: "faq";
  title?: string | null;
  items: Array<{ question: string; answer: string }>;
};

export type CtaSection = {
  type: "cta";
  title?: string | null;
  text?: string | null;
  buttonLabel?: string | null;
  buttonUrl?: string | null;
};

export type RichTextSection = {
  type: "richText";
  title?: string | null;
  body: string;
};

export type AboutSection = {
  type: "about";
  title?: string | null;
  titleAccent?: string | null;
  subtitle?: string | null;
  body?: string | null;
  quote?: string | null;
  countries: Array<{ label: string; isHighlighted?: boolean | null; url?: string | null }>;
  image?: Media | null;
  imageCaptionTitle?: string | null;
  imageCaptionSubtitle?: string | null;
  badgeLabel?: string | null;
  badgeValue?: string | null;
  badgeSuffix?: string | null;
};

export type MissionSection = {
  type: "mission";
  pillarsTitle?: string | null;
  pillarsAccent?: string | null;
  pillars: Array<{
    iconName?: string | null;
    title?: string | null;
    description?: string | null;
    accentColor?: string | null;
    popupTitle?: string | null;
    popupContent?: string | null;
    popupTheme?: "growth" | "horizon" | "mosaic" | "blueprint" | "ripple" | "discovery" | null;
    popupBackgroundImage?: Media | null;
    popupOverlayColor?: string | null;
  }>;
  valuesTitle?: string | null;
  valuesPopupTitle?: string | null;
  valuesPopupContent?: string | null;
  valuesPopupTheme?: "growth" | "horizon" | "mosaic" | "blueprint" | "ripple" | "discovery" | null;
  valuesPopupBackgroundImage?: Media | null;
  valuesPopupOverlayColor?: string | null;
  values: Array<{ iconName?: string | null; label?: string | null }>;
  axesTitle?: string | null;
  axes: Array<{
    order?: number | null;
    iconName?: string | null;
    title?: string | null;
    description?: string | null;
    badgeColor?: string | null;
    popupTitle?: string | null;
    popupContent?: string | null;
    popupTheme?: "growth" | "horizon" | "mosaic" | "blueprint" | "ripple" | "discovery" | null;
    popupBackgroundImage?: Media | null;
    popupOverlayColor?: string | null;
  }>;
};

export type TeamSection = {
  type: "team";
  title?: string | null;
  stats: Array<{ value?: string | null; label?: string | null }>;
  note?: string | null;
  locations: Array<{ label?: string | null }>;
  textColor?: string | null;
  titleColor?: string | null;
  mutedTextColor?: string | null;
  locationTextColor?: string | null;
  statLabelColor?: string | null;
  statValueColor?: string | null;
};

export type TeamPageSection = {
  type: "teamPage";
  eyebrow?: string | null;
  title: string;
  titleAccent?: string | null;
  intro?: string | null;
  heroCtaLabel?: string | null;
  heroCtaUrl?: string | null;
  heroImage?: Media | null;
  heroCardEyebrow?: string | null;
  heroCardTitle?: string | null;
  heroCardText?: string | null;
  organizationTitle?: string | null;
  organizationAccent?: string | null;
  organizationSubtitle?: string | null;
  orgDirectorLabel?: string | null;
  orgDirectorTone?: "outline" | "teal" | "yellow" | "orange" | null;
  orgBranches: Array<{
    leadLabel: string;
    leadTone?: "outline" | "teal" | "yellow" | "orange" | null;
    roles: Array<{
      label: string;
      tone?: "outline" | "teal" | "yellow" | "orange" | null;
    }>;
  }>;
  organizationImage?: Media | null;
  executiveTitle?: string | null;
  executiveAccent?: string | null;
  executiveSubtitle?: string | null;
  executiveMembers: Array<{
    name: string;
    role?: string | null;
    bio?: string | null;
    avatar?: Media | null;
    email?: string | null;
    linkedinUrl?: string | null;
  }>;
  boardTitle?: string | null;
  boardAccent?: string | null;
  boardSubtitle?: string | null;
  boardMembers: Array<{
    name: string;
    role?: string | null;
    bio?: string | null;
    avatar?: Media | null;
    email?: string | null;
    linkedinUrl?: string | null;
  }>;
  joinTitle?: string | null;
  joinText?: string | null;
  joinPrimaryLabel?: string | null;
  joinPrimaryUrl?: string | null;
  joinSecondaryLabel?: string | null;
  joinSecondaryUrl?: string | null;
  joinImage?: Media | null;
};

export type ProjectsSection = {
  type: "projects";
  title?: string | null;
  items: Array<{
    period?: string | null;
    title?: string | null;
    subtitle?: string | null;
    description?: string | null;
    impactTitle?: string | null;
    impactText?: string | null;
    extraNotes: Array<{ text?: string | null }>;
    side?: "left" | "right" | null;
    markerColor?: string | null;
  }>;
};

export type GallerySection = {
  type: "gallery";
  title?: string | null;
  limit?: number | null;
  items: Array<{
    title?: string | null;
    tag?: string | null;
    tagColor?: string | null;
    description?: string | null;
    image?: Media | null;
  }>;
};

export type ProjectGallerySection = {
  type: "projectGallery";
  eyebrow?: string | null;
  title: string;
  titleAccent?: string | null;
  description?: string | null;
  backgroundImage?: Media | null;
  filters: Array<{ label: string; value: string }>;
  limit?: number | null;
  initialVisible?: number | null;
  loadMoreLabel?: string | null;
  emptyStateText?: string | null;
};

export type ProjectSummaryDTO = {
  title: string;
  slug: string;
  category?: string | null;
  statusLabel?: string | null;
  statusTone?: "yellow" | "light" | "teal" | null;
  year?: string | null;
  excerpt?: string | null;
  coverImage?: Media | null;
  isFeatured?: boolean | null;
};

export type ProjectDTO = ProjectSummaryDTO & {
  summary?: string | null;
  body?: string | null;
  gallery: Media[];
  stats: Array<{ value: string; label: string }>;
};

export type ArticlesSection = {
  type: "articles";
  title?: string | null;
  subtitle?: string | null;
  limit?: number | null;
  categorySlug?: string | null;
  tagSlug?: string | null;
  buttonLabel?: string | null;
  buttonUrl?: string | null;
};

export type PodcastSection = {
  type: "podcast";
  title?: string | null;
  titleAccent?: string | null;
  subtitle?: string | null;
  buttonLabel?: string | null;
  buttonUrl?: string | null;
  items: Array<{
    episodeLabel?: string | null;
    publishedAtLabel?: string | null;
    duration?: string | null;
    title: string;
    description?: string | null;
    guestLabel?: string | null;
    listenLabel?: string | null;
    listenUrl?: string | null;
    mediaFile?: Media | null;
    coverImage?: Media | null;
  }>;
};

export type ContactSection = {
  type: "contact";
  eyebrow?: string | null;
  title?: string | null;
  subtitle?: string | null;
  infoTitle?: string | null;
  infoText?: string | null;
  contacts: Array<{ iconName?: string | null; value?: string | null }>;
  formTitle?: string | null;
  submitLabel?: string | null;
  successMessage?: string | null;
  buttonLabel?: string | null;
  buttonUrl?: string | null;
};

export type CarbonPredictorSection = {
  type: "carbonPredictor";
  title?: string | null;
  subtitle?: string | null;
  loadingTitle?: string | null;
  loadingSubtitle?: string | null;
  resultTitle?: string | null;
  resultSubtitle?: string | null;
  buttonLabel?: string | null;
};

export type CarbonCtaSection = {
  type: "carbonCta";
  title?: string | null;
  subtitle?: string | null;
  buttonLabel?: string | null;
  buttonUrl?: string | null;
};

export type Section =
  | HeroSection
  | FeaturesSection
  | LogosSection
  | TestimonialsSection
  | FaqSection
  | CtaSection
  | RichTextSection
  | AboutSection
  | MissionSection
  | TeamSection
  | TeamPageSection
  | ProjectsSection
  | GallerySection
  | ProjectGallerySection
  | ArticlesSection
  | PodcastSection
  | ContactSection
  | CarbonPredictorSection
  | CarbonCtaSection;

export type PageDTO = {
  title: string;
  slug: string;
  seo?: Seo | null;
  sections: Section[];
};

export type BlogPostDTO = {
  title: string;
  slug: string;
  excerpt?: string | null;
  coverImage?: Media | null;
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
  categories: Array<{ name: string; slug: string }>;
  tags: Array<{ name: string; slug: string }>;
};

export type BlogPostSummaryDTO = Omit<BlogPostDTO, "body">;

export type BlogListDTO = {
  items: BlogPostSummaryDTO[];
  pagination: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
};



