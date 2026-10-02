# Revive Skills — frontend demo

A frontend-only e-learning platform (like Udemy) for [reviveskills.com](https://reviveskills.com), built with Next.js. There is no backend yet: all data lives in `localStorage`, and the app starts with sample data in `src/data/seed.ts`.

The plan for adding Prisma + PostgreSQL is in [`docs/nextjs-migration/`](docs/nextjs-migration/README.md).

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build in .next/
npm start        # serve the production build
```

## Demo accounts (password `demo123`)

| Role        | Email               |
|-------------|---------------------|
| Student     | student@revive.dev  |
| Tutor       | tutor@revive.dev    |
| Super admin | admin@revive.dev    |

The login page also has one-click demo buttons.

## What's inside

- **Public:** home, catalogue (search/filter/sort), course detail with curriculum + previews, about, teach, contact. Logged-out visitors never see pricing or account pages.
- **Student:** dashboard, my learning, course player (video / reading / quiz, progress tracking, notes, certificate), wishlist, cart + mock checkout, purchases, account.
- **Tutor:** earnings + analytics, course list, 4-step course builder with a curriculum editor and live preview, students, payouts, profile.
- **Super admin:** platform KPIs, user management (roles, suspend, delete, invite), course moderation (approve/reject/feature/unpublish), categories, payments + refunds, settings, reset demo data.
- Brand: Revive blue/navy (matches the reviveskills.com logo), Plus Jakarta Sans, light/dark theme, responsive down to 360px.
- Assets: logo, favicon and OG image in `public/assets/`; course, instructor and hero photos in `public/img/` (from Unsplash — swap in your own before launch).

Stack: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, lucide-react.

Layout: routes in `src/app/`, screens in `src/views/`, shared UI in `src/components/`. `src/lib/router.tsx` maps React Router–style hooks onto `next/navigation`.
