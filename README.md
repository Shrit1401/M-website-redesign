# Revive Skills — frontend demo

A frontend-only e-learning platform (like Udemy) for [reviveskills.com](https://reviveskills.com). There is no backend: all data lives in `localStorage`, and the app starts with sample data in `src/data/seed.ts`.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
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

Stack: React 19, TypeScript, Vite, Tailwind CSS v4, React Router, lucide-react.

SPA fallback configs are included for Netlify (`public/_redirects`) and Vercel (`vercel.json`).
