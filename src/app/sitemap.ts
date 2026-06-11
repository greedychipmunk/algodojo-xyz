import type { MetadataRoute } from "next";
import { getAllTutorials, getAllBlogPosts } from "@/lib/content";
import { SITE_METADATA } from "@/lib/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const tutorials = await getAllTutorials();
  const blogPosts = await getAllBlogPosts();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_METADATA.siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_METADATA.siteUrl}/services`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_METADATA.siteUrl}/tutorials`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_METADATA.siteUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_METADATA.siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_METADATA.siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${SITE_METADATA.siteUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_METADATA.siteUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const tutorialPages: MetadataRoute.Sitemap = tutorials.map((t) => ({
    url: `${SITE_METADATA.siteUrl}/tutorials/${t.slug}`,
    lastModified: new Date(t.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const blogPages: MetadataRoute.Sitemap = blogPosts.map((p) => ({
    url: `${SITE_METADATA.siteUrl}/blog/${p.slug}`,
    lastModified: new Date(p.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...tutorialPages, ...blogPages];
}
