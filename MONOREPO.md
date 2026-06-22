# Monorepo Structure & Conventions

## Structure

```
matchcard-landing/
├── app/                        # Next.js App Router (matchcard.no)
│   ├── api/req/                # Shared API routes (extract, enrich, transcribe…)
│   └── ...pages
├── apps/                       # Independent frontend apps
│   └── behovsavklarer/         # Vite + React SPA (source lives here)
├── public/
│   └── behovsavklarer/         # Built output — never edit directly, always rebuild
├── components/                 # Shared Next.js components
├── package.json                # Root — orchestration scripts
└── next.config.js              # Rewrites so /behovsavklarer serves the SPA
```

## Why two build tools

The root app (matchcard.no) is Next.js. Apps under `apps/` are independent SPAs with their own framework (currently Vite + React). They are built separately and their output is placed in `public/` so Next.js serves them as static files.

`next build` does not know about Vite. The root build script chains them so Vercel only needs one command.

## Adding or updating an app under apps/

1. Make changes in `apps/<appname>/src/`
2. From the repo root, run:
   ```bash
   npm run build:<appname>
   ```
   This builds the Vite app and copies the output to `public/<appname>/`.
3. Commit both `apps/<appname>/` source changes and the updated `public/<appname>/` build output together in one commit.
4. Push — Vercel redeploys automatically.

Never commit to `public/<appname>/` directly. Always rebuild from source.

## Adding a new app

1. Scaffold under `apps/<newapp>/` (Vite, or any framework)
2. Set `base: '/<newapp>/'` in its `vite.config.js` for production
3. Add a build script to root `package.json`:
   ```json
   "build:<newapp>": "cd apps/<newapp> && npm ci && npm run build && rm -rf ../../public/<newapp> && cp -r dist ../../public/<newapp>"
   ```
4. Add a rewrite in `next.config.js`:
   ```js
   { source: '/<newapp>', destination: '/<newapp>/index.html' }
   ```
5. Add `apps/<newapp>/node_modules` and `apps/<newapp>/dist` to `.gitignore`

## Shared API routes

All API routes live in `app/api/`. Apps under `apps/` call them via `https://matchcard.no/api/...` in production and proxy through Vite's dev server locally (`vite.config.js` → `server.proxy`). CORS headers on each route allow the relevant origins.

## Git conventions

| What | Convention |
|------|-----------|
| Branch for app work | `feat/behovsavklarer-...` |
| Branch for API/shared work | `feat/api-...` or `feat/matchcard-...` |
| Commit scope | `feat(behovsavklarer): ...` / `fix(api): ...` |
| Never | Mix app source commits with unrelated app changes in one commit |

Isolation comes from discipline at the branch and commit level, not from separate repositories.

## Standalone repos

Some apps were initially developed in standalone repos before being brought into this monorepo. Those repos are preserved as historical snapshots (tagged `v1.0.0`) and are no longer the source of truth.

| App | Standalone repo | Status |
|-----|----------------|--------|
| behovsavklarer | jungeltelegrafen/behovsavklarer | Frozen at v1.0.0 — monorepo is source of truth |
