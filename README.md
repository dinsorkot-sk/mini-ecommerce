# Mini E-Commerce — Nuxt + Nuxt UI + NuxtHub

Mini e-commerce end-to-end: catalog → cart → checkout → orders → admin.

**Stack:** Nuxt 4.5 + Nuxt UI 4.11 + NuxtHub 0.10 (SQLite/Drizzle + Blob + KV) + Tailwind 4 + Zod + @vueuse

## Quick start

```bash
pnpm install
pnpm db:generate   # drizzle-kit generate (already done)
# migrate already applied to .data/hub.db, reseed if needed:
pnpm db:seed
pnpm dev           # http://localhost:3000
```

## Structure

- `app/` — Nuxt UI layouts/pages/components/composables
  - `layouts/default.vue` — shop header (cart badge) + footer + CartDrawer
  - `layouts/admin.vue` — UDashboardGroup/Sidebar
  - `pages/index.vue` — catalog (search/category/sort/pagination)
  - `pages/products/[slug].vue` — detail + add to cart
  - `pages/checkout.vue` — Zod form → POST /api/orders
  - `pages/orders/[orderNo].vue` — thank-you
  - `pages/admin/*` — dashboard/products/orders
  - `composables/useCart.ts` — cart state + localStorage + formatPrice
- `server/` — Nitro + hubDatabase (file .data/hub.db locally, D1/libSQL in prod)
  - `db/schema.ts` — categories/products/orders/order_items/settings
  - `api/products/*`, `api/orders/*`, `api/admin/*`
- `drizzle.config.ts` + `server/db/migrations/`
- `shared/utils/checkout.schema.ts` — shared Zod

## DB

- Prices stored in satang (THB*100), format with `Intl.NumberFormat('th-TH', THB)`
- `pnpm db:seed` seeds 3 categories + 10 products (picsum images)

## Admin

- Login at `/admin/login` (password `NUXT_ADMIN_PASSWORD`, default `admin123`, httpOnly cookie)
- Products CRUD at `/admin/products`, Orders status at `/admin/orders`

## Deploy

- **Local/VPS:** `pnpm build` (node-server) — needs native libsql binding for preview, or just `pnpm dev`
- **Netlify:** set `NETLIFY=true` (preset netlify), env `NUXT_ADMIN_PASSWORD` + `NUXT_HUB_DATABASE_URL` (Turso)
- **Cloudflare:** NuxtHub maps to D1/R2/KV automatically, `nuxthub deploy` or `wrangler`

## Scripts

- `pnpm dev` / `pnpm build` / `pnpm preview` / `pnpm lint` / `pnpm typecheck` / `pnpm db:seed`
