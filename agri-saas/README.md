# AgriSaaS

A full-stack Next.js / React agriculture SaaS dashboard with a PostgreSQL database backend.

## Features

- 🏭 **Farm Management** - CRUD operations for farms
- 🌾 **Crop Tracking** - Monitor crops across farms
- 🔐 **Authentication** - User signup and login
- 💳 **Subscriptions** - Billing and subscription management
- 🔔 **Notifications** - Alerts and updates system
- 📊 **Analytics** - Yield trends and farm health metrics

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (via Neon - free tier)
- **ORM**: Prisma
- **Authentication**: bcryptjs for password hashing

## Quick Start

### Prerequisites

- Node.js 18+
- npm or pnpm
- A free Neon database account (see [SETUP_DATABASE.md](./SETUP_DATABASE.md))

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Database

Follow the detailed instructions in [SETUP_DATABASE.md](./SETUP_DATABASE.md) to:

1. Create a free Neon PostgreSQL database
2. Configure your `.env` file with the connection string
3. Push the schema to the database
4. (Optional) Seed with sample data

Quick version:

```bash
# Copy .env.example to .env and add your Neon connection string
# Then run:
npm run db:generate
npm run db:push
npm run db:seed
```

### 3. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Demo Credentials

After seeding, you can log in with:
- **Email**: demo@agri-saas.com
- **Password**: password123

## Project Structure

```
agri-saas/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── farms/        # Farm CRUD operations
│   │   ├── crops/        # Crop CRUD operations
│   │   ├── subscribe/    # Subscription management
│   │   └── notifications/# Notification system
│   ├── dashboard/        # Dashboard page
│   ├── farms/            # Farms management page
│   ├── crops/            # Crops tracking page
│   ├── settings/         # User settings
│   ├── login/            # Login page
│   └── signup/           # Signup page
├── components/           # Reusable React components
├── lib/
│   ├── data.ts          # Type definitions and sample data
│   └── prisma.ts        # Prisma client instance
├── prisma/
│   ├── schema.prisma    # Database schema
│   ├── seed.ts          # Database seeding script
│   └── migrations/      # Database migrations
└── public/              # Static assets
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - User login
- `GET /api/auth/me?email=...` - Get current user

### Farms
- `GET /api/farms` - List all farms (optionally filter by userId)
- `POST /api/farms` - Create new farm
- `GET /api/farms/[id]` - Get farm details
- `PATCH /api/farms/[id]` - Update farm
- `DELETE /api/farms/[id]` - Delete farm

### Crops
- `GET /api/crops` - List crops (optionally filter by farmId or userId)
- `POST /api/crops` - Create new crop
- `GET /api/crops/[id]` - Get crop details
- `PATCH /api/crops/[id]` - Update crop
- `DELETE /api/crops/[id]` - Delete crop

### Subscriptions
- `GET /api/subscribe?userId=...` - Get user subscription
- `POST /api/subscribe` - Update subscription plan

### Notifications
- `GET /api/notifications?userId=...&unreadOnly=true` - List notifications
- `POST /api/notifications` - Create notification

## Database Commands

- `npm run db:generate` - Generate Prisma Client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Create and apply migrations
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Prisma Studio (visual database editor)

## Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://username:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require"
```

See [SETUP_DATABASE.md](./SETUP_DATABASE.md) for detailed setup instructions.

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Type check
npm run typecheck

# Build for production
npm run build

# Start production server
npm start
```

## Deployment

This application can be deployed to:
- **Vercel** (recommended) - Seamless Next.js deployment
- **Railway** - Easy database and app hosting
- **AWS/Google Cloud** - Traditional cloud deployment

Make sure to set the `DATABASE_URL` environment variable in your hosting platform.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT
