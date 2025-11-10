# AI Prompt Library

A community-driven web application for discovering, sharing, and voting on AI prompts. Features an animated landing page for guests and a full-featured prompt gallery for authenticated users.

## Features

- 🎨 **Animated Landing Page** - Rotating prompt previews and auto-scrolling showcase for non-authenticated users
- 🔐 **Google OAuth Authentication** - Secure sign-in with automatic redirect to prompt gallery
- 📚 **Prompt Gallery** - Browse, filter, and sort prompts by category, model, and popularity
- ⬆️ **Voting System** - Upvote and downvote prompts to surface the best content
- ✍️ **Submit Prompts** - Share your own AI prompts with the community
- 🎯 **Smart Filtering** - Filter by category (Writing, Coding, Marketing, etc.) and AI model (GPT-4, Claude, Gemini, etc.)
- 📊 **Top & New Sorting** - View newest prompts or top-rated ones (with positive votes only)
- 🎭 **Authentication-Gated UI** - Separate experiences for guests and authenticated users
- 🚀 **Demo Data** - Pre-seeded with 8 realistic prompts and vote distributions

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with shadcn/ui (New York style, Gray color) + JetBrains Mono font
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

2. Set up environment variables (see Environment Variables section below)

3. Set up the database:
```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

**Note**: You must configure all environment variables before the application will work properly. The app requires a valid database connection and Google OAuth credentials.

### Environment Variables

Create a `.env` file in the root directory based on `.env.example`:

```bash
cp .env.example .env
```

Then update the following variables:

#### Database URL
Get your Supabase connection string from your project settings:
1. Go to your Supabase project dashboard
2. Navigate to Settings > Database
3. Copy the Connection String (URI format)
4. Replace `[YOUR-PASSWORD]` with your database password

```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
```

#### NextAuth Secret
Generate a secure random secret:
```bash
openssl rand -base64 32
```

Set the URL to your production domain when deploying:
```env
NEXTAUTH_SECRET="your-generated-secret"
NEXTAUTH_URL="http://localhost:3000"
```

#### Google OAuth Credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new OAuth 2.0 Client ID (or use an existing one)
3. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
4. For production, add your production URL as well
5. Copy the Client ID and Client Secret

```env
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"
```

## User Experience

### For Non-Authenticated Users (Landing Page)
- View animated hero section with rotating prompt previews
- See auto-scrolling showcase of demo prompts (15-second loop)
- Click "Sign in to View All Prompts" to authenticate with Google
- Automatically redirected to `/prompts` after sign-in

### For Authenticated Users (Prompt Gallery)
- Browse all prompts at `/prompts` (auto-redirected from home)
- Filter prompts by category and AI model
- Sort by "New" (most recent) or "Top" (highest voted)
- Vote on prompts (upvote/downvote)
- Submit new prompts via dialog
- View vote scores and prompt details

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:seed` - Seed database with demo data
- `npm run db:studio` - Open Prisma Studio (database GUI)

## Project Structure

```
├── app/
│   ├── page.tsx              # Landing page (redirects if authenticated)
│   ├── prompts/page.tsx      # Prompt gallery (protected route)
│   ├── layout.tsx            # Root layout with providers
│   └── globals.css           # Global styles and animations
├── components/
│   ├── LandingHero.tsx       # Animated hero section
│   ├── PromptShowcase.tsx    # Auto-scrolling demo prompts
│   ├── PromptGallery.tsx     # Main prompt browsing interface
│   ├── PromptCard.tsx        # Individual prompt display
│   ├── SubmitPromptDialog.tsx # Prompt submission form
│   ├── VoteControl.tsx       # Upvote/downvote buttons
│   ├── Header.tsx            # Navigation header
│   ├── LoginButton.tsx       # Auth button/avatar
│   └── ui/                   # shadcn/ui components
├── lib/
│   ├── auth/                 # NextAuth session provider
│   └── trpc/                 # tRPC client/server setup
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── seed.ts               # Demo data seeder
└── server/
    ├── api/routers/
    │   ├── prompt.ts         # Prompt CRUD & voting
    │   ├── category.ts       # Category queries
    │   └── model.ts          # Model queries
    ├── auth.ts               # NextAuth configuration
    └── db.ts                 # Prisma client
```

## Database Schema

- **User** - NextAuth user accounts
- **Prompt** - User-submitted prompts with title, text, category, and model
- **Vote** - Upvotes/downvotes on prompts (one per user per prompt)
- **Category** - Prompt categories (Writing, Coding, Marketing, etc.)
- **Model** - AI models (GPT-4, Claude, Gemini, etc.)

## License

MIT
