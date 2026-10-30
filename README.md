# NuvioFit

AI fitness coach that turns a short onboarding quiz into a personalized 7-day training plan, then guides you through each workout with a live session screen, a warm-up flow, progress tracking and an AI coach chat.

**Stack:** React 18 + TypeScript + Vite, Tailwind + shadcn/ui, Clerk (auth), Supabase (Postgres + row level security), OpenAI (plan generation and coach chat), Brevo (emails), Vercel (hosting, serverless API, cron).

## How it works

1. A visitor lands on the marketing page and signs up with Clerk.
2. `ProtectedRoute` sends new users to the onboarding quiz (`/getting-started`), which saves their answers to `onboarding_responses` in Supabase.
3. `generateFitnessPlan` builds a structured prompt from those answers and calls `/api/generate`, a serverless function that talks to OpenAI with the key kept on the server.
4. The plan comes back in a strict line format that the app parses into days, warm-ups and exercises (sets, reps, rest, calories) for the dashboard, calendar and workout screens.
5. Users can edit their plan with AI, chat with the AI coach (monthly message limit), log mood, energy and steps, and send feedback.
6. A monthly Vercel cron emails users a week after signup asking for feedback, with signed unsubscribe links.

```
src/
  pages/            Landing, onboarding, dashboard, workout, warm-up, calendar, legal pages
  components/       Feature pages + dashboard widgets + shadcn/ui
  components/lib/   Supabase client, plan generation, plan editing, helpers
api/                Vercel serverless functions (OpenAI, emails, unsubscribe, cron)
scripts/dev-api.ts  Runs the api/ functions locally
supabase/schema.sql Database tables + row level security policies
```

## Run it locally

Needs Node 20+.

```bash
npm install
cp .env.example .env.local   # then fill in the keys (see Setup below)
npm run dev                  # web on http://localhost:3001, API on :8080
```

Without keys the app opens on a "NuvioFit needs setup" screen listing exactly what's missing, instead of a blank page.

Other scripts: `npm run build`, `npm run typecheck`, `npm run lint`, `npm run preview`.

## Setup: accounts and keys

Everything below has a free tier. You don't need a custom domain or a phone number to run the full app; those only matter for a polished public launch.

### 1. Supabase (database), required
1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL editor**, paste [`supabase/schema.sql`](supabase/schema.sql) and run it.
3. From **Project settings → API**, copy the URL and `anon` key into `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`, and the `service_role` key into `SUPABASE_SERVICE_ROLE_KEY` (server only, never in a `VITE_` variable).

### 2. Clerk (sign in), required
1. Create an application at [dashboard.clerk.com](https://dashboard.clerk.com) with email + Google sign-in.
2. Copy the publishable key into `VITE_CLERK_PUBLISHABLE_KEY`.
   - **Use the Development key (`pk_test_...`) unless you own a domain.** A Production key (`pk_live_...`) is tied to a domain and loads Clerk from `clerk.yourdomain.com`. If that domain's DNS is gone (as with the old nuviofit.com setup), the browser shows `GET https://clerk.nuviofit.com/... net::ERR_NAME_NOT_RESOLVED` / `failed_to_load_clerk_js`: sign-in and every protected page stop working, while the public pages still load.
   - Development keys load Clerk from `*.clerk.accounts.dev` and work on localhost and `*.vercel.app` with no domain. They show a small "Development mode" badge and have user limits, which is fine for a portfolio demo.
   - On Vercel, set `VITE_CLERK_PUBLISHABLE_KEY` for both Production and Preview, then **redeploy** (`VITE_` variables are baked in at build time).
3. Connect Clerk to Supabase so row level security knows who the user is. The app requests a token with `getToken({ template: "supabase" })`, so either:
   - **Clerk → JWT templates → New → Supabase**, name it `supabase`, and paste your Supabase **JWT secret** (Project settings → API → JWT settings), or
   - use Clerk's native Supabase integration (Supabase → Authentication → Third-party auth → Clerk). If you do this, change `getToken({ template: "supabase" })` to `getToken()` in `src/components/lib/supabaseAuthClient.ts`.

### 3. OpenAI, required for plans and the coach
Create a key at [platform.openai.com](https://platform.openai.com/api-keys) and set `OPENAI_API_KEY`. Set a monthly spend limit on the OpenAI account; see "Before going public" below.

### 4. Brevo (emails), optional
1. Create a free account at [brevo.com](https://www.brevo.com) and an API key (SMTP & API → API keys) for `BREVO_API_KEY`.
2. **Senders → Add a sender** with an address you own and verify it. Without a domain, a Gmail address works for testing, but some inboxes will mark it as spam. Put it in `EMAIL_FROM`.
3. Set `UNSUBSCRIBE_SECRET` to a long random string (`openssl rand -hex 32`).

Brevo may ask for a phone number when you activate the account; that's Brevo's own verification, not something the app needs.

### 5. Deploy to Vercel
1. Import the repo at [vercel.com/new](https://vercel.com/new). It detects Vite; the defaults are fine.
2. Add every variable from `.env.local` under **Settings → Environment Variables**, plus `CRON_SECRET` (any random string) so only Vercel can trigger the monthly email job.
3. Deploy. You get a free `your-project.vercel.app` URL, and email links use it automatically.
4. In Clerk, add that URL to the allowed origins / production instance.

### 6. Custom domain, optional (not set up)
The old `nuviofit.com` domain is not connected. When you buy a domain:
- create a Clerk **Production** instance for it, add the DNS records Clerk lists (including `clerk.yourdomain.com`), and swap in the `pk_live_...` key;
- add it in Vercel (**Settings → Domains**) and set `APP_URL=https://yourdomain.com`;
- authenticate it in Brevo (SPF/DKIM) and switch `EMAIL_FROM` to e.g. `hello@yourdomain.com`;
- update the hardcoded SEO URLs in `index.html` (canonical, Open Graph, JSON-LD);
- update the `contact@nuviofit.com` mailto links in `src/pages/Welcome.tsx` and `src/pages/validation.tsx`.

Until then those SEO tags and contact links still point at nuviofit.com, which only affects link previews and the contact link.

## Before going public

These are known gaps, written down so they're deliberate:

- **`/api/generate` and `/api/sendwelcomeEmails` are not authenticated.** Anyone who finds the URL can spend your OpenAI credits or trigger emails. `/api/generate` caps request size, but the real fix is to send the Clerk session token from the frontend and verify it in the function (`@clerk/backend` → `verifyToken`). Keep an OpenAI spend limit until then.
- **AI chat limits are enforced in the browser** (`messages_left` is decremented client-side). Fine for a demo, not for paid usage; move the check into `/api/generate`.
- **Weekly check-ins share the `onboarding_responses` table.** `analytics-panel.tsx` tries to insert a new row per week, which conflicts with the one-row-per-user design. A separate `checkins` table would fix it.
- **Smartwatch sync and some dashboard modules are mock data / waitlist features**, not real integrations.
- The JS bundle is ~1.6 MB; route-level code splitting would speed up first load.
