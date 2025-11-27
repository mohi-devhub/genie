# Lokha Deployment Guide

This guide covers deploying Lokha to production environments.

## Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Database migrated and seeded
- [ ] Google OAuth credentials configured for production domain
- [ ] NEXTAUTH_URL set to production URL
- [ ] NEXTAUTH_SECRET is a secure random string

## Environment Variables

Ensure all environment variables are set in your deployment platform:

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string (Supabase) | ✅ |
| `NEXTAUTH_SECRET` | Random string for token encryption (min 32 chars) | ✅ |
| `NEXTAUTH_URL` | Your production URL (e.g., https://lokha.tech) | ✅ |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | ✅ |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | ✅ |

## Deployment Options

### Vercel (Recommended)

1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login and deploy
   vercel login
   vercel
   ```

2. **Configure Environment Variables**
   - Go to Project Settings > Environment Variables
   - Add all required variables from the table above
   - Make sure to add them for Production, Preview, and Development

3. **Configure Build Settings**
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Install Command: `npm install`

4. **Post-Deployment**
   - Update `NEXTAUTH_URL` to your Vercel domain
   - Add Vercel domain to Google OAuth authorized redirect URIs

### Railway

1. **Create Project**
   - Connect your GitHub repository
   - Railway will auto-detect Next.js

2. **Add Environment Variables**
   - Go to Variables tab
   - Add all required environment variables

3. **Database**
   - Use the existing Supabase database
   - Or provision a Railway PostgreSQL database

### Docker

```dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

# Production stage
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

To deploy with Docker:
```bash
# Build image
docker build -t lokha .

# Run container
docker run -p 3000:3000 \
  -e DATABASE_URL="your-database-url" \
  -e NEXTAUTH_SECRET="your-secret" \
  -e NEXTAUTH_URL="https://lokha.tech" \
  -e GOOGLE_CLIENT_ID="your-client-id" \
  -e GOOGLE_CLIENT_SECRET="your-client-secret" \
  lokha
```

## Database Setup

### Supabase Configuration

1. **Connection Pooling (Recommended for Production)**
   - Use port `6543` with `?pgbouncer=true` parameter
   - Example: `postgresql://postgres:password@db.xxx.supabase.co:6543/postgres?pgbouncer=true`

2. **Run Migrations**
   ```bash
   npx prisma db push
   ```

3. **Seed Data (Optional)**
   ```bash
   npx prisma db seed
   ```

### Row Level Security (RLS)

If using Supabase with RLS enabled, run the migration:
```sql
-- Located in prisma/migrations/enable_rls.sql
```

## Google OAuth Configuration

### Production Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)

2. **Update OAuth Consent Screen**
   - Add your production domain to authorized domains
   - Submit for verification if needed

3. **Update OAuth Client**
   - Add authorized JavaScript origins:
     - `https://lokha.tech`
   - Add authorized redirect URIs:
     - `https://lokha.tech/api/auth/callback/google`

## Security Checklist

- [x] HTTPS enforced (automatic on Vercel/Railway)
- [x] Security headers configured in `next.config.mjs`
- [x] Environment variables validated on startup
- [x] Rate limiting implemented
- [x] Input validation with Zod
- [x] CSRF protection via NextAuth
- [ ] Regular dependency updates
- [ ] Monitoring and error tracking setup

## Performance Optimization

### Database

- Use connection pooling (Supabase port 6543)
- Add indexes for frequently queried fields (already configured)
- Consider read replicas for high traffic

### Next.js

- Image optimization configured for Google avatars
- Compression enabled
- Static pages generated at build time where possible

### Caching

Consider adding caching for:
- Category and Model lists (rarely change)
- Popular prompts (with revalidation)

## Monitoring

### Recommended Tools

- **Error Tracking**: Sentry, LogRocket
- **Performance**: Vercel Analytics, Web Vitals
- **Uptime**: UptimeRobot, Better Uptime

### Setting Up Sentry

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

## Troubleshooting

### Common Issues

1. **"Invalid redirect_uri" from Google OAuth**
   - Ensure `NEXTAUTH_URL` matches exactly with Google Console settings
   - Check for trailing slashes
   - Verify the callback URL is added: `{NEXTAUTH_URL}/api/auth/callback/google`

2. **Database connection errors**
   - Check `DATABASE_URL` is correct
   - Verify IP allowlist in Supabase if enabled
   - Use connection pooling for serverless environments

3. **Build failures**
   - Ensure all environment variables are set
   - Run `npx prisma generate` before build

4. **Session not persisting**
   - Verify `NEXTAUTH_SECRET` is set
   - Check database connection for session storage

### Getting Help

- Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for common issues
- Open an issue on GitHub
- Review Next.js and NextAuth.js documentation

## Maintenance

### Regular Tasks

- Update dependencies monthly: `npm update`
- Security audit: `npm audit`
- Database backups via Supabase dashboard
- Monitor error logs and fix issues promptly

### Updating

```bash
# Pull latest changes
git pull origin main

# Install dependencies
npm install

# Run migrations if schema changed
npx prisma db push

# Deploy
vercel --prod  # or your deployment method
```
