# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager is **pnpm** (CI uses `pnpm install --frozen-lockfile`; lockfile is `pnpm-lock.yaml`).

- `pnpm dev` — start React Router dev server (Vite + Cloudflare plugin).
- `pnpm build` — production build via `react-router build`.
- `pnpm preview` — build then run `vite preview` against the built output.
- `pnpm typecheck` — runs `wrangler types` + `react-router typegen` + `tsc -b`. Required before push; CI runs this.
- `pnpm deploy` — build then `wrangler deploy`. CI does this automatically on pushes to `main`.
- `pnpm cf-typegen` — regenerate `worker-configuration.d.ts` from `wrangler.jsonc` (also runs on `postinstall`).

Sanity Studio is a **separate workspace** under `studio/` with its own `package.json`:

- `cd studio && pnpm dev` — run Studio locally.
- `cd studio && pnpm deploy` — deploy the hosted Studio.

There is no test runner configured; do not invent one.

## Architecture

This repo ships **one Cloudflare Worker** that SSRs a React Router 7 app, with content sourced from a **Sanity** project (`vgizgk4e`, dataset `production`). Three top-level pieces:

1. **`app/`** — React Router 7 app (SSR, `ssr: true` in `react-router.config.ts`). Routes are declared explicitly in `app/routes.ts` (not file-system routed): `home`, `blog` + `blog/:slug`, `works` + `works/:slug`. Layout/meta/links live in `app/root.tsx`.
2. **`workers/app.ts`** — the Cloudflare Worker entry. It wraps `createRequestHandler` from `react-router` and passes `{ cloudflare: { env, ctx } }` as the load context. The module augmentation in this file is what makes `context.cloudflare.env` typed inside loaders — keep it in sync with how loaders consume env.
3. **`studio/`** — a standalone Sanity Studio. Schemas (`post`, `work`) in `studio/schemaTypes/` define the shape of content the app loads. If you change a schema here, also update the matching types and GROQ projections in `app/lib/sanity.ts`.

### Content loading pattern

All Sanity reads go through **`app/lib/content.server.ts`** (server-only — note the `.server.ts` suffix). Loaders pull `env` from `context.cloudflare.env` and pass it through. Two important behaviors:

- The Sanity client is created **per-request** in `app/lib/sanity.ts` via `getSanityClient(env)`, reading `SANITY_PROJECT_ID` / `SANITY_DATASET` / `SANITY_API_VERSION` / `SANITY_TOKEN` from the Worker env. Do not instantiate a module-level client — Workers don't have a long-lived process and a token may be absent.
- Every fetch helper falls back to `samplePosts` / `sampleWorks` from `app/lib/sample-data.ts` if Sanity env vars are missing **or** the request throws. This keeps local dev and previews working without credentials. Preserve this fallback when adding new fetchers.

GROQ queries are centralized in `queries` in `app/lib/sanity.ts`; add new ones there rather than inlining at call sites.

### Env vars

- Public Sanity config (`SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_API_VERSION`) lives in `wrangler.jsonc` `vars` and is also mirrored in `.dev.vars` for local dev.
- `SANITY_TOKEN` is optional. When set, the client disables `useCdn` and switches to authenticated reads; when unset, the public CDN is used.
- `worker-configuration.d.ts` is a generated file — do not edit it by hand; rerun `pnpm cf-typegen` after editing `wrangler.jsonc`.

### Styling

Tailwind v4 via `@tailwindcss/vite`. Global styles and design tokens are in `app/app.css`. Webfonts (Anton, Caveat, Noto Sans JP) are loaded as a `<link rel="stylesheet">` in `root.tsx` — they are required for the design to render correctly on Android Chrome (see commit `5d9a38b`); don't switch to a JS-only font loader without testing on mobile.

### Deployment

- CI: `.github/workflows/` deploys to Cloudflare Workers on push to `main` using `cloudflare/wrangler-action@v3`. Required secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`.
- Custom domain `yuni.cat` is configured directly in `wrangler.jsonc` `routes`.
