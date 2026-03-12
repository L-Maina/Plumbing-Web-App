# Climate Tech Plumbing & Renovators Website

A modern, fully-functional website for Climate Tech Plumbing and Renovators, a Nairobi-based plumbing company.

## Features

### Frontend
- **Modern UI**: Built with Next.js 16, TypeScript, Tailwind CSS, and shadcn/ui
- **Responsive Design**: Mobile-first approach with smooth animations using Framer Motion
- **SEO Optimized**: Meta tags, Open Graph, Twitter Cards, and local SEO for Nairobi, Kenya

### Sections
- **Hero Section**: Eye-catching landing with company tagline and CTAs
- **About Section**: Company story, team photos, and values
- **Services Section**: All plumbing services with images and descriptions
- **Stats Section**: Key metrics and achievements
- **Why Choose Us**: Trust factors and differentiators
- **Booking System**: Online booking form with date/time selection
- **Reviews System**: Customer reviews with star ratings
- **FAQ Section**: Common questions and answers
- **Contact Section**: Contact form with embedded Google Map
- **Newsletter**: Email subscription for updates

### Backend Features
- **Booking API**: Create and manage service bookings
- **Reviews API**: Submit and display customer reviews
- **Contact API**: Handle contact form submissions
- **Newsletter API**: Manage email subscriptions
- **Live Chat**: Real-time chat using Socket.io

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Database**: Prisma ORM with SQLite
- **Real-time**: Socket.io for live chat
- **Animations**: Framer Motion

## Getting Started

### Prerequisites
- Node.js 18+ or Bun
- npm, yarn, or bun package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd climate-tech-plumbing
```

2. Install dependencies:
```bash
bun install
```

3. Set up the database:
```bash
bun run db:push
```

4. Start the development server:
```bash
bun run dev
```

5. Start the chat service (in a separate terminal):
```bash
cd mini-services/chat-service
bun run dev
```

6. Open http://localhost:3000 in your browser

## Production Deployment

### Option 1: Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Vercel will automatically detect Next.js and deploy
4. Set environment variables in Vercel dashboard

### Option 2: Docker

1. Build the Docker image:
```bash
docker build -t climate-tech-plumbing .
```

2. Run the container:
```bash
docker run -p 3000:3000 climate-tech-plumbing
```

### Option 3: Traditional Hosting

1. Build the application:
```bash
bun run build
```

2. Start the production server:
```bash
bun run start
```

## Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="file:./db/custom.db"
```

## Project Structure

```
├── public/
│   └── images/          # Generated images
├── src/
│   ├── app/
│   │   ├── api/         # API routes
│   │   ├── layout.tsx   # Root layout
│   │   └── page.tsx     # Main page
│   ├── components/
│   │   ├── sections/    # Page sections
│   │   ├── ui/          # UI components
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   └── live-chat.tsx
│   └── lib/
│       └── db.ts        # Database client
├── mini-services/
│   └── chat-service/    # Socket.io chat service
├── prisma/
│   └── schema.prisma    # Database schema
└── package.json
```

## API Endpoints

- `GET /api/bookings` - List all bookings
- `POST /api/bookings` - Create a booking
- `GET /api/reviews` - List approved reviews
- `POST /api/reviews` - Submit a review
- `POST /api/contact` - Send contact message
- `POST /api/newsletter` - Subscribe to newsletter

## Services Offered

1. Plumbing Installation
2. Pipe Repairs & Maintenance
3. Water Heater Services
4. Bathroom Renovations
5. Emergency Plumbing (24/7)
6. Urinal Installation
7. Flush Valve Services
8. Paving Slab Repairs
9. Cold Water Connections
10. Waste Outlet & Trap Installation
11. General Renovations

## Contact Information

- **Address**: Thika Rd, Nairobi, Kenya
- **Phone**: 0720 219802
- **Website**: https://www.climate-tech.co.ke
- **Hours**: Open 24/7

## License

This project is proprietary to Climate Tech Plumbing & Renovators.
