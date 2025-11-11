-- Enable Row Level Security (RLS) for Supabase
-- This script should be run in the Supabase SQL Editor

-- ============================================
-- ENABLE RLS ON ALL TABLES
-- ============================================

-- Enable RLS on User table
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;

-- Enable RLS on Account table
ALTER TABLE "Account" ENABLE ROW LEVEL SECURITY;

-- Enable RLS on Session table
ALTER TABLE "Session" ENABLE ROW LEVEL SECURITY;

-- Enable RLS on VerificationToken table
ALTER TABLE "VerificationToken" ENABLE ROW LEVEL SECURITY;

-- Enable RLS on Prompt table
ALTER TABLE "Prompt" ENABLE ROW LEVEL SECURITY;

-- Enable RLS on Vote table
ALTER TABLE "Vote" ENABLE ROW LEVEL SECURITY;

-- Enable RLS on Category table (read-only for all)
ALTER TABLE "Category" ENABLE ROW LEVEL SECURITY;

-- Enable RLS on Model table (read-only for all)
ALTER TABLE "Model" ENABLE ROW LEVEL SECURITY;

-- ============================================
-- CREATE POLICIES FOR USER TABLE
-- ============================================

-- Users can read their own data
CREATE POLICY "Users can view own data"
  ON "User"
  FOR SELECT
  USING (auth.uid()::text = id);

-- Users can update their own data
CREATE POLICY "Users can update own data"
  ON "User"
  FOR UPDATE
  USING (auth.uid()::text = id);

-- ============================================
-- CREATE POLICIES FOR ACCOUNT TABLE
-- ============================================

-- Users can read their own accounts
CREATE POLICY "Users can view own accounts"
  ON "Account"
  FOR SELECT
  USING (auth.uid()::text = "userId");

-- ============================================
-- CREATE POLICIES FOR SESSION TABLE
-- ============================================

-- Users can read their own sessions
CREATE POLICY "Users can view own sessions"
  ON "Session"
  FOR SELECT
  USING (auth.uid()::text = "userId");

-- Users can delete their own sessions (logout)
CREATE POLICY "Users can delete own sessions"
  ON "Session"
  FOR DELETE
  USING (auth.uid()::text = "userId");

-- ============================================
-- CREATE POLICIES FOR PROMPT TABLE
-- ============================================

-- Everyone can read prompts (public access)
CREATE POLICY "Anyone can view prompts"
  ON "Prompt"
  FOR SELECT
  USING (true);

-- Authenticated users can create prompts
CREATE POLICY "Authenticated users can create prompts"
  ON "Prompt"
  FOR INSERT
  WITH CHECK (auth.uid()::text = "authorId");

-- Users can update their own prompts
CREATE POLICY "Users can update own prompts"
  ON "Prompt"
  FOR UPDATE
  USING (auth.uid()::text = "authorId");

-- Users can delete their own prompts
CREATE POLICY "Users can delete own prompts"
  ON "Prompt"
  FOR DELETE
  USING (auth.uid()::text = "authorId");

-- ============================================
-- CREATE POLICIES FOR VOTE TABLE
-- ============================================

-- Everyone can read votes (for vote counts)
CREATE POLICY "Anyone can view votes"
  ON "Vote"
  FOR SELECT
  USING (true);

-- Authenticated users can create votes
CREATE POLICY "Authenticated users can create votes"
  ON "Vote"
  FOR INSERT
  WITH CHECK (auth.uid()::text = "userId");

-- Users can update their own votes
CREATE POLICY "Users can update own votes"
  ON "Vote"
  FOR UPDATE
  USING (auth.uid()::text = "userId");

-- Users can delete their own votes
CREATE POLICY "Users can delete own votes"
  ON "Vote"
  FOR DELETE
  USING (auth.uid()::text = "userId");

-- ============================================
-- CREATE POLICIES FOR CATEGORY TABLE
-- ============================================

-- Everyone can read categories
CREATE POLICY "Anyone can view categories"
  ON "Category"
  FOR SELECT
  USING (true);

-- ============================================
-- CREATE POLICIES FOR MODEL TABLE
-- ============================================

-- Everyone can read models
CREATE POLICY "Anyone can view models"
  ON "Model"
  FOR SELECT
  USING (true);

-- ============================================
-- VERIFICATION TOKEN (NextAuth)
-- ============================================

-- Allow public access for verification tokens (needed for NextAuth)
CREATE POLICY "Anyone can manage verification tokens"
  ON "VerificationToken"
  FOR ALL
  USING (true);
