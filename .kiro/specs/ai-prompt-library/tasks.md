    # Implementation Plan

- [x] 1. Initialize Next.js project and install dependencies
  - Create Next.js app with TypeScript and App Router
  - Install Tailwind CSS, tRPC, Prisma, NextAuth, Supabase client, and shadcn/ui
  - Initialize shadcn/ui with New York style and Gray color
  - Configure Tailwind and TypeScript settings
  - _Requirements: 7.1, 7.2_

- [x] 2. Set up Prisma schema and database connection
  - Create schema.prisma with User, Account, Session, VerificationToken models for NextAuth
  - Add Category, Model, Prompt, and Vote models with proper relations
  - Define VoteType enum (UP, DOWN)
  - Add unique constraints and indexes
  - Configure Supabase connection string
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 3. Configure NextAuth with Google provider and Supabase adapter
  - Create auth configuration file with Google OAuth provider
  - Set up Supabase adapter for NextAuth
  - Configure session strategy and callbacks
  - Create API route handler for NextAuth
  - Set up environment variables for OAuth credentials
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [x] 4. Set up tRPC server infrastructure
  - Create tRPC context with session and database access
  - Set up protected and public procedure helpers
  - Create root router
  - Configure tRPC API route handler
  - Set up server-side tRPC caller
  - _Requirements: 2.1, 4.4, 5.1_

- [x] 5. Implement category and model routers
  - Create category.getAll procedure to fetch all categories
  - Create model.getAll procedure to fetch all models
  - Add proper TypeScript types for outputs
  - _Requirements: 4.6, 3.1, 3.3_

- [x] 6. Implement prompt router with filtering and sorting
  - Create prompt.getAll procedure with optional filters (categoryId, modelId, sortBy)
  - Implement query logic to include author, category, model relations
  - Calculate voteScore (count UP votes - count DOWN votes)
  - Determine currentUserVote for authenticated users
  - Implement NEW sort (createdAt DESC) and TOP sort (voteScore DESC)
  - Create prompt.create protected procedure with validation
  - _Requirements: 2.1, 2.4, 2.5, 3.2, 3.4, 3.5, 3.6, 3.7, 3.8, 4.2, 4.3, 4.4, 4.5_

- [x] 7. Implement vote router with toggle logic
  - Create vote.cast protected procedure
  - Implement logic to check existing vote for user and prompt
  - Handle create vote (no existing vote)
  - Handle delete vote (same type clicked)
  - Handle update vote (different type clicked)
  - Return updated voteScore and userVote state
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.6, 5.7_

- [ ] 8. Set up tRPC client and React Query provider
  - Create tRPC client configuration
  - Set up React Query provider in root layout
  - Configure client-side tRPC hooks
  - _Requirements: 2.1, 3.2, 5.5_

- [ ] 9. Create root layout with Header component
  - Build app/layout.tsx with SessionProvider and TRPCProvider
  - Create Header.tsx client component with site title
  - Add SubmitPromptDialog button to Header
  - Add LoginButton to Header
  - Style Header with Tailwind (sticky positioning)
  - _Requirements: 1.3, 4.1_

- [ ] 10. Implement LoginButton component
  - Create LoginButton.tsx client component
  - Use useSession hook to get authentication state
  - Show "Login" button when unauthenticated (calls signIn('google'))
  - Show user avatar with dropdown menu when authenticated
  - Add "Sign Out" option in dropdown (calls signOut())
  - Style with shadcn/ui Button and DropdownMenu components
  - _Requirements: 1.1, 1.3, 1.4_

- [ ] 11. Create server-side page component with initial data
  - Build app/page.tsx as server component
  - Fetch initial prompts using server-side tRPC caller
  - Pass initial data to PromptGallery component
  - Add page metadata for SEO
  - _Requirements: 2.1, 2.4_

- [ ] 12. Implement PromptGallery component with filters and sorting
  - Create PromptGallery.tsx client component
  - Add state for sortBy, selectedCategory, selectedModel
  - Use trpc.prompt.getAll.useQuery with state as input
  - Fetch categories and models for filter dropdowns
  - Render Tabs for "New" and "Top" sorting
  - Render Select components for category and model filters
  - Render grid of PromptCard components
  - Handle loading and error states
  - _Requirements: 2.1, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8_

- [ ] 13. Implement PromptCard component
  - Create PromptCard.tsx client component
  - Add isExpanded state for text expansion
  - Render Card with title and author name in CardHeader
  - Render prompt text with line-clamp-3 when collapsed
  - Add "Show More"/"Show Less" button to toggle expansion
  - Render category and model badges in CardFooter
  - Include CopyButton and VoteControl in CardFooter
  - Style with shadcn/ui Card components
  - _Requirements: 2.1, 2.2, 2.3_

- [ ] 14. Implement VoteControl component with optimistic updates
  - Create VoteControl.tsx client component
  - Add optimistic state for score and user vote
  - Use trpc.vote.cast.useMutation
  - Implement optimistic update logic before mutation
  - Render upvote button (highlighted if user voted UP)
  - Render vote score display
  - Render downvote button (highlighted if user voted DOWN)
  - Disable buttons when not authenticated
  - Handle mutation success and error states
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7_

- [ ] 15. Implement CopyButton component
  - Create CopyButton.tsx client component
  - Add copied state (boolean)
  - Implement clipboard copy using navigator.clipboard.writeText
  - Set copied to true on success
  - Reset copied to false after 2 seconds
  - Render Copy icon in default state
  - Render Check icon in copied state
  - Style with shadcn/ui Button component
  - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [ ] 16. Implement SubmitPromptDialog component with form validation
  - Create SubmitPromptDialog.tsx client component
  - Set up Dialog component from shadcn/ui
  - Create form with react-hook-form
  - Define Zod validation schema (title, promptText, categoryId, modelId)
  - Fetch categories using trpc.category.getAll.useQuery
  - Fetch models using trpc.model.getAll.useQuery
  - Render Input for title field
  - Render Textarea for promptText field
  - Render Select for category field
  - Render Select for model field
  - Use trpc.prompt.create.useMutation for submission
  - Close dialog and reset form on success
  - Display validation errors inline
  - Invalidate prompt queries after successful submission
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

- [ ] 17. Run database migrations and seed initial data
  - Generate Prisma client
  - Push schema to Supabase database
  - Create seed script to populate initial categories and models
  - Run seed script
  - _Requirements: 7.1, 7.2, 3.1, 3.3_

- [ ] 18. Add environment variables and configuration
  - Create .env file with database URL, NextAuth secret, and Google OAuth credentials
  - Document required environment variables in README
  - Add .env.example file
  - _Requirements: 1.1, 1.2, 7.5_
