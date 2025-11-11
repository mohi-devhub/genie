# Database Migrations

## Row Level Security (RLS) Setup

### Prerequisites
- Supabase project created
- Database connection configured in `.env`

### Steps to Enable RLS

1. **Open Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your project

2. **Navigate to SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Run the RLS Script**
   - Copy the entire contents of `enable_rls.sql`
   - Paste into the SQL Editor
   - Click "Run" or press Cmd/Ctrl + Enter

4. **Verify RLS is Enabled**
   - Go to "Database" > "Tables"
   - Select any table (e.g., "Prompt")
   - Check that "Row Level Security" shows as "Enabled"

### What the Script Does

The `enable_rls.sql` script:

1. **Enables RLS** on all tables
2. **Creates policies** for each table:
   - User: Can view/update own data
   - Prompt: Public read, authenticated write, owner edit/delete
   - Vote: Public read, authenticated write, owner edit/delete
   - Category/Model: Public read-only
   - Session/Account: Owner access only

### Testing RLS Policies

After enabling RLS, test that:

1. **Unauthenticated users can:**
   - View prompts
   - View categories and models
   - NOT create prompts or vote

2. **Authenticated users can:**
   - View all prompts
   - Create new prompts
   - Vote on others' prompts
   - Edit/delete only their own prompts
   - NOT vote on their own prompts

3. **Users cannot:**
   - Access other users' sessions
   - Modify other users' data
   - Delete others' prompts or votes

### Troubleshooting

**Issue: Policies not working**
- Ensure RLS is enabled on the table
- Check policy syntax in Supabase dashboard
- Verify `auth.uid()` matches your user ID format

**Issue: NextAuth errors**
- Ensure VerificationToken policy allows public access
- Check Session and Account policies allow user access

**Issue: Can't create prompts**
- Verify user is authenticated
- Check that `authorId` matches `auth.uid()`
- Ensure INSERT policy exists for Prompt table

### Important Notes

⚠️ **Before enabling RLS:**
- Backup your database
- Test in a development environment first
- Review all policies carefully

⚠️ **After enabling RLS:**
- Test all application features
- Monitor for access errors
- Update policies as needed

### Disabling RLS (Not Recommended)

If you need to disable RLS temporarily:

```sql
ALTER TABLE "TableName" DISABLE ROW LEVEL SECURITY;
```

**Warning:** This removes all access controls. Only use for debugging.

### Additional Resources

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL RLS Documentation](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
