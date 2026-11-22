# DRK Hospital Website Starter

Starter project for the DRK Hospital public website and a small gallery-management admin area.

## Included
- Home, About Us, Services, Gallery and Contact pages
- Responsive navigation and footer
- Official supplied DRK logo copied unchanged to `public/images/drk-logo.png`
- Admin route placeholders for login and gallery management
- Supabase client helper and environment variable template
- Navy, blue, turquoise and white design tokens

## Requirements
- Node.js 20.9 or newer
- npm

## Run locally
```bash
npm install
cp .env.example .env.local
npm run dev
```
Open http://localhost:8000 for the public website (and http://localhost:3001 for the private admin portal).

The public pages run without Supabase configuration. Supabase is only needed when implementing real admin authentication and image uploads.

## Supabase setup (next implementation step)
1. Create a Supabase project.
2. Add the project URL and anon key to `.env.local`.
3. Create a private `gallery` storage bucket or a public bucket according to the final publishing policy.
4. Create a `gallery_images` table with: `id`, `title`, `caption`, `category`, `storage_path`, `public_url`, `created_at`.
5. Enable Row Level Security. Only authenticated admin users should be allowed to insert, update or delete gallery records and files.
6. Add server-side authorization checks before building the upload, edit and delete actions.

## Important
- The logo asset is the original uploaded image; it is not recreated or recoloured.
- Phone numbers, address, opening hours, doctor details, treatments and hospital claims are placeholders and must be replaced with verified DRK information.
- This starter does not include appointment booking, patient accounts, billing or hospital ERP.
- Do not expose a Supabase service-role key in browser code.
# drkhospitals-public-website
# public-hospital-website
