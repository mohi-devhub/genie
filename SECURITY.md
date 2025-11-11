# Security Policy

## Overview

This document outlines the security measures implemented in the Genie application.

## Security Features Implemented

### 1. Row Level Security (RLS)

Row Level Security is enabled on all Supabase tables to ensure data access is properly controlled at the database level.

#### Setup Instructions

Run the SQL script in your Supabase SQL Editor:
```bash
# Copy the contents of prisma/migrations/enable_rls.sql
# Paste and execute in Supabase Dashboard > SQL Editor
```

#### RLS Policies

**User Table:**
- Users can only view and update their own data
- Prevents unauthorized access to user information

**Prompt Table:**
- Public read access (anyone can view prompts)
- Only authenticated users can create prompts
- Users can only update/delete their own prompts

**Vote Table:**
- Public read access (for vote counts)
- Only authenticated users can vote
- Users can only modify their own votes
- Users cannot vote on their own prompts

**Category & Model Tables:**
- Public read-only access
- No write access (managed by admins only)

### 2. Authentication & Authorization

**NextAuth.js with Google OAuth:**
- Secure authentication flow
- Database session strategy for better security
- Session tokens stored securely in database
- CSRF protection built-in

**Protected Procedures:**
- tRPC protected procedures require authentication
- Unauthorized requests return 401 error
- Session validation on every protected request

### 3. Input Validation

**Zod Schema Validation:**
- All user inputs are validated before processing
- Title: 1-200 characters, trimmed
- Prompt text: 10-5000 characters, trimmed
- IDs validated as CUIDs
- Prevents injection attacks and malformed data

**Database Validation:**
- Foreign key constraints ensure referential integrity
- Unique constraints prevent duplicate votes
- Category and model existence verified before prompt creation

### 4. Rate Limiting

**Prompt Creation:**
- Maximum 10 prompts per hour per user
- Prevents spam and abuse
- Configurable limit in code

**Recommendation:** Add rate limiting middleware for API routes in production

### 5. Data Sanitization

**Input Trimming:**
- All text inputs are trimmed to remove leading/trailing whitespace
- Prevents whitespace-based attacks

**Output Sanitization:**
- Sensitive user data (email, tokens) excluded from API responses
- Only necessary fields exposed in queries

### 6. Business Logic Security

**Vote Restrictions:**
- Users cannot vote on their own prompts
- One vote per user per prompt (enforced by unique constraint)
- Vote changes are atomic (no race conditions)

**Prompt Ownership:**
- Prompts are tied to authenticated user IDs
- Only authors can modify their prompts
- Deletion cascades properly to maintain data integrity

### 7. Environment Security

**Environment Variables:**
- Sensitive credentials stored in .env (not committed)
- .env.example provided without actual secrets
- Database URLs and OAuth secrets properly secured

**Recommended Production Settings:**
```env
# Use strong, randomly generated secrets
NEXTAUTH_SECRET="<generate with: openssl rand -base64 32>"

# Use production URLs
NEXTAUTH_URL="https://yourdomain.com"

# Restrict OAuth redirect URIs in Google Console
```

## Security Best Practices

### For Developers

1. **Never commit .env files** - Use .env.example for templates
2. **Validate all inputs** - Use Zod schemas for type safety
3. **Use protected procedures** - Require authentication for sensitive operations
4. **Test RLS policies** - Verify policies work as expected in Supabase
5. **Keep dependencies updated** - Regularly update npm packages

### For Deployment

1. **Enable HTTPS** - Always use SSL/TLS in production
2. **Set secure headers** - Use Next.js security headers
3. **Configure CORS** - Restrict API access to your domain
4. **Monitor logs** - Track suspicious activity
5. **Backup database** - Regular automated backups in Supabase

### For Users

1. **Use strong passwords** - For Google account (OAuth provider)
2. **Enable 2FA** - On Google account for added security
3. **Review permissions** - Check what data the app requests
4. **Report issues** - Contact maintainers if you find vulnerabilities

## Known Limitations

1. **No email verification** - Currently relies on Google OAuth only
2. **No admin panel** - Category/Model management requires direct DB access
3. **Basic rate limiting** - Consider adding Redis-based rate limiting for production
4. **No content moderation** - Prompts are not automatically screened

## Reporting Security Issues

If you discover a security vulnerability, please email: [your-email@example.com]

**Please do not:**
- Open public GitHub issues for security vulnerabilities
- Disclose the vulnerability publicly before it's fixed

**Please include:**
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

## Security Checklist for Production

- [ ] Enable RLS in Supabase (run enable_rls.sql)
- [ ] Set strong NEXTAUTH_SECRET
- [ ] Configure production NEXTAUTH_URL
- [ ] Restrict Google OAuth redirect URIs
- [ ] Enable HTTPS/SSL
- [ ] Set up database backups
- [ ] Configure security headers in Next.js
- [ ] Set up monitoring and logging
- [ ] Review and test all RLS policies
- [ ] Implement additional rate limiting (Redis)
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Configure CORS properly
- [ ] Review and minimize exposed API endpoints

## Updates

This security policy is reviewed and updated regularly. Last updated: 2024

## License

This security policy is part of the Genie project and follows the same license.
