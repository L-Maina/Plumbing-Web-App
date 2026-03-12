# Climate Tech Plumbing & Renovators

Professional plumbing services in Nairobi, Kenya.

## Features

- **Online Booking System** - Book plumbing services online
- **Live Chat Support** - AI-powered chat assistant for instant customer support
- **Service Catalog** - Dynamic list of plumbing services
- **Customer Reviews** - Display and manage testimonials
- **Admin Dashboard** - Manage bookings, messages, reviews, and services
- **Newsletter** - Collect and manage email subscribers
- **SMS/Email Notifications** - Booking confirmations via SMS and email

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4, shadcn/ui
- **Database**: Prisma ORM with PostgreSQL (production) / SQLite (local development)
- **Animations**: Framer Motion
- **AI Assistant**: Z.ai
- **SMS**: Africa's Talking
- **Email**: Resend

## Getting Started

### Prerequisites

- Node.js 18+
- Bun (recommended) or npm
- PostgreSQL database (for production/Vercel)

### Local Development (SQLite)

```bash
# Clone the repository
git clone https://github.com/L-Maina/Plumbing-Web-App.git
cd Plumbing-Web-App

# Install dependencies
bun install

# Setup for local development (SQLite)
bun run db:local

# Start development server
bun run dev
```

### Production Setup (PostgreSQL)

For Vercel deployment, you need a PostgreSQL database:

```bash
# Create .env with PostgreSQL URL
DATABASE_URL="postgresql://username:password@host:5432/database?sslmode=require"

# Setup database
bun run db:prod
```

## Environment Variables

Create a `.env` file:

```env
# Database
DATABASE_URL="your_database_url_here"

# SMS notifications (Africa's Talking) - Optional
AFRICASTALKING_API_KEY=your_api_key
AFRICASTALKING_USERNAME=sandbox

# Email notifications (Resend) - Optional
RESEND_API_KEY=your_api_key

# Business info
BUSINESS_NAME=Climate Tech Plumbing
ADMIN_PHONE=+254706605553
ADMIN_EMAIL=your-email@example.com
```

## Deployment to Vercel

### Step 1: Create a PostgreSQL Database

**Option A: Neon (Recommended - Free)**
1. Go to [neon.tech](https://neon.tech) and sign up
2. Create a new project
3. Copy the connection string

**Option B: Vercel Postgres**
1. In your Vercel project, go to Storage
2. Create a Postgres database
3. Copy the connection string

### Step 2: Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Add environment variables:
   - `DATABASE_URL` - Your PostgreSQL connection string
   - `ADMIN_PHONE` - Your admin phone number
   - `ADMIN_EMAIL` - Your admin email
   - `AFRICASTALKING_API_KEY` (optional) - For SMS
   - `RESEND_API_KEY` (optional) - For email

### Step 3: Initialize Database

After deployment, the database will be automatically initialized when you first visit the site, or run:

```bash
vercel env pull .env.local
bun run db:prod
```

## Database Scripts

| Command | Description |
|---------|-------------|
| `bun run db:local` | Setup SQLite for local development |
| `bun run db:prod` | Setup PostgreSQL for production |
| `bun run db:push` | Push schema changes to database |
| `bun run db:generate` | Generate Prisma client |

## Admin Dashboard

Access the admin dashboard by clicking "Admin" in the footer.

Features:
- View and manage bookings
- Respond to customer messages
- Live chat with website visitors
- Manage newsletter subscribers
- View and delete reviews
- Add/remove services
- Update site settings

## Important Notes

- **Local Development**: Uses SQLite (file-based, no setup required)
- **Production (Vercel)**: Requires PostgreSQL (SQLite doesn't work on serverless)
- **AI Chat**: Uses Z.ai with fallback responses if AI is unavailable
- **File Uploads**: Images stored in `public/uploads`. For production, consider cloud storage (Cloudinary, AWS S3)

## License

This project is proprietary. All rights reserved.

---

**Climate Tech Plumbing & Renovators**
📍 Thika Rd, Nairobi, Kenya
📞 0720 219802
🌐 Available 24/7 for emergency services
