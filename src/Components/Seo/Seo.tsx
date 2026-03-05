import React from "react";
import { Helmet } from "react-helmet-async";

type SeoProps = {
  title: string;
  description?: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
  noIndex?: boolean;
};

const SITE_NAME = "CliMates Madagascar";
const DEFAULT_DESCRIPTION =
  "Think-and do-tank international mobilisant la jeunesse malgache pour l'action climatique, l'innovation et le plaidoyer.";

const resolveSiteUrl = () => {
  const envUrl = import.meta.env?.VITE_SITE_URL ?? "";
  return envUrl ? envUrl.replace(/\/$/, "") : "";
};

const resolveUrl = (baseUrl: string, path?: string) => {
  if (!baseUrl || !path) {
    return undefined;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
};

const resolveImage = (baseUrl: string, image?: string) => {
  if (!image) {
    return undefined;
  }

  if (image.startsWith("http")) {
    return image;
  }

  return baseUrl ? `${baseUrl}${image.startsWith("/") ? image : `/${image}`}` : image;
};

const Seo: React.FC<SeoProps> = ({
  title,
  description = DEFAULT_DESCRIPTION,
  path = "/",
  image,
  type = "website",
  noIndex = false,
}) => {
  const siteUrl = resolveSiteUrl();
  const canonical = resolveUrl(siteUrl, path);
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  const resolvedImage = resolveImage(siteUrl, image);
  const twitterCard = resolvedImage ? "summary_large_image" : "summary";

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description ? <meta name="description" content={description} /> : null}
      {noIndex ? <meta name="robots" content="noindex,nofollow" /> : null}
      {canonical ? <link rel="canonical" href={canonical} /> : null}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      {description ? <meta property="og:description" content={description} /> : null}
      {canonical ? <meta property="og:url" content={canonical} /> : null}
      {resolvedImage ? <meta property="og:image" content={resolvedImage} /> : null}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={fullTitle} />
      {description ? <meta name="twitter:description" content={description} /> : null}
      {resolvedImage ? <meta name="twitter:image" content={resolvedImage} /> : null}
    </Helmet>
  );
};

export default Seo;
