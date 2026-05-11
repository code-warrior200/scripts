# Database Setup Guide

This guide will help you set up the Neon PostgreSQL database and run migrations for your Agri-SaaS application.

## Prerequisites

- Node.js 18+ installed
- npm or pnpm package manager
- A free Neon account (sign up at https://neon.tech)

## Step 1: Create a Neon Database

1. Go to [Neon Console](https://console.neon.tech) and sign up/login
2. Click "Create a new project"
3. Give your project a name (e.g., "agri-saas")
4. Choose a region closest to you
5. Click "Create project"

## Step 2: Get Your Connection String

1. In your Neon project dashboard, go to "Connection Details"
2. Copy the connection string (it looks like):
   ```
   postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require
   ```
3. You can also get a direct connection string for migrations by clicking "Connection string" and selecting "Direct connection"

## Step 3: Configure Environment Variables

1. Open the `.env` file in your project root
2. Replace the placeholder `DATABASE_URL` with your Neon connection string:
   ```env
   DATABASE_URL="postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require"
   ```
3. (Optional) For better migration performance, you can also add a direct connection:
   ```env
   DATABASE_URL_DIRECT="postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require"
   ```

## Step 4: Install Dependencies

Make sure all dependencies are installed:

```bash
npm install
```

## Step 5: Generate Prisma Client

Generate the Prisma Client:

```bash
npm run db:generate
```

## Step 6: Push Schema to Database

Push your Prisma schema to the Neon database:

```bash
npm run db:push
```

This will create all the tables (User, Farm, Crop, Subscription, Notification) in your database.

## Step 7: Seed the Database (Optional)

To populate your database with sample data, run:

```bash
npm run db:seed
```

This creates:
- A demo user with email: `demo@agri-saas.com` and password: `password123`
- 3 sample farms
- 4 sample crops
- A free subscription
- 3 sample notifications

## Step 8: Run the Application

Start the development server:

```bash
npm run dev
```

Your application should now be running at `http://localhost:3000` with a fully functional backend!

## Useful Commands

- `npm run db:generate` - Generate Prisma Client
- `npm run db:push` - Push schema changes to database (development)
- `npm run db:migrate` - Create and apply migrations (production)
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Prisma Studio (visual database editor)

## Prisma Studio

To visually browse and edit your database, run:

```bash
npm run db:studio
```

This opens a web interface at `http://localhost:5555` where you can:
- View all tables
- Create, update, and delete records
- Run raw SQL queries

## Troubleshooting

### Connection Issues

If you get connection errors:
1. Verify your connection string is correct
2. Make sure your IP address is not blocked (Neon allows all IPs by default)
3. Check that the database exists in your Neon project

### Migration Errors

If you encounter migration errors:
1. Try resetting the database (caution: deletes all data):
   ```bash
   npx prisma migrate reset
   ```
2. Or manually drop and recreate tables in Neon console

### TypeScript Errors

If you see TypeScript errors about PrismaClient:
1. Make sure you've run `npm run db:generate`
2. Restart your TypeScript server in VS Code

## Production Deployment

For production:
1. Use environment variables in your hosting platform (Vercel, Railway, etc.)
2. Set `NODE_ENV=production`
3. Consider using connection pooling for better performance
4. Use `prisma migrate deploy` instead of `db:push`

## Setting Up Google Authentication

To enable Google OAuth sign-in:

### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project (e.g., "Agri-SaaS")
3. Enable the "Google+ API" (or just use the default APIs)

### 2. Create OAuth Credentials

1. In Google Cloud Console, go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Choose "Web application"
4. Add authorized JavaScript origins:
   - `http://localhost:3000` (development)
   - Your production URL (e.g., `https://your-domain.com`)
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - Your production redirect URI
6. Copy the **Client ID** and **Client Secret**

### 3. Configure Environment Variables

Add the following to your `.env` file:

```env
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"
NEXTAUTH_SECRET="generate-a-random-secret"
NEXTAUTH_URL="http://localhost:3000"
```

To generate a secure `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

### 4. Update Database Schema

After adding Google OAuth, push the updated schema:

```bash
npm run db:push
```

This creates the additional tables needed for NextAuth:
- `Account` - OAuth account links
- `Session` - User sessions
- `VerificationToken` - Email verification

## Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Neon Documentation](https://neon.tech/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Next.js API Routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes)
