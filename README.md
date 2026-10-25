# Heniez Bridal

A boutique bridal website with a working appointment system and an admin panel. It is a ground-up remake of an earlier Laravel version, rebuilt with Next.js and Supabase.

**Live site:** https://heniez-bridal.vercel.app

<!--
Add screenshots after taking them (save in a docs/ folder), then uncomment:

![Home](docs/home.png)
![Collections](docs/collections.png)
![Admin](docs/admin.png)
-->

## What it does

**For visitors**
- Browse the collection and filter by silhouette, material, and collection. Sort by featured, newest, or price.
- Open a gown to see its photos, price in Rupiah, colors, and craftsmanship details.
- Pick a size and color, then continue to the booking form with those choices already filled in.
- Request a private fitting. The request is validated and saved to the database.

**For the boutique owner (`/admin`)**
- Sign in with a protected admin account.
- See new, confirmed, done, and cancelled appointment requests at a glance, change their status, and contact the visitor by email, phone, or WhatsApp.
- Add, edit, hide (draft), and delete gowns, including uploading photos. Changes appear on the public site immediately.

## Tech stack

| Area | Choice |
|---|---|
| Framework | Next.js 14 (App Router, Server Components, Server Actions), TypeScript |
| Styling | Tailwind CSS, Playfair Display and Montserrat via `next/font` |
| Database, auth, files | Supabase (Postgres with Row Level Security, Auth, Storage) |
| Hosting | Vercel |

## Design and engineering decisions

- **Public reads and admin writes are separated.** Visitors read gowns with Supabase's publishable key, and a Row Level Security policy only lets that key see published gowns. Every write happens on the server with the secret key, after an admin check. The secret key never reaches the browser.
- **Admin access is checked in layers.** Supabase Auth handles sign-in, an email allowlist (`ADMIN_EMAILS`) decides who counts as an admin, middleware redirects everyone else, and every admin page and Server Action calls `requireAdmin()` again, because Server Actions can be called directly from outside the UI.
- **Photos upload straight from the browser to Supabase Storage** using one-time signed upload URLs. The server only issues the ticket, so large photos do not hit the request size limit of serverless functions. Photos that are removed, or belong to a deleted gown, are cleaned out of storage.
- **Catalog pages are rendered per request without caching**, so an edit in the admin panel is visible on the public site right away.
- **Forms validate on the server**, keep what the visitor typed when there is an error, and include a honeypot field against basic bots. Date validation uses Jakarta time.
- **Accessibility basics are covered:** skip link, labelled form controls, `aria-current` on navigation, visible keyboard focus, and animations that turn off for visitors who prefer reduced motion.
- **SEO:** per-page titles and descriptions, link previews, an automatic sitemap that follows the database, `robots.txt`, and `Product` structured data on gown pages.

## From the Laravel original to this version

| Original | This version |
|---|---|
| Appointment form posted to a route that did not exist | Requests are validated and stored, and visible in the admin panel |
| Filters and sorting were only visual | Filters and sorting work |
| Size and color choices were not connected to anything | They carry over to the booking form |
| Two separate admin systems | One admin panel |
| Home page was a copy of Collections | A dedicated Home page |
| Product photos on local disk, some images hot-linked | Photos in cloud storage |
| Logout through a GET link and a public admin link | Logout through a POST action, admin hidden from the public header |

## Project structure

```
app/
  page.tsx                  Home
  collections/              Catalog with filters and sort
  products/[slug]/          Gown detail
  appointments/             Booking form and its Server Action
  about/                    About page
  admin/
    login/                  Admin sign in
    (panel)/                Dashboard, appointments, gowns (all protected)
  sitemap.ts, robots.ts     SEO
components/                 UI components (public and admin)
lib/                        Data access, validation, Supabase clients
supabase/                   SQL to create tables, policies, and the photo bucket
middleware.ts               First layer of admin protection
```

## Run it locally

Requires Node.js 18.18 or newer and a free Supabase project.

1. Install dependencies:
   ```bash
   npm install
   ```
2. In Supabase, open the SQL Editor and run `supabase/appointments.sql`, then `supabase/products.sql`.
3. In Supabase, go to Authentication, Users, and create an admin user with an email and password. Turn off public sign-ups.
4. Copy `.env.example` to `.env.local` and fill in the values (see below).
5. Start the dev server:
   ```bash
   npm run dev
   ```
   Open http://localhost:3000. The admin panel is at http://localhost:3000/admin.

### Environment variables

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Publishable key, safe for the browser |
| `SUPABASE_SECRET_KEY` | Secret key, server only. Never commit it |
| `ADMIN_EMAILS` | Comma-separated emails allowed into `/admin` |
| `NEXT_PUBLIC_SITE_URL` | Optional. Public site address for SEO tags, needed once a custom domain is used |

## Known limitations

- The catalog ships with sample gowns (names, prices, and descriptions are placeholders), and some copy, such as consultation length, comes from the original design. Replace them with the boutique's real information through the admin panel.
- Photos from the original project are used as demo images. Use your own or licensed photos for any commercial use.
- There are no automated tests yet.
- New appointment requests are not sent by email. The owner checks the dashboard.
- There is a single admin role.

## Ideas for later

- Email or WhatsApp notification for new appointment requests
- Bahasa Indonesia version of the site
- Wishlist for visitors
- Automated tests for validation and admin actions
- A dedicated 1200 by 630 link-preview image
