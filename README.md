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
