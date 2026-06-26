import type { MetadataRoute } from "next";
import { SITE_METADATA } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // --- Default rule: allow all crawlers on public content ---
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/privacy", "/terms"],
      },

      // --- Major search engines: allow with crawl delays ---
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/api/"],
        crawlDelay: 0,
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: ["/api/"],
        crawlDelay: 1,
      },
      {
        userAgent: "DuckDuckBot",
        allow: "/",
        disallow: ["/api/"],
        crawlDelay: 1,
      },
      {
        userAgent: "Baiduspider",
        allow: "/",
        disallow: ["/api/"],
        crawlDelay: 2,
      },
      {
        userAgent: "YandexBot",
        allow: "/",
        disallow: ["/api/"],
        crawlDelay: 2,
      },
      {
        userAgent: "Slurp", // Yahoo
        allow: "/",
        disallow: ["/api/"],
        crawlDelay: 1,
      },

      // --- Content scrapers: block entirely ---
      {
        userAgent: "SemrushBot",
        disallow: "/",
      },
      {
        userAgent: "AhrefsBot",
        disallow: "/",
      },
      {
        userAgent: "MJ12bot",
        disallow: "/",
      },
      {
        userAgent: "DotBot",
        disallow: "/",
      },
      {
        userAgent: "BLEXBot",
        disallow: "/",
      },
      {
        userAgent: "Sogou web spider",
        disallow: "/",
      },
      {
        userAgent: "SeznamBot",
        disallow: "/",
      },
      {
        userAgent: "PiplBot",
        disallow: "/",
      },
      {
        userAgent: "PetalBot",
        disallow: "/",
      },

      // --- AI training crawlers: block (they consume content without
      //     driving traffic; uncomment any you want to allow) ---
      {
        userAgent: "GPTBot", // OpenAI
        disallow: "/",
      },
      {
        userAgent: "Google-Extended", // Google AI training
        disallow: "/",
      },
      {
        userAgent: "CCBot", // Common Crawl
        disallow: "/",
      },
      {
        userAgent: "anthropic-ai", // Anthropic
        disallow: "/",
      },
      {
        userAgent: "ClaudeBot", // Anthropic
        disallow: "/",
      },
      {
        userAgent: "Claude-Web", // Anthropic
        disallow: "/",
      },
      {
        userAgent: "Bytespider", // ByteDance / TikTok
        disallow: "/",
      },
      {
        userAgent: "PerplexityBot", // Perplexity
        disallow: "/",
      },
      {
        userAgent: "Amazonbot", // Amazon
        disallow: "/",
      },
      {
        userAgent: "ImagesiftBot", // image scraping
        disallow: "/",
      },
      {
        userAgent: "OAI-SearchBot", // OpenAI search
        disallow: "/",
      },
    ],
    sitemap: `${SITE_METADATA.siteUrl}/sitemap.xml`,
    host: SITE_METADATA.siteUrl,
  };
}
