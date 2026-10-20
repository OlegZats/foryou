# foryou

React + TypeScript + Vite романтичний сайт. Корінь цього проєкту — ця папка; не створюй додаткову вкладену папку `foryou/foryou`.

## Local setup

1. Copy `.env.example` to `.env.local`.
2. In `.env.local`, set the actual `VITE_SUPABASE_URL` and public `VITE_SUPABASE_ANON_KEY` values from your existing Supabase project.
3. Install Node.js 22.12+ (or a current Node 22 LTS release).
4. Run:

   ```powershell
   npm install
   npm run build
   npm run dev
   ```

`.env.local` is ignored by Git and must not be committed. Never place a Supabase `service_role` key in this frontend project.

## GitHub Pages

The Vite `base` is set to `/foryou/`; the GitHub repository must therefore be named `foryou` (`OlegZats/foryou`). If you choose a different repository name, change `base` in `vite.config.ts` to `/<repository-name>/`.

In GitHub repository Settings → Secrets and variables → Actions → Variables, add:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Then open Settings → Pages and set Source to GitHub Actions. The workflow at `.github/workflows/deploy.yml` builds `dist` and deploys it on pushes to `main`.
