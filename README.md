# Personalized Content Dashboard

A Next.js 15 + TypeScript application that aggregates personalized content (News, Movies, Social) with live filtering, drag & drop ordering, infinite scrolling, and trend analysis.

## Contents

- Overview
- Features
- Tech Stack
- Getting Started
- Environment Variables
- Scripts
- Testing
- Performance Guide
- Accessibility Guide
- Security & Secrets
- Deployment

## Overview

This app provides a personalized, category‑weighted feed from multiple sources. Users can:
- Configure content category preferences and theme (light / dark / system)
- Drag & drop to reorder items; infinite scroll to load more
- Browse trending content derived from the current live feed
- Save favorites and revisit via the favorites page

## Features

- Next.js 15 (App Router) with TypeScript
- Redux Toolkit + RTK Query + Persist
- Tailwind CSS, Framer Motion
- React DnD drag & drop with auto‑scroll
- Debounced search, IntersectionObserver infinite scroll
- Robust error handling and resilient trending computation

## Tech Stack

- Framework: Next.js 15
- Language: TypeScript
- State: Redux Toolkit, RTK Query, redux‑persist
- UI: Tailwind CSS
- Animations: Framer Motion
- Drag & Drop: React DnD
- Testing: Jest, React Testing Library, Cypress

## Getting Started

1) Install dependencies

```bash
npm install
```

2) Set environment variables

Create a `.env.local` from `env.example` and fill the keys:

```
NEWS_API_KEY=...
TMDB_API_KEY=...
SOCIAL_API_BASE_URL=...
```

3) Run the dev server

```bash
npm run dev
```

App runs at http://localhost:3000

## Environment Variables

See `env.example` for a list of supported variables. Never commit real API keys; use `.env.local`.

## Scripts

```bash
npm run dev        # Next dev with Turbopack
npm run build      # Production build
npm run start      # Start production server
npm run lint       # Lint
npm run test       # Jest unit tests
npm run cypress    # Cypress open (if configured)
```

## Testing

### Unit & Integration (Jest + RTL)

- Place tests under `__tests__` mirroring the src structure.
- Use React Testing Library to test components and interactions.
- Mock RTK Query endpoints where needed.

Run:

```bash
npm run test
```

### E2E (Cypress)

- Basic smoke tests validate navigation, theme toggle, preferences save, and feed rendering.

Run:

```bash
npm run cypress
```

## Performance Guide

- Code‑split heavy routes/components via dynamic import where possible.
- Ensure images use `next/image` with proper sizes & lazy loading.
- Use list virtualization for very long feeds.
- Audit bundle with `next build` and inspect output. Watch for large third‑party libs.
- Avoid re‑render loops; memoize expensive selectors and components.

Checklist:
- [ ] Dynamic imports for rarely used panels (e.g., Preferences modal)
- [ ] Virtualize long lists if item count > 200
- [ ] Ensure API responses are cached via RTK Query where appropriate
- [ ] Remove dead code and unused dependencies

## Accessibility Guide (WCAG 2.1 AA)

- Color contrast: verify with browser devtools/axe (minimum 4.5:1 for text).
- Keyboard navigation: all actionable elements must be tabbable, visible focus.
- ARIA labels: add aria‑labels for icon‑only buttons (theme, notifications, etc.).
- Landmarks: ensure semantic structure (header/nav/main/aside/footer).
- Motion: respect reduced motion if feasible for animations.

Run automated checks with axe (browser extension) and Lighthouse. Fix violations before release.

## Security & Secrets

- Never expose API keys in client code directly.
- Keys must be provided via `.env.local`. Only expose public keys if intended by the provider.
- Validate and sanitize API responses; handle network errors gracefully.
- Review redux‑persist whitelists; avoid persisting sensitive data.
- Consider server‑side proxies for protected API calls.

## Deployment

1) Set environment variables in your hosting platform (Vercel/Netlify/Render).
2) Build the project: `npm run build`.
3) Start: `npm run start`.

For Vercel, simply import the repo, configure env vars, and deploy.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
