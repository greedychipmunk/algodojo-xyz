import type { Metadata } from "next";
import { SITE_METADATA } from "./constants";

interface MetadataOptions {
  title: string;
  description: string;
  path?: string;
  ogImage?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
}

export function generatePageMetadata({
  title,
  description,
  path = "",
  ogImage = SITE_METADATA.ogImage,
  type = "website",
  publishedTime,
  modifiedTime,
}: MetadataOptions): Metadata {
  const url = `${SITE_METADATA.siteUrl}${path}`;
  const fullTitle = path
    ? `${title} | Algo Dojo`
    : SITE_METADATA.title;

  return {
    title: fullTitle,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: "Algo Dojo",
      type,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
    },
  };
}

export function generateJsonLd(
  type: "Organization" | "Service" | "Article" | "BreadcrumbList" | "FAQPage",
  data: Record<string, unknown>,
) {
  const base = {
    "@context": "https://schema.org",
    "@type": type,
  };

  return JSON.stringify({ ...base, ...data });
}

export function organizationJsonLd() {
  return generateJsonLd("Organization", {
    name: "Algo Dojo, LLC",
    url: SITE_METADATA.siteUrl,
    logo: `${SITE_METADATA.siteUrl}/images/logo.png`,
    description: SITE_METADATA.description,
    sameAs: [],
  });
}

export function breadcrumbJsonLd(
  items: Array<{ name: string; href: string }>,
) {
  return generateJsonLd("BreadcrumbList", {
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_METADATA.siteUrl}${item.href}`,
    })),
  });
}
