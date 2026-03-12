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
- **Database**: Prisma ORM with PostgreSQL
- **Animations**: Framer Motion
- **AI Assistant**: Z.ai
- **SMS**: Africa's Talking
- **Email**: Resend

## Getting Started

### Prerequisites

- Node.js 18+
- Bun (recommended) or npm
- PostgreSQL database (Neon, Supabase, or Vercel Postgres)

### Local Development

```bash
# Clone the repository
git clone https://github.com/L-Maina/Plumbing-Web-App.git
cd Plumbing-Web-App

# Install dependencies
bun install

# Setup environment variables
cp .env.example .env
# Edit .env with your database URL and API keys

# Initialize database
bun run db:push

# Start development server
bun run dev
```

### Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# Database (PostgreSQL)
DATABASE_URL="postgresql://username:password@host:5432/database?sslmode=require"

# SMS notifications (Africa's Talking)
AFRICASTALKING_API_KEY=your_api_key
AFRICASTALKING_USERNAME=sandbox

# Email notifications (Resend)
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
3. Copy the connection string from the dashboard

**Option B: Vercel Postgres**
1. In your Vercel project, go to Storage
2. Create a Postgres database
3. Copy the connection string

**Option C: Supabase**
1. Go to [supabase.com](https://supabase.com) and sign up
2. Create a new project
3. Get the database connection string from Settings > Database

### Step 2: Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Add environment variables:
   - `DATABASE_URL` - Your PostgreSQL connection string
   - `AFRICASTALKING_API_KEY` - (optional) For SMS notifications
   - `AFRICASTALKING_USERNAME` - (optional) Africa's Talking username
   - `RESEND_API_KEY` - (optional) For email notifications
   - `ADMIN_PHONE` - Your admin phone number
   - `ADMIN_EMAIL` - Your admin email

### Step 3: Initialize Database

After deployment, run the database migration:

```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Link to your project
vercel link

# Pull environment variables
vercel env pull .env.local

# Run database push
bun run db:push
```

Or use Vercel's dashboard to run commands in the deployment terminal.

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

- **Database**: This app requires PostgreSQL. SQLite is not supported on Vercel.
- **AI Chat**: Uses Z.ai for intelligent customer support. Falls back to predefined responses if AI is unavailable.
- **File Uploads**: Images are stored in the `public/uploads` folder. For production, consider using a cloud storage service like Cloudinary or AWS S3.

## License

This project is proprietary. All rights reserved.

---

**Climate Tech Plumbing & Renovators**  
📍 Thika Rd, Nairobi, Kenya  
📞 0720 219802  
🌐 Available 24/7 for emergency services
