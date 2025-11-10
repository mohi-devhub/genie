# Design Document

## Overview

The AI Prompt Library is a full-stack web application built with the T3 Stack (Next.js App Router, TypeScript, Tailwind CSS, tRPC) and Supabase as the database backend. The application uses server-side rendering for initial page loads with client-side interactivity for filtering, voting, and form submissions. Authentication is handled via NextAuth.js with Google OAuth provider and Supabase adapter.

## Architecture

### Technology Stack

- **Frontend Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS with shadcn/ui components (New York style, Gray color)
- **Type Safety**: TypeScript throughout
- **API Layer**: tRPC for end-to-end type-safe APIs
- **Database**: Supabase (PostgreSQL)
- **ORM**: Prisma
- **Authentication**: NextAuth.js with Supabase adapter and Google provider
- **Form Handling**: react-hook-form with Zod validation

### Application Structure

```
app/
├── layout.tsx (Root layout with Header)
├── page.tsx (Server component - initial data fetch)
├── api/
│   ├── auth/[...nextauth]/route.ts (NextAuth configuration)
│   └── trpc/[trpc]/route.ts (tRPC handler)
components/
├── Header.tsx (Client component)
├── LoginButton.tsx (Client component)
├── PromptGallery.tsx (Client component)
├── PromptCard.tsx (Client component)
├── VoteControl.tsx (Client component)
├── CopyButton.tsx (Client component)
└── SubmitPromptDialog.tsx (Client component)
server/
├── api/
│   ├── root.ts (Root tRPC router)
│   └── routers/
│       ├── category.ts
│       ├── model.ts
│       ├── prompt.ts
│       └── vote.ts
├── auth.ts (NextAuth configuration)
└── db.ts (Prisma client)
prisma/
└── schema.prisma (Database schema)
lib/
├── trpc/
│   ├── client.ts (tRPC client setup)
│   └── server.ts (tRPC server setup)
└── utils.ts (Utility functions)
```

## Components and Interfaces

### Data Models (Prisma Schema)

#### User Model (NextAuth)
```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  accounts      Account[]
  sessions      Session[]
  prompts       Prompt[]
  votes         Vote[]
}
```

#### Account Model (NextAuth)
```prisma
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([provider, providerAccountId])
}
```

#### Session Model (NextAuth)
```prisma
model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

#### VerificationToken Model (NextAuth)
```prisma
model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime
  @@unique([identifier, token])
}
```

#### Category Model
```prisma
model Category {
  id      String   @id @default(cuid())
  name    String   @unique
  prompts Prompt[]
}
```

#### Model Model
```prisma
model Model {
  id      String   @id @default(cuid())
  name    String   @unique
  prompts Prompt[]
}
```

#### Prompt Model
```prisma
model Prompt {
  id         String   @id @default(cuid())
  createdAt  DateTime @default(now())
  title      String
  promptText String   @db.Text
  authorId   String
  categoryId String
  modelId    String
  author     User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
  category   Category @relation(fields: [categoryId], references: [id])
  model      Model    @relation(fields: [modelId], references: [id])
  votes      Vote[]
}
```

#### Vote Model
```prisma
enum VoteType {
  UP
  DOWN
}

model Vote {
  id       String   @id @default(cuid())
  type     VoteType
  userId   String
  promptId String
  user     User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  prompt   Prompt   @relation(fields: [promptId], references: [id], onDelete: Cascade)
  @@unique([userId, promptId])
}
```

### tRPC API Design

#### Category Router
```typescript
category.getAll
- Type: Public procedure
- Input: None
- Output: Category[]
- Logic: Fetch all categories from database
```

#### Model Router
```typescript
model.getAll
- Type: Public procedure
- Input: None
- Output: Model[]
- Logic: Fetch all models from database
```

#### Prompt Router
```typescript
prompt.getAll
- Type: Public procedure
- Input: {
    categoryId?: string
    modelId?: string
    sortBy?: 'NEW' | 'TOP' (default: 'NEW')
  }
- Output: Array of {
    id, createdAt, title, promptText,
    author: { id, name, image },
    category: { id, name },
    model: { id, name },
    voteScore: number,
    currentUserVote?: 'UP' | 'DOWN' | null
  }
- Logic:
  - Filter by categoryId and/or modelId if provided
  - Include author, category, model relations
  - Include votes relation
  - Calculate voteScore (count UP - count DOWN)
  - If user authenticated, determine currentUserVote
  - Sort by createdAt DESC (NEW) or voteScore DESC (TOP)

prompt.create
- Type: Protected procedure (requires authentication)
- Input: {
    title: string (min 1, max 200)
    promptText: string (min 1, max 5000)
    categoryId: string
    modelId: string
  }
- Output: Prompt
- Logic:
  - Validate input with Zod
  - Create prompt linked to current user (ctx.session.user.id)
  - Return created prompt
```

#### Vote Router
```typescript
vote.cast
- Type: Protected procedure (requires authentication)
- Input: {
    promptId: string
    type: 'UP' | 'DOWN'
  }
- Output: { success: boolean, voteScore: number, userVote: 'UP' | 'DOWN' | null }
- Logic:
  - Check if vote exists for userId + promptId
  - If no vote exists: Create new vote
  - If vote exists with same type: Delete vote (toggle off)
  - If vote exists with different type: Update vote type
  - Calculate and return new voteScore
  - Return current userVote state
```

### Component Architecture

#### Server Components

**app/layout.tsx**
- Root layout with HTML structure
- Includes SessionProvider wrapper
- Renders Header component
- Applies global styles

**app/page.tsx**
- Server component for initial render
- Fetches initial prompts using server-side tRPC
- Passes data to PromptGallery as initialPrompts
- Provides SEO metadata

#### Client Components

**Header.tsx**
- Displays site title/logo
- Renders SubmitPromptDialog button
- Renders LoginButton
- Sticky positioning at top

**LoginButton.tsx**
- Uses useSession() hook
- Shows "Login" button when unauthenticated
  - Calls signIn('google') on click
- Shows user avatar with dropdown when authenticated
  - Dropdown contains "Sign Out" option
  - Calls signOut() on sign out click

**PromptGallery.tsx**
- Props: initialPrompts
- State:
  - sortBy: 'NEW' | 'TOP'
  - selectedCategory: string | null
  - selectedModel: string | null
- Uses trpc.prompt.getAll.useQuery with state as input
- Fetches categories and models for filters
- Renders:
  - Tabs for "New" and "Top" sorting
  - Select dropdown for category filter
  - Select dropdown for model filter
  - Grid of PromptCard components
- Updates query when filters/sort change

**PromptCard.tsx**
- Props: prompt object
- State: isExpanded (boolean)
- Renders Card with:
  - CardHeader: title and author name
  - CardContent: 
    - Prompt text (line-clamp-3 when collapsed)
    - "Show More"/"Show Less" button
  - CardFooter:
    - Category badge
    - Model badge
    - CopyButton
    - VoteControl

**VoteControl.tsx**
- Props: promptId, initialScore, initialUserVote
- State: optimistic score and vote state
- Uses trpc.vote.cast.useMutation
- Implements optimistic updates
- Renders:
  - Upvote button (highlighted if user voted UP)
  - Vote score display
  - Downvote button (highlighted if user voted DOWN)
- Disables buttons if not authenticated

**CopyButton.tsx**
- Props: textToCopy
- State: copied (boolean)
- Logic:
  - Copies text to clipboard using navigator.clipboard
  - Sets copied to true for 2 seconds
- Renders:
  - Copy icon button (default state)
  - Check icon button (copied state)

**SubmitPromptDialog.tsx**
- Uses Dialog component from shadcn/ui
- Form with react-hook-form and Zod validation
- Fetches categories and models for selects
- Form fields:
  - Title (Input)
  - Prompt text (Textarea)
  - Category (Select)
  - Model (Select)
- Uses trpc.prompt.create.useMutation
- Closes dialog and resets form on success
- Shows validation errors inline

## Data Flow

### Initial Page Load
1. Server renders page.tsx
2. Server-side tRPC call fetches initial prompts (sorted by NEW)
3. HTML with initial data sent to client
4. Client hydrates with React
5. PromptGallery receives initialPrompts as props

### Filtering/Sorting
1. User changes filter or sort in PromptGallery
2. Component state updates
3. trpc.prompt.getAll.useQuery re-fetches with new parameters
4. UI updates with new prompt list

### Voting
1. User clicks vote button in VoteControl
2. Optimistic update immediately reflects in UI
3. trpc.vote.cast.useMutation sends request
4. Server processes vote logic (create/delete/update)
5. Server returns new voteScore and userVote
6. UI confirms or reverts based on response
7. Query invalidation refreshes prompt list

### Submitting Prompt
1. User opens SubmitPromptDialog
2. User fills form and submits
3. Form validation runs (Zod schema)
4. trpc.prompt.create.useMutation sends request
5. Server creates prompt linked to user
6. Dialog closes on success
7. Query invalidation refreshes prompt list
8. New prompt appears in gallery

## Error Handling

### Authentication Errors
- NextAuth handles OAuth errors with redirect to error page
- Session expiration redirects to login
- Protected procedures return 401 UNAUTHORIZED if not authenticated

### Validation Errors
- Zod schemas validate all inputs
- Form validation errors displayed inline
- tRPC returns validation errors with field-specific messages

### Database Errors
- Prisma errors caught and logged
- User-friendly error messages returned
- Unique constraint violations handled gracefully

### Network Errors
- tRPC queries show loading states
- Failed mutations show error toast/message
- Retry logic for transient failures

## Testing Strategy

### Unit Tests
- Utility functions (vote score calculation, text truncation)
- Form validation schemas
- Component logic (isolated from API calls)

### Integration Tests
- tRPC router procedures
- Database operations with test database
- Authentication flow

### End-to-End Tests
- User authentication flow
- Prompt submission flow
- Voting flow
- Filtering and sorting

### Manual Testing
- Cross-browser compatibility
- Responsive design on mobile/tablet/desktop
- Accessibility with keyboard navigation and screen readers

## Performance Considerations

- Server-side rendering for initial page load (SEO and performance)
- Optimistic updates for instant UI feedback
- Query caching with tRPC/React Query
- Pagination for large prompt lists (future enhancement)
- Database indexes on frequently queried fields (categoryId, modelId, createdAt)
- Image optimization for user avatars

## Security Considerations

- Authentication required for mutations (create, vote)
- CSRF protection via NextAuth
- SQL injection prevention via Prisma
- XSS prevention via React's built-in escaping
- Rate limiting on API routes (future enhancement)
- Input validation on all user inputs
