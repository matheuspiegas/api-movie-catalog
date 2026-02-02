# Agent Guidelines for Movie Catalog API

This document provides coding guidelines and conventions for AI coding agents working on this codebase.

## Project Overview

- **Type**: Backend REST API for movie catalog management
- **Tech Stack**: Node.js, TypeScript, Fastify, Drizzle ORM, PostgreSQL
- **Package Manager**: pnpm
- **Module System**: ES Modules (`"type": "module"`)
- **Runtime**: tsx (TypeScript executor with watch mode)

## Commands

### Development
```bash
pnpm dev                    # Start dev server with hot reload
```

### Code Quality
```bash
npx biome check            # Run formatter, linter, and organize imports
npx biome check --write    # Apply fixes automatically
npx biome format           # Format only
npx biome lint             # Lint only
npx biome ci               # CI checks (no writes)
```

### Database (Drizzle)
```bash
npx drizzle-kit generate   # Generate migrations from schema
npx drizzle-kit push       # Push schema to database
npx drizzle-kit studio     # Open Drizzle Studio (DB GUI)
```

### Testing
**Status**: No testing framework currently configured. When adding tests, use Vitest:
```bash
pnpm add -D vitest @vitest/ui
npx vitest                 # Run all tests
npx vitest <file>          # Run single test file
npx vitest --ui            # Run with UI
```

## Code Style

### Formatting (Biome Configuration)

- **Indentation**: Tabs (not spaces)
- **Quotes**: Single quotes for strings
- **Semicolons**: Only when needed (ASI - Automatic Semicolon Insertion)
- **Import Organization**: Automatic, enabled by default
- **Line Length**: Follow Biome defaults (80 chars soft limit)

Always run `npx biome check --write` before committing.

### TypeScript Configuration

- **Target**: ES2024 with latest ESNext features
- **Strict Mode**: Enabled (all strict checks on)
- **Module Resolution**: NodeNext
- **Path Alias**: `@/*` maps to project root
- **File Extensions**: `.ts` extension REQUIRED in relative imports

### Import Patterns

```typescript
// npm packages (no extension)
import fastify from 'fastify'
import { eq } from 'drizzle-orm'

// Relative imports (MUST include .ts extension)
import { db } from './db/index.ts'
import { lists } from './db/schema.ts'

// Path alias imports (include .ts extension)
import { env } from '@/env.ts'
```

**Rules**:
- Use `.ts` extension for all local imports
- Group imports: npm packages first, then local imports
- Let Biome organize imports automatically
- Use path alias `@/` for imports from project root

### Naming Conventions

**Files**:
- Lowercase, no separators: `index.ts`, `schema.ts`, `relations.ts`
- Config files: kebab-case: `drizzle.config.ts`, `tsconfig.json`

**Variables & Functions**:
- camelCase: `app`, `userLists`, `userId`, `isAuthenticated`
- Arrow functions preferred: `const handler = async (req) => {}`

**Database**:
- Table names: lowercase plural: `lists`, `list_items` (snake_case for multi-word)
- Column names: snake_case: `user_id`, `created_at`, `movie_poster_path`
- TypeScript exports: camelCase: `lists`, `listItems`, `userId`

**Constants**:
- camelCase for module-level: `db`, `app`
- UPPER_SNAKE_CASE for true constants: `PORT`, `MAX_RETRIES`

### Type Annotations

Always use explicit types for:
- Function parameters
- Function return types (or use explicit `async` return inference)
- Complex objects
- Public API interfaces

```typescript
// Good
async function getList(userId: string): Promise<List[]> {
  return db.select().from(lists).where(eq(lists.userId, userId))
}

// Acceptable (return type inferred from async/await)
async function getList(userId: string) {
  return db.select().from(lists).where(eq(lists.userId, userId))
}
```

### Error Handling

**Pattern to Follow**:
```typescript
app.get('/lists', async (req, reply) => {
  try {
    const { isAuthenticated, userId } = getAuth(req)
    
    if (!isAuthenticated) {
      return reply.code(401).send({ error: 'Unauthorized' })
    }
    
    const userLists = await db
      .select()
      .from(lists)
      .where(eq(lists.userId, userId))
    
    return { lists: userLists }
  } catch (error) {
    console.error('Error fetching lists:', error)
    return reply.code(500).send({ error: 'Internal server error' })
  }
})
```

**Rules**:
- Use try-catch for async operations
- Always send HTTP error responses (don't just log)
- Log errors with `console.error()` including context
- Return appropriate status codes: 401 (Unauthorized), 404 (Not Found), 500 (Server Error)
- Use Fastify's `reply` object for error responses

## Project Structure

```
src/
├── index.ts              # Main app entry, routes, server setup
├── db/
│   ├── index.ts         # Database connection
│   ├── schema.ts        # Table schemas (Drizzle)
│   └── relations.ts     # Table relationships
```

**Organization Principles**:
- Keep database layer in `src/db/`
- Separate routes into feature modules as codebase grows
- Use `index.ts` for main exports in each directory

## Database Patterns

### Schema Definitions (Drizzle)

```typescript
export const lists = pgTable('lists', {
  id: uuid().defaultRandom().primaryKey().notNull(),
  name: text().notNull(),
  userId: text('user_id').notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
})
```

**Rules**:
- Use `pgTable` for table definitions
- UUID primary keys with `defaultRandom()`
- snake_case for column names in DB
- camelCase for TypeScript property names
- Use `timestamp().defaultNow()` for created/updated timestamps
- Use `foreignKey()` with `onDelete('cascade')` for relationships

### Queries

```typescript
// Select with filter
const userLists = await db
  .select()
  .from(lists)
  .where(eq(lists.userId, userId))

// Insert
await db.insert(lists).values({ name, userId })

// Update
await db.update(lists).set({ name }).where(eq(lists.id, id))

// Delete
await db.delete(lists).where(eq(lists.id, id))
```

## Environment Variables

Use `env.ts` at project root with Zod validation:

```typescript
import { z } from 'zod'

const envSchema = z.object({
  CLERK_SECRET_KEY: z.string(),
  DATABASE_URL: z.string().url(),
})

export const env = envSchema.parse(process.env)
```

**Never commit `.env` files** - they should be in `.gitignore`.

## Security

- Validate all user input with Zod schemas
- Check authentication on all protected routes using `getAuth(req)`
- Never log sensitive data (tokens, passwords, API keys)
- Use prepared statements (Drizzle handles this automatically)

## Git Workflow

- Run `npx biome check --write` before committing
- Write clear, descriptive commit messages
- Keep commits focused on single features/fixes

## Additional Notes

- **File Extensions Required**: Always include `.ts` in imports
- **Fastify Plugins**: Register plugins before routes
- **CORS**: Configure origins in `fastifyCors` registration
- **Authentication**: Uses Clerk - access via `getAuth(req)`
