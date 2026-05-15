# Sanity content for yuni.cat

Schemas live in `schemas/`. To run a Studio:

```
pnpm dlx sanity@latest init --bare
# point it at this folder's `schemas/index.ts`
```

The web app reads from Sanity via the env vars:

- `SANITY_PROJECT_ID`
- `SANITY_DATASET` (default: `production`)
- `SANITY_API_VERSION` (default: `2024-10-01`)
- `SANITY_TOKEN` (optional — only needed for drafts / preview)

When these are not set, the app falls back to in-repo sample content.
