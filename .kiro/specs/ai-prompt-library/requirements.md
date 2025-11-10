# Requirements Document

## Introduction

The AI Prompt Library is a web application that allows users to browse, submit, and vote on AI prompts. Users can filter prompts by category and model, sort by recency or popularity, and authenticate using Google OAuth. The system provides a community-driven platform for discovering and sharing effective AI prompts.

## Glossary

- **System**: The AI Prompt Library web application
- **User**: An authenticated person who can submit prompts and cast votes
- **Visitor**: An unauthenticated person who can browse prompts
- **Prompt**: A text entry containing instructions for AI models, submitted by a User
- **Category**: A classification grouping for Prompts (e.g., "Writing", "Coding")
- **Model**: An AI model designation for Prompts (e.g., "GPT-4", "Claude")
- **Vote**: A User's upvote or downvote on a Prompt
- **Vote Score**: The calculated difference between upvotes and downvotes for a Prompt
- **Gallery**: The main display area showing a collection of Prompts
- **Dialog**: A modal window for submitting new Prompts

## Requirements

### Requirement 1: User Authentication

**User Story:** As a visitor, I want to sign in with my Google account, so that I can submit prompts and vote on existing prompts.

#### Acceptance Criteria

1. WHEN a visitor clicks the login button, THE System SHALL initiate Google OAuth authentication flow
2. WHEN authentication succeeds, THE System SHALL create or retrieve the User record and establish a session
3. WHEN a User is authenticated, THE System SHALL display the User's avatar and a sign-out option
4. WHEN a User clicks sign out, THE System SHALL terminate the session and return the User to visitor state
5. THE System SHALL persist User sessions across page refreshes

### Requirement 2: Browse Prompts

**User Story:** As a visitor, I want to browse all submitted prompts with their details, so that I can discover useful AI prompts.

#### Acceptance Criteria

1. THE System SHALL display all Prompts in the Gallery with title, author name, category, model, and vote score
2. THE System SHALL display Prompt text with a preview limit of three lines
3. WHEN a visitor clicks "Show More" on a Prompt, THE System SHALL expand to display the full Prompt text
4. THE System SHALL display Prompts sorted by creation date in descending order by default
5. WHEN a Prompt is displayed to an authenticated User, THE System SHALL indicate the User's current vote state on that Prompt

### Requirement 3: Filter and Sort Prompts

**User Story:** As a visitor, I want to filter prompts by category and model and sort by recency or popularity, so that I can find relevant prompts quickly.

#### Acceptance Criteria

1. THE System SHALL provide a category filter that displays all available Categories
2. WHEN a visitor selects a Category, THE System SHALL display only Prompts belonging to that Category
3. THE System SHALL provide a model filter that displays all available Models
4. WHEN a visitor selects a Model, THE System SHALL display only Prompts associated with that Model
5. THE System SHALL provide sort options for "New" and "Top"
6. WHEN a visitor selects "New" sort, THE System SHALL order Prompts by creation date in descending order
7. WHEN a visitor selects "Top" sort, THE System SHALL order Prompts by Vote Score in descending order
8. THE System SHALL apply filters and sorting simultaneously when multiple criteria are selected

### Requirement 4: Submit Prompts

**User Story:** As a User, I want to submit a new prompt with a title, text, category, and model, so that I can share useful prompts with the community.

#### Acceptance Criteria

1. WHEN an authenticated User clicks the submit button, THE System SHALL display a Dialog with a prompt submission form
2. THE System SHALL require the User to provide a title, prompt text, category selection, and model selection
3. THE System SHALL validate that all required fields contain valid data before submission
4. WHEN the User submits a valid prompt, THE System SHALL create a Prompt record linked to the User's account
5. WHEN a Prompt is successfully created, THE System SHALL close the Dialog and display the new Prompt in the Gallery
6. THE System SHALL populate category and model selection fields with all available options from the database

### Requirement 5: Vote on Prompts

**User Story:** As a User, I want to upvote or downvote prompts, so that I can indicate which prompts I find valuable or not valuable.

#### Acceptance Criteria

1. WHEN an authenticated User clicks the upvote button on a Prompt, THE System SHALL create an upvote Vote record
2. WHEN an authenticated User clicks the downvote button on a Prompt, THE System SHALL create a downvote Vote record
3. WHEN a User clicks the same vote type they previously cast, THE System SHALL remove the Vote record
4. WHEN a User clicks a different vote type than previously cast, THE System SHALL update the Vote record to the new type
5. THE System SHALL update the displayed Vote Score immediately after a vote action
6. THE System SHALL calculate Vote Score as the count of upvotes minus the count of downvotes
7. THE System SHALL visually highlight the vote button corresponding to the User's current vote state

### Requirement 6: Copy Prompt Text

**User Story:** As a visitor, I want to copy a prompt's text to my clipboard with one click, so that I can easily use it in AI tools.

#### Acceptance Criteria

1. WHEN a visitor clicks the copy button on a Prompt, THE System SHALL copy the Prompt text to the system clipboard
2. WHEN the copy action succeeds, THE System SHALL display a visual confirmation indicator for two seconds
3. THE System SHALL change the copy button icon to a check mark during the confirmation period
4. WHEN the confirmation period expires, THE System SHALL restore the copy button to its original state

### Requirement 7: Data Persistence

**User Story:** As a system administrator, I want all user data, prompts, and votes stored reliably, so that the application maintains data integrity.

#### Acceptance Criteria

1. THE System SHALL persist all User records in the database with unique identifiers
2. THE System SHALL persist all Prompt records with creation timestamps and author relationships
3. THE System SHALL persist all Vote records with User and Prompt relationships
4. THE System SHALL enforce a unique constraint preventing multiple Vote records for the same User and Prompt combination
5. THE System SHALL maintain referential integrity between all related database records
