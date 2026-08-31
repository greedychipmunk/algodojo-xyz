# Algo Dojo

Company website for **Algo Dojo, LLC** — an AI/ML consulting firm specializing in agentic AI, machine learning, and business process automation.

Built with Next.js 16 (App Router), TypeScript, and Tailwind CSS v4. Features a dark-mode-first design, MDX-powered tutorials and blog, full SEO optimization, and premium tutorials gated behind Better Auth + Polar subscriptions.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Pages](#pages)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Authentication & Payments Setup](#authentication--payments-setup)
- [Adding Content](#adding-content)
- [Deployment](#deployment)
- [Design System](#design-system)
- [SEO](#seo)
- [Accessibility](#accessibility)
- [License](#license)

## Tech Stack

- **Framework:** Next.js 16 (App Router, React Server Components)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4 with custom design system
- **Content:** MDX via `next-mdx-remote` + `gray-matter`
- **Auth:** Better Auth (email/password, self-hosted)
- **Payments:** Polar (Merchant of Record) via `@polar-sh/better-auth`
- **Database:** Turso (libSQL/SQLite) via Kysely
- **Fonts:** Geist Sans & Geist Mono (self-hosted via `geist` package)
- **Linting:** ESLint 9 + Prettier
- **Package Manager:** pnpm

## Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth route group
│   │   ├── sign-in/page.tsx      # Sign-in page
│   │   └── sign-up/page.tsx      # Sign-up page
│   ├── (blog)/                   # Blog route group
│   │   └── blog/
│   │       ├── [slug]/page.tsx   # Blog post detail
│   │       └── page.tsx          # Blog listing
│   ├── (main)/                   # Main route group
│   │   ├── account/page.tsx      # Account page (subscription status, billing)
│   │   └── pricing/page.tsx      # Pricing page (free/premium tiers)
│   ├── (marketing)/              # Marketing route group
│   │   ├── about/page.tsx
│   │   ├── contact/page.tsx
│   │   └── services/page.tsx
│   ├── (tutorials)/              # Tutorials route group
│   │   └── tutorials/
│   │       ├── [slug]/page.tsx   # Tutorial detail (with content gating)
│   │       └── page.tsx          # Tutorial listing with filters
│   ├── api/
│   │   └── auth/[...all]/route.ts # Better Auth API route handler
│   ├── globals.css               # Tailwind config + design tokens
│   ├── layout.tsx                # Root layout (header, footer, fonts)
│   ├── page.tsx                  # Home page
│   ├── proxy.ts                  # Next.js 16 proxy (optimistic session checks)
│   ├── robots.ts                 # robots.txt generation
│   └── sitemap.ts                # sitemap.xml generation
├── components/
│   ├── account/                  # Account page components
│   ├── auth/                     # Auth form component
│   ├── layout/                   # Header, footer, logo, mobile nav
│   ├── pricing/                  # Pricing tier cards
│   ├── sections/                 # Page sections (hero, CTA, services, etc.)
│   ├── tutorials/                # Tutorial-specific (filters, TOC, paywall, MDX renderer)
│   └── ui/                       # Reusable primitives (Button, Card, Badge, etc.)
├── content/
│   ├── blog/                     # MDX blog posts
│   └── tutorials/                # MDX tutorial files
├── lib/
│   ├── auth.ts                   # Better Auth server config (Turso + Polar)
│   ├── auth-client.ts            # Better Auth client SDK
│   ├── blog.ts                   # Blog content loading utilities
│   ├── content.ts                # Content loading + frontmatter parsing
│   ├── constants.ts              # Site metadata, nav items, categories, tiers
│   ├── subscription.ts           # Server-side subscription status helper
│   ├── tutorials.ts              # Tutorial content loading utilities
│   ├── types.ts                  # Shared TypeScript interfaces
│   └── markdown.ts              # MDX/markdown rendering
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
| `/tutorials/[slug]` | Tutorial detail with MDX rendering, TOC, breadcrumbs (paywall for premium) |
| `/blog` | Blog listing with post cards |
| `/blog/[slug]` | Blog post detail with MDX rendering |
| `/pricing` | Free and premium tier cards with Polar checkout |
| `/sign-in` | Sign-in page (email/password) |
| `/sign-up` | Sign-up page (email/password) |
| `/account` | Account page — subscription status, billing portal link (auth required) |
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

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

| Variable | Description |
|----------|-------------|
| `TURSO_DATABASE_URL` | Turso libSQL database URL (`libsql://...`) |
| `TURSO_AUTH_TOKEN` | Turso database auth token |
| `BETTER_AUTH_SECRET` | Better Auth secret (32+ chars — generate with `openssl rand -base64 32`) |
| `BETTER_AUTH_URL` | Site URL (`http://localhost:3000` for dev, production URL for deploy) |
| `POLAR_ACCESS_TOKEN` | Polar API access token (from Polar dashboard) |
| `POLAR_WEBHOOK_SECRET` | Polar webhook secret (from Polar webhook settings) |
| `POLAR_SUCCESS_URL` | URL to redirect after successful checkout (`http://localhost:3000/account`) |
| `POLAR_RETURN_URL` | URL to redirect back from checkout (`http://localhost:3000/pricing`) |
| `NEXT_PUBLIC_POLAR_PRODUCT_SLUG` | Polar product slug for the premium subscription |

## Authentication & Payments Setup

The site uses [Better Auth](https://better-auth.com) for self-hosted email/password authentication and [Polar](https://polar.sh) as the Merchant of Record for premium subscriptions.

### 1. Create a Turso Database

```bash
# Install Turso CLI
curl -sSfL https://get.tur.so/install.sh | bash

# Create a database
turso db create algodojo

# Get the database URL
turso db show algodojo --url

# Create an auth token
turso db tokens create algodojo
```

Set `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` in `.env.local`.

### 2. Generate a Better Auth Secret

```bash
openssl rand -base64 32
```

Set `BETTER_AUTH_SECRET` in `.env.local`.

### 3. Run Database Migrations

Create the Better Auth tables (user, session, account, verification) in your Turso database:

```bash
npx @better-auth/cli migrate
```

### 4. Create a Polar Product

1. Sign up at [Polar](https://polar.sh)
2. Create a subscription product (e.g., "Algo Dojo Premium" at $9/month)
3. Copy the product slug and set `NEXT_PUBLIC_POLAR_PRODUCT_SLUG` in `.env.local`
4. Generate an access token and set `POLAR_ACCESS_TOKEN`
5. Create a webhook endpoint pointing to `https://your-domain.com/api/auth/polar/webhooks`
6. Copy the webhook secret and set `POLAR_WEBHOOK_SECRET`

### 5. Configure Production URLs

For production, set these in your hosting provider's environment variables:

- `BETTER_AUTH_URL` → your production URL (e.g., `https://algodojo.xyz`)
- `POLAR_SUCCESS_URL` → `https://algodojo.xyz/account`
- `POLAR_RETURN_URL` → `https://algodojo.xyz/pricing`

### How Content Gating Works

- Tutorials with `tier: "free"` are accessible to everyone
- Tutorials with `tier: "premium"` show a paywall for non-subscribers
- Authenticated users with an active Polar subscription see full content
- The Next.js proxy (`src/proxy.ts`) performs optimistic cookie checks for `/account`
- Real auth/subscription checks happen server-side in the page component via `getSubscriptionStatus()`

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
