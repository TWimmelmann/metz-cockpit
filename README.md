# Metz Cockpit

Salgs-cockpit for Metz A/S new business: pipeline, ordrer med omsætning/DB/DG, kunder, Metz Studio-onboarding, team-projekter og idéer.

- **Frontend:** statisk side (`index.html`, `app.js`, `app.css`) hostet på Vercel. Intet build-trin.
- **Database og login:** Supabase (Postgres + Auth med e-mail-link). `adapter.js` kobler appen til tabellerne, `auth.js` styrer login.
- **Skema:** `supabase/schema.sql` (tabeller, RLS, realtime, rapport-view `order_report`). Kan køres igen uden datatab.

## Adgang
Kun e-mails i tabellen `members` kan logge ind. Lederen tilføjer kolleger under Indstillinger → Team.
Alle ser hele pipelinen; sælgere redigerer egne deals, lederen alle.

## Konfiguration
`config.js` indeholder Supabase-URL og den offentlige publishable key. Brug aldrig service_role-nøglen i frontend.
I Supabase → Authentication → URL Configuration skal sidens adresse stå som Site URL og Redirect URL.
