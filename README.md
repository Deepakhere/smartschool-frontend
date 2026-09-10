# smartschool-frontend

Frontend for the SmartSchool multi-tenant School Management platform.
Vite + React 18 + TypeScript, `@tanstack/react-query` v5, `react-hook-form` +
`zod`, Radix UI + Tailwind.

## Getting started

```bash
npm install
npm run dev      # vite dev server on http://localhost:3003 (see vite.config.ts)
npm run build    # tsc -b && vite build — uses .env.production automatically
npm test         # vitest + React Testing Library
npm run lint
```

The `x.tsx` view + `x-controller.ts` hook + `index.ts` barrel triad is the
convention throughout `src/pages/` — controllers own data/state, components
stay presentational.

## Environment

- `.env` — local dev default (`VITE_API_URL`, points at the backend).
- `.env.production` — used automatically by `npm run build` (Vite's
  production mode); this is baked into the built JS at build time, so it must
  point at the real deployed backend URL before a real build/deploy.
- `.env.example` — documents the key for a fresh clone.

The dev server's port (3003) is fixed in `vite.config.ts` so it matches
whatever the backend's `FRONTEND_URL`/CORS allowlist expects locally — keep
both in sync if either changes.

## Deployment

See **[deploy/DEPLOYMENT.md](./deploy/DEPLOYMENT.md)** — S3 (private bucket,
CloudFront Origin Access Control) + CloudFront for free HTTPS via its default
`*.cloudfront.net` domain, including the SPA-routing error-page config that's
easy to miss.

## CI

`.github/workflows/ci.yml` runs on every push/PR to `main`: lint, typecheck,
test, build. A `deploy` job runs after tests pass on `main` — builds with the
real `.env.production`, syncs to S3, and invalidates the CloudFront cache. See
`deploy/DEPLOYMENT.md` for the one-time AWS setup and GitHub secrets it needs.
