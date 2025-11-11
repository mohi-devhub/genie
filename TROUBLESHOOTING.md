# Troubleshooting Guide

## Google OAuth Error: "The server cannot process the request because it is malformed"

This error typically occurs due to OAuth configuration issues. Follow these steps to resolve it.

### Solution 1: Fix Redirect URI in Google Console (Most Common)

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/apis/credentials
   - Select your project

2. **Find Your OAuth 2.0 Client ID**
   - Look for the client ID that matches your `GOOGLE_CLIENT_ID` in `.env`
   - Click on it to edit

3. **Check Authorized Redirect URIs**
   - Under "Authorized redirect URIs", you should see:
     ```
     http://localhost:3000/api/auth/callback/google
     ```
   
4. **Common Mistakes to Avoid:**
   - ❌ `http://localhost:3000/api/auth/callback/google/` (trailing slash)
   - ❌ `https://localhost:3000/api/auth/callback/google` (https instead of http)
   - ❌ `http://localhost:3000/api/auth/callback` (missing /google)
   - ❌ Extra spaces before or after the URL
   - ✅ `http://localhost:3000/api/auth/callback/google` (correct)

5. **Save and Wait**
   - Click "Save"
   - Wait 5-10 minutes for changes to propagate
   - Clear your browser cache
   - Try signing in again

### Solution 2: Verify Environment Variables

Check your `.env` file has all required variables:

```bash
# Check if all variables are set
cat .env | grep -E "^(GOOGLE_CLIENT_ID|GOOGLE_CLIENT_SECRET|NEXTAUTH_URL|NEXTAUTH_SECRET)="
```

**Required format:**
```env
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-generated-secret"
```

**Common issues:**
- Missing quotes around values
- Extra newlines in the middle of values
- Spaces before or after the `=` sign
- Using single quotes instead of double quotes

### Solution 3: Regenerate OAuth Credentials

If the above doesn't work, create new credentials:

1. **In Google Cloud Console:**
   - Go to Credentials page
   - Click "Create Credentials" > "OAuth 2.0 Client ID"
   - Choose "Web application"
   - Name it (e.g., "Genie Local Dev")

2. **Add Authorized Redirect URI:**
   ```
   http://localhost:3000/api/auth/callback/google
   ```

3. **Copy New Credentials:**
   - Copy the Client ID
   - Copy the Client Secret
   - Update your `.env` file

4. **Restart Dev Server:**
   ```bash
   # Stop the server (Ctrl+C)
   npm run dev
   ```

### Solution 4: Check OAuth Consent Screen

1. **Go to OAuth Consent Screen:**
   - https://console.cloud.google.com/apis/credentials/consent

2. **Verify Settings:**
   - User Type: External (for testing)
   - App name: Set
   - User support email: Set
   - Developer contact: Set

3. **Add Test Users (if in Testing mode):**
   - Click "Add Users"
   - Add your Google email address
   - Save

### Solution 5: Enable Required APIs

Ensure these APIs are enabled:

1. **Go to API Library:**
   - https://console.cloud.google.com/apis/library

2. **Enable These APIs:**
   - Google+ API (or People API)
   - Google OAuth2 API

3. **Search and Enable:**
   - Search for each API
   - Click "Enable"

### Solution 6: Clear Browser Cache & Cookies

1. **Clear Browser Data:**
   - Open DevTools (F12)
   - Go to Application/Storage tab
   - Clear all cookies for `localhost:3000`
   - Clear all local storage

2. **Try Incognito/Private Mode:**
   - Open an incognito window
   - Try signing in again

### Solution 7: Check NextAuth Configuration

Verify your `server/auth.ts` has correct settings:

```typescript
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "database",
  },
  pages: {
    signIn: "/",
  },
};
```

### Solution 8: Restart Everything

Sometimes a fresh start helps:

```bash
# 1. Stop the dev server (Ctrl+C)

# 2. Clear Next.js cache
rm -rf .next

# 3. Restart the dev server
npm run dev

# 4. Try signing in again
```

### Solution 9: Check for Port Conflicts

Make sure port 3000 is not being used by another app:

```bash
# Check what's running on port 3000
lsof -i :3000

# If something else is using it, kill it or use a different port
# To use a different port:
PORT=3001 npm run dev

# Then update NEXTAUTH_URL and Google Console redirect URI to use :3001
```

### Solution 10: Verify Database Connection

OAuth requires database access for sessions:

```bash
# Test database connection
npx prisma db push

# If this fails, check your DATABASE_URL in .env
```

## Still Having Issues?

### Debug Mode

Enable NextAuth debug mode to see detailed errors:

Add to `server/auth.ts`:
```typescript
export const authOptions: NextAuthOptions = {
  debug: true, // Add this line
  // ... rest of config
};
```

Check the server console for detailed error messages.

### Check Server Logs

Look at your terminal where `npm run dev` is running for error messages.

### Common Error Messages

**"redirect_uri_mismatch"**
- Fix: Update redirect URI in Google Console

**"invalid_client"**
- Fix: Check GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET

**"access_denied"**
- Fix: Add your email as a test user in OAuth consent screen

**"unauthorized_client"**
- Fix: Enable Google+ API or People API

## Quick Checklist

- [ ] Redirect URI in Google Console is exactly: `http://localhost:3000/api/auth/callback/google`
- [ ] No trailing slash in redirect URI
- [ ] NEXTAUTH_URL is set to `http://localhost:3000`
- [ ] GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are correct
- [ ] OAuth consent screen is configured
- [ ] Your email is added as a test user (if app is in Testing mode)
- [ ] Google+ API or People API is enabled
- [ ] Database connection is working
- [ ] Dev server is running on port 3000
- [ ] Browser cache is cleared
- [ ] Waited 5-10 minutes after making changes in Google Console

## Need More Help?

1. Check NextAuth.js docs: https://next-auth.js.org/providers/google
2. Check Google OAuth docs: https://developers.google.com/identity/protocols/oauth2
3. Enable debug mode and check server logs
4. Try creating completely new OAuth credentials
