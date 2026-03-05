import type { Schema, Struct } from '@strapi/strapi';

export interface SectionsAbout extends Struct.ComponentSchema {
  collectionName: 'components_sections_about';
  info: {
    displayName: 'About';
    icon: 'book';
  };
  attributes: {
    badgeLabel: Schema.Attribute.String;
    badgeSuffix: Schema.Attribute.String;
    badgeValue: Schema.Attribute.String;
    body: Schema.Attribute.RichText;
    countries: Schema.Attribute.Component<'sections.country-tag', true>;
    image: Schema.Attribute.Media<'images'>;
    imageCaptionSubtitle: Schema.Attribute.String;
    imageCaptionTitle: Schema.Attribute.String;
    quote: Schema.Attribute.Text;
    subtitle: Schema.Attribute.String;
    title: Schema.Attribute.String;
    titleAccent: Schema.Attribute.String;
  };
}

export interface SectionsArticles extends Struct.ComponentSchema {
  collectionName: 'components_sections_articles';
  info: {
    displayName: 'Articles';
    icon: 'list';
  };
  attributes: {
    buttonLabel: Schema.Attribute.String;
    buttonUrl: Schema.Attribute.String;
    categorySlug: Schema.Attribute.String;
    limit: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<3>;
    subtitle: Schema.Attribute.String;
    tagSlug: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface SectionsCarbonCta extends Struct.ComponentSchema {
  collectionName: 'components_sections_carbon_ctas';
  info: {
    displayName: 'Carbon Footprint CTA';
    icon: 'leaf';
  };
  attributes: {
    buttonLabel: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Lancer le calculateur'>;
    buttonUrl: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'/carbon-footprint'>;
    subtitle: Schema.Attribute.Text &
      Schema.Attribute.DefaultTo<'Estimez votre impact en quelques minutes et d\u00E9couvrez des pistes concr\u00E8tes pour le r\u00E9duire.'>;
    title: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Calculer votre empreinte carbone'>;
  };
}

export interface SectionsCarbonPredictor extends Struct.ComponentSchema {
  collectionName: 'components_sections_carbon_predictors';
  info: {
    displayName: 'Carbon Predictor';
    icon: 'leaf';
  };
  attributes: {
    buttonLabel: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Recalculate'>;
    loadingSubtitle: Schema.Attribute.Text &
      Schema.Attribute.DefaultTo<'Correlating 19 variables with carbon databases.'>;
    loadingTitle: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'AI is Analyzing...'>;
    resultSubtitle: Schema.Attribute.Text &
      Schema.Attribute.DefaultTo<'Your footprint is 15% lower than the regional average. Your choice of a vegan diet is your strongest eco-contributor.'>;
    resultTitle: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Your Predicted Emission'>;
    subtitle: Schema.Attribute.Text &
      Schema.Attribute.DefaultTo<'Fill in your lifestyle data to predict your carbon footprint.'>;
    title: Schema.Attribute.String & Schema.Attribute.DefaultTo<'EcoTrack AI'>;
  };
}

export interface SectionsContact extends Struct.ComponentSchema {
  collectionName: 'components_sections_contacts';
  info: {
    displayName: 'Contact';
    icon: 'email';
  };
  attributes: {
    buttonLabel: Schema.Attribute.String;
    buttonUrl: Schema.Attribute.String;
    contacts: Schema.Attribute.Component<'sections.contact-item', true>;
    eyebrow: Schema.Attribute.String;
    formTitle: Schema.Attribute.String;
    infoText: Schema.Attribute.Text;
    infoTitle: Schema.Attribute.String;
    submitLabel: Schema.Attribute.String;
    subtitle: Schema.Attribute.Text;
    successMessage: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface SectionsContactItem extends Struct.ComponentSchema {
  collectionName: 'components_sections_contact_items';
  info: {
    displayName: 'Contact Item';
    icon: 'phone';
  };
  attributes: {
    iconName: Schema.Attribute.String;
    value: Schema.Attribute.String;
  };
}

export interface SectionsCountryTag extends Struct.ComponentSchema {
  collectionName: 'components_sections_country_tags';
  info: {
    displayName: 'Country Tag';
    icon: 'pin';
  };
  attributes: {
    isHighlighted: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    url: Schema.Attribute.String;
  };
}

export interface SectionsCta extends Struct.ComponentSchema {
  collectionName: 'components_sections_ctas';
  info: {
    displayName: 'CTA';
    icon: 'megaphone';
  };
  attributes: {
    buttonLabel: Schema.Attribute.String;
    buttonUrl: Schema.Attribute.String;
    text: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface SectionsFaq extends Struct.ComponentSchema {
  collectionName: 'components_sections_faqs';
  info: {
    displayName: 'FAQ';
    icon: 'help';
  };
  attributes: {
    items: Schema.Attribute.Component<'sections.faq-item', true>;
    title: Schema.Attribute.String;
  };
}

export interface SectionsFaqItem extends Struct.ComponentSchema {
  collectionName: 'components_sections_faq_items';
  info: {
    displayName: 'FAQ Item';
    icon: 'question';
  };
  attributes: {
    answer: Schema.Attribute.Text & Schema.Attribute.Required;
    question: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsFeatureItem extends Struct.ComponentSchema {
  collectionName: 'components_sections_feature_items';
  info: {
    displayName: 'Feature Item';
    icon: 'star';
  };
  attributes: {
    description: Schema.Attribute.Text;
    iconName: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsFeatures extends Struct.ComponentSchema {
  collectionName: 'components_sections_features';
  info: {
    displayName: 'Features';
    icon: 'apps';
  };
  attributes: {
    items: Schema.Attribute.Component<'sections.feature-item', true>;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface SectionsGallery extends Struct.ComponentSchema {
  collectionName: 'components_sections_galleries';
  info: {
    displayName: 'Gallery';
    icon: 'grid';
  };
  attributes: {
    items: Schema.Attribute.Component<'sections.gallery-item', true>;
    limit: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<6>;
    title: Schema.Attribute.String;
  };
}

export interface SectionsGalleryItem extends Struct.ComponentSchema {
  collectionName: 'components_sections_gallery_items';
  info: {
    displayName: 'Gallery Item';
    icon: 'picture';
  };
  attributes: {
    description: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images'>;
    tag: Schema.Attribute.String;
    tagColor: Schema.Attribute.String &
      Schema.Attribute.CustomField<'global::theme-color'>;
    title: Schema.Attribute.String;
  };
}

export interface SectionsHero extends Struct.ComponentSchema {
  collectionName: 'components_sections_heroes';
  info: {
    displayName: 'Hero';
    icon: 'rocket';
  };
  attributes: {
    eyebrow: Schema.Attribute.String;
    headline: Schema.Attribute.String & Schema.Attribute.Required;
    image: Schema.Attribute.Media<'images'>;
    primaryCtaLabel: Schema.Attribute.String;
    primaryCtaUrl: Schema.Attribute.String;
    secondaryCtaLabel: Schema.Attribute.String;
    secondaryCtaUrl: Schema.Attribute.String;
    subheadline: Schema.Attribute.Text;
  };
}

export interface SectionsLogos extends Struct.ComponentSchema {
  collectionName: 'components_sections_logos';
  info: {
    displayName: 'Logos';
    icon: 'grid';
  };
  attributes: {
    logos: Schema.Attribute.Media<'images', true>;
    title: Schema.Attribute.String;
  };
}

export interface SectionsMission extends Struct.ComponentSchema {
  collectionName: 'components_sections_missions';
  info: {
    displayName: 'Mission';
    icon: 'check';
  };
  attributes: {
    axes: Schema.Attribute.Component<'sections.mission-axis', true>;
    axesTitle: Schema.Attribute.String;
    pillars: Schema.Attribute.Component<'sections.mission-pillar', true>;
    pillarsAccent: Schema.Attribute.String;
    pillarsTitle: Schema.Attribute.String;
    values: Schema.Attribute.Component<'sections.mission-value', true>;
    valuesPopupBackgroundImage: Schema.Attribute.Media<'images'>;
    valuesPopupContent: Schema.Attribute.RichText;
    valuesPopupOverlayColor: Schema.Attribute.String &
      Schema.Attribute.CustomField<'global::theme-color'>;
    valuesPopupTheme: Schema.Attribute.Enumeration<
      ['growth', 'horizon', 'mosaic', 'blueprint', 'ripple', 'discovery']
    >;
    valuesPopupTitle: Schema.Attribute.String;
    valuesTitle: Schema.Attribute.String;
  };
}

export interface SectionsMissionAxis extends Struct.ComponentSchema {
  collectionName: 'components_sections_mission_axes';
  info: {
    displayName: 'Mission Axis';
    icon: 'apps';
  };
  attributes: {
    badgeColor: Schema.Attribute.String &
      Schema.Attribute.CustomField<'global::theme-color'>;
    description: Schema.Attribute.Text;
    iconName: Schema.Attribute.String;
    order: Schema.Attribute.Integer;
    popupBackgroundImage: Schema.Attribute.Media<'images'>;
    popupContent: Schema.Attribute.RichText;
    popupOverlayColor: Schema.Attribute.String &
      Schema.Attribute.CustomField<'global::theme-color'>;
    popupTheme: Schema.Attribute.Enumeration<
      ['growth', 'horizon', 'mosaic', 'blueprint', 'ripple', 'discovery']
    >;
    popupTitle: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface SectionsMissionPillar extends Struct.ComponentSchema {
  collectionName: 'components_sections_mission_pillars';
  info: {
    displayName: 'Mission Pillar';
    icon: 'star';
  };
  attributes: {
    accentColor: Schema.Attribute.String &
      Schema.Attribute.CustomField<'global::theme-color'>;
    description: Schema.Attribute.Text;
    iconName: Schema.Attribute.String;
    popupBackgroundImage: Schema.Attribute.Media<'images'>;
    popupContent: Schema.Attribute.RichText;
    popupOverlayColor: Schema.Attribute.String &
      Schema.Attribute.CustomField<'global::theme-color'>;
    popupTheme: Schema.Attribute.Enumeration<
      ['growth', 'horizon', 'mosaic', 'blueprint', 'ripple', 'discovery']
    >;
    popupTitle: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface SectionsMissionValue extends Struct.ComponentSchema {
  collectionName: 'components_sections_mission_values';
  info: {
    displayName: 'Mission Value';
    icon: 'spark';
  };
  attributes: {
    iconName: Schema.Attribute.String;
    label: Schema.Attribute.String;
  };
}

export interface SectionsPodcast extends Struct.ComponentSchema {
  collectionName: 'components_sections_podcasts';
  info: {
    displayName: 'Podcast';
    icon: 'microphone';
  };
  attributes: {
    buttonLabel: Schema.Attribute.String;
    buttonUrl: Schema.Attribute.String;
    items: Schema.Attribute.Component<'sections.podcast-item', true>;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String;
    titleAccent: Schema.Attribute.String;
  };
}

export interface SectionsPodcastItem extends Struct.ComponentSchema {
  collectionName: 'components_sections_podcast_items';
  info: {
    displayName: 'Podcast Item';
    icon: 'headphone';
  };
  attributes: {
    coverImage: Schema.Attribute.Media<'images'>;
    description: Schema.Attribute.Text;
    duration: Schema.Attribute.String;
    episodeLabel: Schema.Attribute.String;
    guestLabel: Schema.Attribute.String;
    listenLabel: Schema.Attribute.String;
    listenUrl: Schema.Attribute.String;
    mediaFile: Schema.Attribute.Media<'videos' | 'files'>;
    publishedAtLabel: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsProjectGallery extends Struct.ComponentSchema {
  collectionName: 'components_sections_project_galleries';
  info: {
    displayName: 'Project Gallery';
    icon: 'layout';
  };
  attributes: {
    backgroundImage: Schema.Attribute.Media<'images'>;
    description: Schema.Attribute.Text;
    emptyStateText: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Aucun projet dans cette categorie.'>;
    eyebrow: Schema.Attribute.String;
    filters: Schema.Attribute.Component<
      'sections.project-gallery-filter',
      true
    >;
    initialVisible: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<6>;
    limit: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<6>;
    loadMoreLabel: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Charger plus de projets'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    titleAccent: Schema.Attribute.String;
  };
}

export interface SectionsProjectGalleryFilter extends Struct.ComponentSchema {
  collectionName: 'components_sections_project_gallery_filters';
  info: {
    displayName: 'Project Gallery Filter';
    icon: 'filter';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsProjectStat extends Struct.ComponentSchema {
  collectionName: 'components_sections_project_stats';
  info: {
    displayName: 'Project Stat';
    icon: 'chartBubble';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsProjects extends Struct.ComponentSchema {
  collectionName: 'components_sections_projects';
  info: {
    displayName: 'Projects Timeline';
    icon: 'calendar';
  };
  attributes: {
    items: Schema.Attribute.Component<'sections.timeline-item', true>;
    title: Schema.Attribute.String;
  };
}

export interface SectionsRichText extends Struct.ComponentSchema {
  collectionName: 'components_sections_rich_texts';
  info: {
    displayName: 'Rich Text';
    icon: 'text';
  };
  attributes: {
    body: Schema.Attribute.RichText & Schema.Attribute.Required;
    title: Schema.Attribute.String;
  };
}

export interface SectionsTeam extends Struct.ComponentSchema {
  collectionName: 'components_sections_teams';
  info: {
    displayName: 'Team';
    icon: 'user';
  };
  attributes: {
    locations: Schema.Attribute.Component<'sections.team-location', true>;
    locationTextColor: Schema.Attribute.String &
      Schema.Attribute.CustomField<'global::theme-color'>;
    mutedTextColor: Schema.Attribute.String &
      Schema.Attribute.CustomField<'global::theme-color'>;
    note: Schema.Attribute.Text;
    statLabelColor: Schema.Attribute.String &
      Schema.Attribute.CustomField<'global::theme-color'>;
    stats: Schema.Attribute.Component<'sections.team-stat', true>;
    statValueColor: Schema.Attribute.String &
      Schema.Attribute.CustomField<'global::theme-color'>;
    textColor: Schema.Attribute.String &
      Schema.Attribute.CustomField<'global::theme-color'>;
    title: Schema.Attribute.String;
    titleColor: Schema.Attribute.String &
      Schema.Attribute.CustomField<'global::theme-color'>;
  };
}

export interface SectionsTeamLocation extends Struct.ComponentSchema {
  collectionName: 'components_sections_team_locations';
  info: {
    displayName: 'Team Location';
    icon: 'map-pin';
  };
  attributes: {
    label: Schema.Attribute.String;
  };
}

export interface SectionsTeamMember extends Struct.ComponentSchema {
  collectionName: 'components_sections_team_members';
  info: {
    displayName: 'Team Member';
    icon: 'user';
  };
  attributes: {
    avatar: Schema.Attribute.Media<'images'>;
    bio: Schema.Attribute.Text;
    email: Schema.Attribute.String;
    linkedinUrl: Schema.Attribute.String;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    role: Schema.Attribute.String;
  };
}

export interface SectionsTeamOrgBranch extends Struct.ComponentSchema {
  collectionName: 'components_sections_team_org_branches';
  info: {
    displayName: 'Team Org Branch';
    icon: 'connector';
  };
  attributes: {
    leadLabel: Schema.Attribute.String & Schema.Attribute.Required;
    leadTone: Schema.Attribute.Enumeration<
      ['outline', 'teal', 'yellow', 'orange']
    > &
      Schema.Attribute.DefaultTo<'outline'>;
    roles: Schema.Attribute.Component<'sections.team-org-role', true>;
  };
}

export interface SectionsTeamOrgRole extends Struct.ComponentSchema {
  collectionName: 'components_sections_team_org_roles';
  info: {
    displayName: 'Team Org Role';
    icon: 'bulletList';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    tone: Schema.Attribute.Enumeration<
      ['outline', 'teal', 'yellow', 'orange']
    > &
      Schema.Attribute.DefaultTo<'outline'>;
  };
}

export interface SectionsTeamPage extends Struct.ComponentSchema {
  collectionName: 'components_sections_team_pages';
  info: {
    displayName: 'Team Page';
    icon: 'users';
  };
  attributes: {
    boardAccent: Schema.Attribute.String;
    boardMembers: Schema.Attribute.Component<'sections.team-member', true>;
    boardSubtitle: Schema.Attribute.Text;
    boardTitle: Schema.Attribute.String;
    executiveAccent: Schema.Attribute.String;
    executiveMembers: Schema.Attribute.Component<'sections.team-member', true>;
    executiveSubtitle: Schema.Attribute.Text;
    executiveTitle: Schema.Attribute.String;
    eyebrow: Schema.Attribute.String;
    heroCardEyebrow: Schema.Attribute.String;
    heroCardText: Schema.Attribute.Text;
    heroCardTitle: Schema.Attribute.String;
    heroCtaLabel: Schema.Attribute.String;
    heroCtaUrl: Schema.Attribute.String;
    heroImage: Schema.Attribute.Media<'images'>;
    intro: Schema.Attribute.Text;
    joinImage: Schema.Attribute.Media<'images'>;
    joinPrimaryLabel: Schema.Attribute.String;
    joinPrimaryUrl: Schema.Attribute.String;
    joinSecondaryLabel: Schema.Attribute.String;
    joinSecondaryUrl: Schema.Attribute.String;
    joinText: Schema.Attribute.Text;
    joinTitle: Schema.Attribute.String;
    organizationAccent: Schema.Attribute.String;
    organizationImage: Schema.Attribute.Media<'images'>;
    organizationSubtitle: Schema.Attribute.Text;
    organizationTitle: Schema.Attribute.String;
    orgBranches: Schema.Attribute.Component<'sections.team-org-branch', true>;
    orgDirectorLabel: Schema.Attribute.String;
    orgDirectorTone: Schema.Attribute.Enumeration<
      ['outline', 'teal', 'yellow', 'orange']
    > &
      Schema.Attribute.DefaultTo<'teal'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    titleAccent: Schema.Attribute.String;
  };
}

export interface SectionsTeamStat extends Struct.ComponentSchema {
  collectionName: 'components_sections_team_stats';
  info: {
    displayName: 'Team Stat';
    icon: 'chartPie';
  };
  attributes: {
    label: Schema.Attribute.String;
    value: Schema.Attribute.String;
  };
}

export interface SectionsTestimonialItem extends Struct.ComponentSchema {
  collectionName: 'components_sections_testimonial_items';
  info: {
    displayName: 'Testimonial Item';
    icon: 'quote';
  };
  attributes: {
    avatar: Schema.Attribute.Media<'images'>;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    quote: Schema.Attribute.Text & Schema.Attribute.Required;
    role: Schema.Attribute.String;
  };
}

export interface SectionsTestimonials extends Struct.ComponentSchema {
  collectionName: 'components_sections_testimonials';
  info: {
    displayName: 'Testimonials';
    icon: 'message';
  };
  attributes: {
    items: Schema.Attribute.Component<'sections.testimonial-item', true>;
    title: Schema.Attribute.String;
  };
}

export interface SectionsTimelineItem extends Struct.ComponentSchema {
  collectionName: 'components_sections_timeline_items';
  info: {
    displayName: 'Timeline Item';
    icon: 'clock';
  };
  attributes: {
    description: Schema.Attribute.Text;
    extraNotes: Schema.Attribute.Component<'sections.timeline-note', true>;
    impactText: Schema.Attribute.Text;
    impactTitle: Schema.Attribute.String;
    markerColor: Schema.Attribute.String &
      Schema.Attribute.CustomField<'global::theme-color'>;
    period: Schema.Attribute.String;
    side: Schema.Attribute.Enumeration<['left', 'right']> &
      Schema.Attribute.DefaultTo<'right'>;
    subtitle: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface SectionsTimelineNote extends Struct.ComponentSchema {
  collectionName: 'components_sections_timeline_notes';
  info: {
    displayName: 'Timeline Note';
    icon: 'bulletList';
  };
  attributes: {
    text: Schema.Attribute.String;
  };
}

export interface SharedNavbarLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_navbar_links';
  info: {
    displayName: 'Navbar Link';
    icon: 'link';
  };
  attributes: {
    href: Schema.Attribute.String & Schema.Attribute.Required;
    label: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    displayName: 'SEO';
    icon: 'search';
  };
  attributes: {
    metaDescription: Schema.Attribute.Text;
    metaTitle: Schema.Attribute.String;
    ogImage: Schema.Attribute.Media<'images'>;
  };
}

export interface SharedSocialLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_social_links';
  info: {
    displayName: 'Social Link';
    icon: 'share';
  };
  attributes: {
    iconName: Schema.Attribute.String;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'sections.about': SectionsAbout;
      'sections.articles': SectionsArticles;
      'sections.carbon-cta': SectionsCarbonCta;
      'sections.carbon-predictor': SectionsCarbonPredictor;
      'sections.contact': SectionsContact;
      'sections.contact-item': SectionsContactItem;
      'sections.country-tag': SectionsCountryTag;
      'sections.cta': SectionsCta;
      'sections.faq': SectionsFaq;
      'sections.faq-item': SectionsFaqItem;
      'sections.feature-item': SectionsFeatureItem;
      'sections.features': SectionsFeatures;
      'sections.gallery': SectionsGallery;
      'sections.gallery-item': SectionsGalleryItem;
      'sections.hero': SectionsHero;
      'sections.logos': SectionsLogos;
      'sections.mission': SectionsMission;
      'sections.mission-axis': SectionsMissionAxis;
      'sections.mission-pillar': SectionsMissionPillar;
      'sections.mission-value': SectionsMissionValue;
      'sections.podcast': SectionsPodcast;
      'sections.podcast-item': SectionsPodcastItem;
      'sections.project-gallery': SectionsProjectGallery;
      'sections.project-gallery-filter': SectionsProjectGalleryFilter;
      'sections.project-stat': SectionsProjectStat;
      'sections.projects': SectionsProjects;
      'sections.rich-text': SectionsRichText;
      'sections.team': SectionsTeam;
      'sections.team-location': SectionsTeamLocation;
      'sections.team-member': SectionsTeamMember;
      'sections.team-org-branch': SectionsTeamOrgBranch;
      'sections.team-org-role': SectionsTeamOrgRole;
      'sections.team-page': SectionsTeamPage;
      'sections.team-stat': SectionsTeamStat;
      'sections.testimonial-item': SectionsTestimonialItem;
      'sections.testimonials': SectionsTestimonials;
      'sections.timeline-item': SectionsTimelineItem;
      'sections.timeline-note': SectionsTimelineNote;
      'shared.navbar-link': SharedNavbarLink;
      'shared.seo': SharedSeo;
      'shared.social-link': SharedSocialLink;
    }
  }
}
