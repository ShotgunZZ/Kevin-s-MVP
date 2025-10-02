# Claude Code Instructions for Members Portal MVP

This file contains project-specific instructions for AI assistants working on this codebase.

---

## 🎯 Project Overview

**Project:** Members-Only Ticket Management Portal MVP
**Tech Stack:** Next.js 14 (App Router) + TypeScript + Supabase + Netlify
**Purpose:** Secure portal for members to swap/donate tickets and manage profiles

---

## 📋 Critical Instructions

### 1. ALWAYS Update PROGRESS.md After Each Task

**REQUIRED:** After completing ANY task (feature, fix, refactor, etc.), you MUST:

1. Open `PROGRESS.md`
2. Find the relevant section and task
3. Update the checkbox: `- [ ]` → `- [x]`
4. Update the status emoji if completing a phase: `⬜` → `✅`
5. Update the "Overall Progress" percentage
6. Add an entry to "Team Notes" section with date and what was completed

**Example:**
```markdown
## Phase 4: Core Features ✅  <!-- Update emoji -->

### Public Pages
- [x] Build public landing page (/)  <!-- Update checkbox -->
- [x] Create pricing/membership page (/pricing)

---

## Team Notes

### October 3, 2025
- ✅ Completed public landing page with hero, features, and CTA
- ✅ Added pricing page with membership tiers
- ⏭️ Next: Auth pages (sign-in, sign-up)
```

### 2. Follow Existing Architecture

**DO NOT** deviate from established patterns:

- **Routing:** Use Next.js App Router (app/ directory)
- **Data Fetching:** Server Components by default, use `'use client'` only when needed
- **Supabase Access:**
  - Client components: `import { createClient } from '@/lib/supabase/client'`
  - Server components: `import { createClient } from '@/lib/supabase/server'`
- **Styling:** Tailwind CSS classes only (no CSS modules or styled-components)
- **Components:** Use shadcn/ui patterns (see components/ui/)
- **Error Handling:** Use custom errors from `@/lib/errors.ts`

### 3. Database Operations

**ALWAYS:**
- Respect Row-Level Security (RLS) policies
- Use TypeScript types from `@/types/database.types.ts`
- Log activities using `log_activity()` function
- Handle errors with try/catch and custom error classes

**Example:**
```typescript
import { createClient } from '@/lib/supabase/server'
import { DatabaseError } from '@/lib/errors'

const supabase = await createClient()
const { data, error } = await supabase
  .from('tickets')
  .select('*')

if (error) throw new DatabaseError('Failed to fetch tickets')
```

### 4. Authentication Patterns

**Protected Routes:**
- All `/dashboard/*` routes require authentication (handled by middleware)
- Check user auth in server components:
```typescript
const supabase = await createClient()
const { data: { user } } = await supabase.auth.getUser()
if (!user) redirect('/sign-in')
```

**Auth Actions:**
- Sign up/sign in: Use Supabase Auth methods
- Automatic member profile creation: Handled by DB trigger
- Session refresh: Handled by middleware

### 5. Component Structure

**When creating new components:**

```typescript
// Server Component (default)
import { ComponentProps } from './types'

export default function MyComponent({ prop }: ComponentProps) {
  return <div>...</div>
}

// Client Component (when needed)
'use client'

import { useState } from 'react'

export default function MyClientComponent() {
  const [state, setState] = useState()
  return <div>...</div>
}
```

### 6. Form Handling

**ALWAYS use:**
- `react-hook-form` for form state
- `zod` for validation schemas
- `@hookform/resolvers/zod` for integration

**Example:**
```typescript
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  eventName: z.string().min(1, 'Event name is required'),
  quantity: z.number().min(1),
})

export default function TicketForm() {
  const form = useForm({
    resolver: zodResolver(schema),
  })
  // ...
}
```

---

## 🗂️ File Organization Rules

### App Directory Structure

```
app/
├── (auth)/              # Auth routes group (no layout)
│   ├── sign-in/
│   └── sign-up/
├── (public)/            # Public routes group (custom layout)
│   ├── page.tsx         # Landing page
│   └── pricing/
├── dashboard/           # Protected routes
│   ├── layout.tsx       # Dashboard layout
│   ├── page.tsx         # Dashboard home
│   ├── profile/
│   ├── tickets/
│   └── activity/
└── auth/
    └── callback/        # OAuth callback
```

### Component Organization

```
components/
├── ui/                  # shadcn/ui components (Button, Input, etc.)
├── forms/               # Form components (TicketForm, ProfileForm)
├── layout/              # Layout components (Navbar, Footer, Sidebar)
└── shared/              # Shared components (ErrorBoundary, Loading)
```

### Naming Conventions

- **Files:** kebab-case (`ticket-form.tsx`, `sign-in-page.tsx`)
- **Components:** PascalCase (`TicketForm`, `SignInPage`)
- **Functions:** camelCase (`getUserTickets`, `logActivity`)
- **Constants:** UPPER_SNAKE_CASE (`MAX_TICKETS`, `API_URL`)
- **Types/Interfaces:** PascalCase (`UserProfile`, `TicketData`)

---

## 🔒 Security Requirements

**NEVER:**
- Commit `.env.local` or any file with secrets
- Bypass RLS policies
- Use `SUPABASE_SERVICE_ROLE_KEY` in client-side code
- Trust user input without validation
- Expose error stack traces to users

**ALWAYS:**
- Validate all inputs with Zod schemas
- Use parameterized queries (Supabase SDK does this)
- Check user permissions before mutations
- Log errors server-side
- Show user-friendly error messages client-side

---

## 🧪 Testing Requirements

**Before marking a feature complete:**

1. **Manual Testing:**
   - Test happy path
   - Test error cases
   - Test on mobile viewport
   - Test with empty/missing data

2. **Code Quality:**
   - No TypeScript errors: `npm run type-check`
   - No ESLint errors: `npm run lint`
   - Properly formatted code

3. **Update PROGRESS.md** (see instruction #1)

---

## 📝 Code Style Preferences

### TypeScript

```typescript
// ✅ Good: Explicit types
interface TicketFormData {
  eventName: string
  eventDate: string
  quantity: number
  intent: 'swap' | 'donate'
}

// ❌ Bad: Using 'any'
const data: any = {}
```

### React

```typescript
// ✅ Good: Destructured props with types
export default function Ticket({ id, eventName }: TicketProps) {
  return <div>{eventName}</div>
}

// ❌ Bad: Props without types
export default function Ticket(props) {
  return <div>{props.eventName}</div>
}
```

### Async/Await

```typescript
// ✅ Good: Proper error handling
try {
  const { data, error } = await supabase.from('tickets').select()
  if (error) throw new DatabaseError(error.message)
  return data
} catch (error) {
  logError(error)
  throw error
}

// ❌ Bad: No error handling
const { data } = await supabase.from('tickets').select()
return data
```

---

## 🚀 Deployment Checklist

Before deploying to production:

- [ ] All PROGRESS.md tasks marked complete
- [ ] All tests passing
- [ ] No console.errors or console.warnings in production build
- [ ] Environment variables set in Netlify
- [ ] Supabase RLS policies tested
- [ ] Error pages tested (404, 500, error boundary)
- [ ] Mobile responsiveness verified
- [ ] README.md updated if needed
- [ ] PROGRESS.md "Team Notes" updated with deployment date

---

## 🔧 Common Tasks & Patterns

### Adding a New Page

1. Create file in `app/` directory
2. Export default React component
3. Add route protection if needed (middleware handles `/dashboard/*`)
4. Update PROGRESS.md
5. Test the page

### Adding a New Component

1. Determine if it's Server or Client Component
2. Create in appropriate components/ subdirectory
3. Add TypeScript types/interfaces
4. Import and use in pages
5. Update PROGRESS.md if it was a tracked task

### Adding a New Database Table

1. Add to `supabase-migration.sql`
2. Update `types/database.types.ts`
3. Add RLS policies
4. Create indexes if needed
5. Test with sample data
6. Update PROGRESS.md

### Debugging Supabase Issues

1. Check RLS policies in Supabase dashboard
2. Verify environment variables are correct
3. Test query in Supabase SQL editor
4. Check browser console for error messages
5. Review `lib/supabase/` client configuration

---

## 📚 Reference Documentation

**Key Files to Review:**
- `PRD.md` - Product requirements and features
- `TECH_STACK.md` - Technology decisions and architecture
- `PROGRESS.md` - Current status and next steps
- `README.md` - Setup and deployment instructions
- `supabase-migration.sql` - Database schema and policies

**External Docs:**
- Next.js: https://nextjs.org/docs
- Supabase: https://supabase.com/docs
- Tailwind CSS: https://tailwindcss.com/docs
- shadcn/ui: https://ui.shadcn.com
- React Hook Form: https://react-hook-form.com
- Zod: https://zod.dev

---

## 🎨 Design Guidelines

**Color Scheme:**
- Use Tailwind CSS design tokens (primary, secondary, muted, etc.)
- Defined in `app/globals.css` as CSS variables
- Dark mode support available but not implemented in MVP

**Typography:**
- Font: Inter (loaded via next/font/google)
- Headings: font-bold, appropriate text sizes
- Body: default font-weight

**Spacing:**
- Use Tailwind spacing scale (p-4, mb-6, gap-2, etc.)
- Consistent padding/margins across similar components

**Buttons:**
- Primary: `bg-primary text-primary-foreground`
- Secondary: `border border-border hover:bg-accent`
- Sizes: Small (px-3 py-2), Medium (px-4 py-2), Large (px-6 py-3)

---

## ⚠️ Known Issues & Limitations

**Current MVP Limitations:**
- No email verification (added post-MVP)
- No real-time notifications (future phase)
- No payment processing (future phase)
- No admin dashboard (future phase)
- Manual ticket coordination (no automated matching)

**Technical Debt:**
- Some components could be extracted/reused
- Test coverage needs improvement
- Error messages could be more specific

---

## 📞 Getting Help

**If stuck:**
1. Review relevant documentation files (PRD, TECH_STACK, README)
2. Check Supabase dashboard for DB/auth issues
3. Review Next.js/Supabase docs
4. Check PROGRESS.md for context on current phase
5. Refer to existing similar implementations in codebase

---

## 🎯 Current Phase & Priorities

**Phase:** Infrastructure Complete, UI Implementation Pending

**Immediate Priorities:**
1. Build public landing page
2. Create auth pages (sign-in, sign-up)
3. Build dashboard layout
4. Implement ticket CRUD

**Success Criteria for MVP:**
- All features in PRD.md implemented
- All items in PROGRESS.md checked off
- Successfully deployed to Netlify
- Passing manual QA tests

---

## 📌 Remember

1. **ALWAYS UPDATE PROGRESS.md** after completing tasks
2. Follow existing patterns and conventions
3. Security first - validate, sanitize, protect
4. User experience matters - handle errors gracefully
5. TypeScript strict mode - no 'any' types
6. Mobile-first responsive design
7. Test before marking complete

---

**Last Updated:** October 2, 2025
**Project Status:** Infrastructure Complete, Ready for UI Development
