# Deploying ScanForge to Vercel

This project is built on TanStack Start. To deploy on Vercel:

1. Push the repo to GitHub.
2. Import the project on https://vercel.com/new.
3. Vercel will detect the build via `vercel.json`.
4. Add the environment variables from `.env` (they are NOT committed):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - `VITE_SUPABASE_PROJECT_ID`
   - `SUPABASE_URL`
   - `SUPABASE_PUBLISHABLE_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (server-only)
5. Deploy. The SSR output is in `.output/`.

> Note: the default nitro target is Cloudflare. For a pure Vercel Node/Edge build
> you may need to set `NITRO_PRESET=vercel` in Vercel Project Settings → Environment Variables.
