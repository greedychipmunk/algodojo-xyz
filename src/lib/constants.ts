import type { NavItem, Service, SiteMetadata } from "./types";

export const SITE_METADATA: SiteMetadata = {
  title: "Algo Dojo — AI/ML Consulting & Education",
  description:
    "We examine business workflows and apply agentic AI and ML to optimize those workflows through automation. Free and premium tutorials on AI, ML, and automation.",
  siteUrl: "https://algodojo.xyz",
  ogImage: "/images/og-default.png",
};

export const NAV_ITEMS: NavItem[] = [
  { label: "Services", href: "/services" },
  { label: "Tutorials", href: "/tutorials" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const SERVICES: Service[] = [
  {
    title: "Workflow Analysis & Optimization",
    description:
      "We examine your existing business workflows end-to-end, identifying bottlenecks, redundancies, and opportunities where agentic AI can drive measurable improvements.",
    icon: "search",
    features: [
      "End-to-end workflow mapping",
      "Bottleneck identification",
      "ROI analysis for automation opportunities",
      "Prioritized implementation roadmap",
    ],
  },
  {
    title: "Agentic AI Development",
    description:
      "We design and build custom AI agents that autonomously execute complex multi-step tasks, integrate with your existing tools, and adapt to changing conditions.",
    icon: "cpu",
    features: [
      "Custom agent architecture design",
      "Tool integration & orchestration",
      "Memory & context management",
      "Human-in-the-loop guardrails",
    ],
  },
  {
    title: "Machine Learning Integration",
    description:
      "We develop and deploy ML models tailored to your specific business problems — from predictive analytics to NLP to computer vision — and integrate them into production systems.",
    icon: "brain",
    features: [
      "Model selection & training",
      "Data pipeline engineering",
      "MLOps & deployment automation",
      "Performance monitoring & retraining",
    ],
  },
  {
    title: "Business Process Automation",
    description:
      "We automate repetitive, error-prone processes using intelligent automation — combining AI agents, ML models, and traditional automation to eliminate manual work.",
    icon: "zap",
    features: [
      "Process automation design",
      "RPA + AI hybrid solutions",
      "API integration & orchestration",
      "Monitoring & exception handling",
    ],
  },
];

export const TUTORIAL_CATEGORIES = [
  { value: "ai", label: "AI" },
  { value: "ml", label: "Machine Learning" },
  { value: "automation", label: "Automation" },
] as const;

export const TUTORIAL_DIFFICULTIES = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
] as const;

export const TUTORIAL_TIERS = [
  { value: "free", label: "Free" },
  { value: "premium", label: "Premium" },
] as const;
