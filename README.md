# Ironwood Surface Restoration — website

React + TypeScript + Tailwind + Three.js / React Three Fiber + Framer Motion + GSAP + Supabase.

## Run
```
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

## Editing content
Everything editable — services, comparisons, gallery, testimonials, FAQ, contact details — is in `src/content.ts`.

**Imagery.** Until real project photography is supplied, the site renders procedural stone
interiors (marble, travertine, limestone, granite, tile & grout) in the browser and labels them
"Demonstration image". Add a `photo: '/photos/your-file.jpg'` (or `beforePhoto` / `afterPhoto`)
to any item and drop the file in `public/photos/` — the label disappears automatically.

**Testimonials** are placeholders. Replace them with authentic reviews only.

## Leads (Supabase)
1. Create a project, run `supabase/schema.sql`, and create a **private** storage bucket `project-photos`.
2. Copy `.env.example` → `.env` and fill `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`.
3. Optional email notifications: deploy `supabase/functions/notify-estimate` and set its secrets.

Without configuration the form validates and confirms but only logs the lead to the console.
Spam protection: honeypot field, minimum fill time, and a per-browser rate limit. For production
also consider Cloudflare Turnstile or hCaptcha.
