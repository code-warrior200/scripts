# AgriSaaS

A Next.js / React prototype for an agriculture SaaS dashboard.

## Run locally

1. Open a terminal in `scripts/agri-saas`
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open `http://localhost:3000`

## What is included

- `app/` layout and pages: Home, Dashboard, Farms, Crops, Settings
- `components/` reusable UI components
- `app/api/` routes for farm, crop, and subscription data
- `lib/data.ts` seeded farm and crop sample data

## Next steps

- Add a real database or Prisma schema
- Add authentication
- Connect weather or IoT telemetry APIs
- Add billing and subscription management
