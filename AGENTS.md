# AGENTS.md — Algo Dojo, LLC Company Website

## Project Overview

This is the company website for **Algo Dojo, LLC** — a consulting firm specializing in agentic AI, machine learning, and automation. We examine business workflows and apply agentic AI and ML to optimize those workflows through automation.

Alongside consulting, we provide **free and premium tutorials** on AI, ML, and automation — serving as both a lead generation channel and a standalone educational platform.

### Primary Goals (in priority order)

1. **UX** — Intuitive, accessible, visually polished experience across all devices
2. **SEO** — Structured data, semantic HTML, fast indexing, keyword-optimized content architecture
3. **Performance** — Core Web Vitals targets: LCP < 2.5s, INP < 200ms, CLS < 0.1

## Company Identity

- **Name:** Algo Dojo, LLC
- **Domain:** algodojo.xyz
- **Industry:** AI/ML Consulting & Education
- **Core Services:**
  - Workflow analysis and optimization through agentic AI
  - Machine learning model development and integration
  - Business process automation
- **Secondary Offering:**
  - Free tutorials on AI, ML, and automation
  - Premium tutorial content (gated/paid)

## Architecture Decisions

### Tech Stack

- **Framework:** Next.js (App Router) — SSR/SSG for SEO, React Server Components for performance
- **Styling:** Tailwind CSS with a custom design system
- **Deployment:** Vercel (Fluid Compute, ISR for tutorial pages)
- **Content:** MDX for tutorials and blog posts
- **Analytics:** Vercel Analytics + Web Vitals monitoring

### Project Structure

```
src/
  app/                  # Next.js App Router pages
    (marketing)/        # Landing, about, services, contact
    (tutorials)/        # Free and premium tutorial content
    (blog)/             # Blog/insights section
    api/                # API routes
  components/
    ui/                 # Reusable UI primitives (buttons, cards, inputs)
    layout/             # Header, footer, navigation, sidebar
    sections/           # Page-level composed sections (hero, CTA, features)
    tutorials/          # Tutorial-specific components
  lib/                  # Utilities, helpers, constants
  content/              # MDX files for tutorials and blog posts
  styles/               # Global styles, Tailwind config extensions
public/
  images/               # Optimized static images
  fonts/                # Self-hosted fonts
```

### Route Groups

Use Next.js route groups `(marketing)`, `(tutorials)`, `(blog)` to isolate layouts per section without affecting URL structure.

## Coding Standards

### General

- TypeScript strict mode — no `any` types, no `@ts-ignore`
- Functional components only — no class components
- Named exports — no default exports except for Next.js pages/layouts
- Prefer Server Components — only use `"use client"` when interactivity requires it
- Keep components under 150 lines — extract sub-components when exceeding this

### Naming Conventions

- **Files:** kebab-case (`hero-section.tsx`, `tutorial-card.tsx`)
- **Components:** PascalCase (`HeroSection`, `TutorialCard`)
- **Utilities/hooks:** camelCase (`useMediaQuery`, `formatDate`)
- **CSS classes:** Tailwind utility classes; custom classes use kebab-case
- **Content files:** kebab-case (`intro-to-langchain.mdx`)

### SEO Requirements

- Every page must have unique `<title>` and `<meta name="description">` via Next.js Metadata API
- Use semantic HTML elements (`<article>`, `<section>`, `<nav>`, `<main>`, `<aside>`)
- All images must have descriptive `alt` text
- Implement JSON-LD structured data for: Organization, Service, Article, BreadcrumbList, FAQPage
- Canonical URLs on all pages
- Generate `sitemap.xml` and `robots.txt` via Next.js built-in support
- Tutorial pages should target long-tail keywords (e.g., "how to build an AI agent with Python")

### Performance Requirements

- Use `next/image` for all images — no raw `<img>` tags
- Self-host fonts with `next/font` — no external font requests
- Lazy-load below-the-fold content and non-critical components
- Minimize client-side JavaScript — prefer Server Components
- Use ISR (Incremental Static Regeneration) for tutorial and blog pages
- Critical CSS should be inlined; avoid large CSS bundles
- Target Lighthouse scores: Performance 95+, Accessibility 100, SEO 100, Best Practices 95+

### Accessibility

- WCAG 2.1 AA compliance minimum
- All interactive elements must be keyboard-navigable
- Sufficient color contrast ratios (4.5:1 for normal text, 3:1 for large text)
- ARIA labels on icon-only buttons and non-text interactive elements
- Skip-to-content link on every page
- Respect `prefers-reduced-motion` and `prefers-color-scheme`

## Content Strategy

### Tutorial Content Model

```
Tutorial:
  - title: string
  - slug: string (URL-safe)
  - description: string (SEO meta)
  - tier: "free" | "premium"
  - category: "ai" | "ml" | "automation"
  - tags: string[]
  - difficulty: "beginner" | "intermediate" | "advanced"
  - estimatedReadTime: number (minutes)
  - publishedAt: date
  - updatedAt: date
  - author: string
  - content: MDX
```

### Page Requirements

| Page | Purpose | SEO Priority |
|------|---------|-------------|
| Home | Hero + value prop + services overview + featured tutorials | Critical |
| Services | Detailed consulting offerings with case study hooks | Critical |
| Tutorials | Filterable grid of free + premium tutorials | Critical |
| Tutorial Detail | Individual tutorial with TOC, code blocks, sharing | Critical |
| About | Company story, team, mission | Medium |
| Blog | Thought leadership, industry insights | High |
| Contact | Consultation booking form | Medium |

## Design Principles

- **Clean and professional** — convey technical expertise without visual clutter
- **Dark mode first** — tech-savvy audience expects it; light mode as secondary
- **Generous whitespace** — let content breathe
- **Consistent spacing scale** — use Tailwind's spacing system; don't use arbitrary values
- **Typography hierarchy** — clear distinction between headings, body, code, and captions
- **Subtle animations** — purposeful micro-interactions, nothing gratuitous

## Git Workflow

- Branch naming: `feat/`, `fix/`, `docs/`, `refactor/` prefixes
- Commit messages: conventional commits format (`feat:`, `fix:`, `docs:`, `chore:`)
- No direct commits to `main` — use feature branches
- Keep PRs focused on a single concern

## Environment & Tooling

- Node.js 24 LTS
- pnpm as package manager
- ESLint + Prettier for linting/formatting
- TypeScript strict mode
- Vercel for deployment (production + preview environments)

## Agent-Specific Instructions

### When Building Pages

1. Start with the metadata (title, description, structured data)
2. Build the Server Component shell first
3. Extract interactive parts into `"use client"` components only as needed
4. Ensure responsive design at mobile (375px), tablet (768px), and desktop (1280px+)

### When Writing Tutorial Content

1. Front matter must include all fields from the Tutorial Content Model above
2. Use descriptive headings that work as search queries
3. Include code examples with syntax highlighting
4. Add a table of contents for tutorials over 5 minutes read time

### When Optimizing Performance

1. Run Lighthouse in CI — block merges that drop below thresholds
2. Audit bundle size with `@next/bundle-analyzer` before adding dependencies
3. Prefer native browser APIs over npm packages when feasible

### When Styling

1. Use Tailwind utility classes — no inline styles, no CSS modules
2. Extract repeated patterns into component variants, not custom CSS
3. Design system tokens live in `tailwind.config.ts`
4. Responsive: mobile-first approach (`sm:`, `md:`, `lg:` breakpoints)
