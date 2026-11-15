# Grantly

Grantly is a scholarship platform for students. It brings discovery, eligibility checks, applications and deadlines into one place, so students spend less time jumping between portals.

> All scholarships, providers and amounts in this app are fictional sample data. They are not real offers.

Built for THE OUTPOST, a 6-hour frontend hackathon by Frontend Arena.

> **How this was made:** Grantly was vibe coded. I described what I wanted to an AI coding tool and iterated on the result, rather than writing every line by hand. Expect rough edges, and review the code before relying on it for anything serious.

## Features

- **Discover:** search and filter scholarships by level, field, country, amount, deadline and more. Filters are kept in the URL.
- **Understand:** a match score and a "Do I qualify?" breakdown for each scholarship, with plain-language reasons.
- **Apply:** step-by-step application guides, document checklists and time estimates.
- **Track:** a board with Saved, Preparing, Submitted and Decision columns. Drag and drop, or use the "Move to" menu. Notes and checklists save automatically.
- **Calendar:** upcoming deadlines, with `.ics` export for Google, Apple and Outlook calendars.
- **Compare:** up to three scholarships side by side.
- **Light and dark themes**, and a `Cmd/Ctrl+K` command palette.

Your profile, saved scholarships and applications stay in your browser's local storage. There is no account and no backend.

## Tech stack

- React 19 and Vite, with TypeScript in strict mode
- Tailwind CSS v4
- React Router, Zustand (with persistence), dnd-kit, date-fns, Motion, lucide-react
- Vercel Analytics, loaded only after cookie consent

## Getting started

Requires Node.js 18 or newer.

```bash
npm install
npm run dev        # dev server on http://localhost:3000
npm run build      # production build into dist/
npm run preview    # serve the production build locally
npm run lint       # TypeScript type check
```

Run the matching unit tests:

```bash
npx tsx -e "import { runMatchingUnitTests } from './src/lib/matching.test'; console.log(runMatchingUnitTests());"
```

## Environment variables

Copy `.env.example` to `.env.local` and fill in the values. Never commit `.env.local`.

| Variable | Purpose |
|---|---|
| `GEMINI_API_KEY` | Gemini API key, if the app calls Gemini. Keep it out of client code. |
| `APP_URL` | The URL the app is hosted at, used for self-referential links. |

## Deployment

**Vercel:** import the repository, keep the Vite preset (build command `npm run build`, output `dist`), add any environment variables, and deploy. `vercel.json` rewrites all routes to `index.html`, so refreshing a deep link like `/tracker` works. Turn on Web Analytics in the project settings.

**Netlify:** `public/_redirects` does the same job.

## How matching works

`src/lib/matching.ts` computes a score from 0 to 100:

1. **Citizenship and residency (25%):** if a scholarship is limited to certain countries and you are outside them, it is a hard disqualifier and the score is capped.
2. **Degree stage (25%):** compares your level (high school, undergraduate, postgraduate, PhD). A mismatch is a hard disqualifier.
3. **Field of study (20%):** matches your field against the scholarship's fields. Open programs count as a full match.
4. **GPA (15%):** converts foreign grading scales to a 4.0 baseline. Applicants within 0.2 of the minimum get a "Check" note. No minimum means full points.
5. **Need and interests (15%):** financial need alignment, plus a bonus for matching interest tags.

## Project structure

```text
src/
├── config/site.ts        # Brand, contact details and site-wide text
├── types/index.ts        # Scholarship, profile and application types
├── data/scholarships.ts  # 50 fictional sample scholarships
├── lib/
│   ├── matching.ts       # Match scoring (pure functions)
│   ├── matching.test.ts  # Unit tests
│   ├── dates.ts          # Deadline logic and .ics export
│   ├── store.ts          # Zustand store with persistence
│   └── api.ts            # Data layer with simulated latency
├── components/           # ui/, layout/, scholarship/, tracker/
├── pages/                # One file per route
├── App.tsx               # Routes, error boundary, shell
└── main.tsx              # Entry point
public/                   # Favicon, OG image, robots.txt, sitemap.xml, manifest
```

## Accessibility

- Semantic landmarks and one `<h1>` per page, with focus moved to it on route change.
- Every feature works with the keyboard, including drag and drop (which also has a button alternative).
- Status is never shown by color alone, and visible focus rings are kept.
- Layout works from 320px wide up to desktop. Respects reduced-motion preferences.

## Limitations

- Sample data only. The scholarships are fictional.
- Data lives in one browser's local storage and does not sync between devices.
- The privacy policy and terms are templates for this demo, not legal advice.

## Use it freely

This project is open for anyone to use. You are free to copy it, modify it, build on it and use it for your own projects, personal or commercial. Credit is appreciated but not required. It comes as is, with no warranty.

## Author

Shubham Kunwar Tiwary
