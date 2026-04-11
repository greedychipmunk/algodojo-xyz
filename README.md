# Algo Dojo

Company website for **Algo Dojo, LLC** — an AI/ML consulting firm specializing in agentic AI, machine learning, and business process automation.

Built with Next.js 15 (App Router), TypeScript, and Tailwind CSS v4. Features a dark-mode-first design, MDX-powered tutorials and blog, and full SEO optimization.

## Tech Stack

- **Framework:** Next.js 16 (App Router, React Server Components)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4 with custom design system
- **Content:** MDX via `next-mdx-remote` + `gray-matter`
- **Fonts:** Geist Sans & Geist Mono (self-hosted via `geist` package)
- **Linting:** ESLint 9 + Prettier
- **Package Manager:** pnpm

## Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (blog)/                   # Blog route group
│   │   └── blog/
│   │       ├── [slug]/page.tsx   # Blog post detail
│   │       └── page.tsx          # Blog listing
│   ├── (marketing)/              # Marketing route group
│   │   ├── about/page.tsx
│   │   ├── contact/page.tsx
│   │   └── services/page.tsx
│   ├── (tutorials)/              # Tutorials route group
│   │   └── tutorials/
│   │       ├── [slug]/page.tsx   # Tutorial detail
│   │       └── page.tsx          # Tutorial listing with filters
│   ├── globals.css               # Tailwind config + design tokens
│   ├── layout.tsx                # Root layout (header, footer, fonts)
│   ├── page.tsx                  # Home page
│   ├── robots.ts                 # robots.txt generation
│   └── sitemap.ts                # sitemap.xml generation
├── components/
│   ├── layout/                   # Header, footer, logo, mobile nav
│   ├── sections/                 # Page sections (hero, CTA, services, etc.)
│   ├── tutorials/                # Tutorial-specific (filters, TOC, MDX renderer)
│   └── ui/                       # Reusable primitives (Button, Card, Badge, etc.)
├── content/
│   ├── blog/                     # MDX blog posts
│   └── tutorials/                # MDX tutorial files
├── lib/
│   ├── blog.ts                   # Blog content loading utilities
│   ├── tutorials.ts              # Tutorial content loading utilities
│   └── types.ts                  # Shared TypeScript interfaces
└── styles/                       # (reserved for style extensions)

public/
├── fonts/
└── images/
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home — hero, services overview, featured tutorials, trust stats, CTA |
| `/services` | Detailed consulting offerings with benefits, use cases, and process |
| `/tutorials` | Filterable tutorial listing (category, difficulty, free/premium) |
| `/tutorials/[slug]` | Tutorial detail with MDX rendering, TOC, breadcrumbs |
| `/blog` | Blog listing with post cards |
| `/blog/[slug]` | Blog post detail with MDX rendering |
| `/about` | Company story, mission, values, team |
| `/contact` | Consultation booking form with client-side validation |

## Getting Started

### Prerequisites

- Node.js 22+ (LTS)
- pnpm 10+

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
pnpm build
```

### Lint

```bash
pnpm lint
```

## Adding Content

### Tutorials

Create a new `.mdx` file in `src/content/tutorials/` with this frontmatter:

```yaml
---
title: "Your Tutorial Title"
description: "SEO description for the tutorial"
tier: "free"           # "free" or "premium"
category: "ai"         # "ai", "ml", or "automation"
tags: ["python", "ai-agents"]
difficulty: "beginner"  # "beginner", "intermediate", or "advanced"
publishedAt: "2025-04-01"
updatedAt: "2025-04-01"
author: "Algo Dojo"
---

Your MDX content here...
```

### Blog Posts

Create a new `.mdx` file in `src/content/blog/` with this frontmatter:

```yaml
---
title: "Your Post Title"
description: "SEO description for the post"
publishedAt: "2025-04-01"
updatedAt: "2025-04-01"
author: "Algo Dojo"
tags: ["ai", "trends"]
---

Your MDX content here...
```

## Deployment

### Vercel (Recommended)

1. Connect the repository to [Vercel](https://vercel.com)
2. Vercel auto-detects Next.js — no configuration needed
3. Push to `main` to trigger a production deployment

Build settings (auto-detected):
- **Framework Preset:** Next.js
- **Build Command:** `pnpm build`
- **Output Directory:** `.next`
- **Install Command:** `pnpm install`

### Self-Hosted

```bash
# Build the production bundle
pnpm build

# Start the production server
pnpm start
```

The server runs on port 3000 by default. Set the `PORT` environment variable to change it.

### Docker Compose — Local Development

```bash
docker compose up --build
```

This uses `Dockerfile.dev` with hot-reloading. Source files are bind-mounted so changes appear instantly. The dev server is available at [http://localhost:3000](http://localhost:3000).

### Docker Compose — Production

```bash
docker compose -f docker-compose.prod.yml up --build -d
```

This uses the multi-stage `Dockerfile` to produce a minimal standalone image (~150 MB). Includes a health check that polls `/` every 30 seconds. The production server is available at [http://localhost:3000](http://localhost:3000).

To stop:

```bash
# Local
docker compose down

# Production
docker compose -f docker-compose.prod.yml down
```

## Design System

The site uses a dark-mode-first design with custom Tailwind tokens defined in `src/app/globals.css`:

- **Backgrounds:** Navy (`navy-950` to `navy-600`) and charcoal shades
- **Accents:** Cyan (`cyan-400`/`cyan-500`) and teal (`teal-400`/`teal-500`)
- **Text:** Slate scale (`slate-200` for body, `white` for headings, `slate-400`/`slate-500` for secondary)
- **Typography:** Geist Sans (body) + Geist Mono (code)

## SEO

- Unique `<title>` and `<meta description>` on every page via Next.js Metadata API
- JSON-LD structured data: Organization, Service, Article, BreadcrumbList
- Auto-generated `sitemap.xml` and `robots.txt`
- Canonical URLs and Open Graph tags
- Semantic HTML throughout (`<main>`, `<article>`, `<section>`, `<nav>`, `<aside>`)

## Accessibility

- WCAG 2.1 AA compliant
- Skip-to-content link on every page
- Keyboard-navigable interactive elements
- ARIA labels on icon-only buttons
- `prefers-reduced-motion` support
- Focus-visible outlines with cyan accent

## License

Proprietary. All rights reserved by Algo Dojo, LLC.
