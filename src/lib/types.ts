export interface Tutorial {
  title: string;
  slug: string;
  description: string;
  tier: "free" | "premium";
  category: "ai" | "ml" | "automation";
  tags: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedReadTime: number;
  publishedAt: string;
  updatedAt: string;
  author: string;
  content: string;
}

export interface BlogPost {
  title: string;
  slug: string;
  description: string;
  tags: string[];
  publishedAt: string;
  updatedAt: string;
  author: string;
  content: string;
}

export interface Service {
  title: string;
  description: string;
  icon: string;
  features: string[];
}

export interface NavItem {
  label: string;
  href: string;
}

export interface SiteMetadata {
  title: string;
  description: string;
  siteUrl: string;
  ogImage: string;
}
