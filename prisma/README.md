# Database Setup Instructions

## Prerequisites

Before running the database migrations and seed script, you need to configure your database connection.

## Step 1: Set up your .env file

Create a `.env` file in the root of your project (if it doesn't exist) and add your Supabase database URL:

```bash
cp .env.example .env
```

Then edit `.env` and replace the `DATABASE_URL` with your actual Supabase connection string:

```
DATABASE_URL="postgresql://user:password@host:port/database?pgbouncer=true&connection_limit=1"
```

You can find your Supabase connection string in:
1. Go to your Supabase project dashboard
2. Click on "Project Settings" (gear icon)
3. Go to "Database" section
4. Copy the "Connection string" under "Connection pooling" (recommended) or "Direct connection"

## Step 2: Push the schema to your database

Run the following command to create all tables in your Supabase database:

```bash
npm run db:push
```

This will:
- Create all the tables defined in `prisma/schema.prisma`
- Set up indexes and constraints
- Prepare your database for the application

## Step 3: Seed initial data

Run the seed script to populate your database with initial categories and models:

```bash
npm run db:seed
```

This will create:
- **8 Categories**: Writing, Coding, Marketing, Education, Business, Creative, Data Analysis, Research
- **8 Models**: GPT-4, GPT-3.5, Claude 3 Opus, Claude 3 Sonnet, Claude 3 Haiku, Gemini Pro, Llama 3, Mistral

## Available Scripts

- `npm run db:generate` - Generate Prisma Client (run after schema changes)
- `npm run db:push` - Push schema changes to database
- `npm run db:seed` - Seed the database with initial data
- `npm run db:studio` - Open Prisma Studio to view/edit database data

## Troubleshooting

### Connection Issues
- Ensure your DATABASE_URL is correct
- Check that your IP address is allowed in Supabase (Project Settings > Database > Connection pooling)
- Verify your database credentials are correct

### Schema Issues
- If you make changes to `schema.prisma`, run `npm run db:generate` to regenerate the Prisma Client
- Use `npm run db:push` to sync schema changes to the database

## Next Steps

After completing the database setup:
1. Configure your NextAuth environment variables (NEXTAUTH_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET)
2. Run the development server: `npm run dev`
3. Visit http://localhost:3000 to see your application
