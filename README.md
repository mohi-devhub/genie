# AI Prompt Library

A web application for browsing, submitting, and voting on AI prompts.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with shadcn/ui (New York style, Gray color)
- **API**: tRPC
- **Database**: Supabase (PostgreSQL)
- **ORM**: Prisma
- **Authentication**: NextAuth.js with Google OAuth
- **Form Handling**: react-hook-form with Zod validation

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account and project
- Google OAuth credentials

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables (see next section)

3. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
├── app/                  # Next.js App Router pages
├── components/           # React components
│   └── ui/              # shadcn/ui components
├── lib/                 # Utility functions
│   └── trpc/           # tRPC client/server setup
├── prisma/              # Database schema
└── server/              # Backend code
    ├── api/            # tRPC routers
    ├── auth.ts         # NextAuth configuration
    └── db.ts           # Prisma client
```

## License

MIT
