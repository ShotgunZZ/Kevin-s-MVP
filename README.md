# Members-Only Ticket Management Portal MVP

A secure, members-only portal for managing ticket swaps and donations within a community.

## 📋 Documentation

- [Product Requirements Document (PRD)](./PRD.md)
- [Tech Stack Documentation](./TECH_STACK.md)
- [Progress Tracker](./PROGRESS.md)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- npm, yarn, or pnpm
- Supabase account
- Netlify account

### 1. Clone and Install

```bash
# Navigate to project directory
cd "Kevin's MVP"

# (Optional) Use Node Version Manager for version isolation
# If you have nvm installed:
nvm use  # This reads .nvmrc and switches to Node 20.18.0

# Install dependencies
# Note: Unlike Python, Node.js doesn't need virtual environments
# Dependencies are installed in ./node_modules (project-isolated by default)
npm install
```

**About Dependency Isolation:**
- Node.js installs all dependencies in `node_modules/` folder (already project-specific)
- No virtual environment needed - each project has its own `node_modules`
- Use `nvm` (Node Version Manager) to manage Node.js versions across projects
- The `.nvmrc` file specifies Node 20.18.0 for this project

### 2. Set Up Supabase

1. **Create a Supabase project:**
   - Go to https://supabase.com/dashboard
   - Click "New project"
   - Fill in project details

2. **Run the database migration:**
   - Open the Supabase SQL Editor
   - Copy the contents of `supabase-migration.sql`
   - Execute the SQL script

3. **Get your credentials:**
   - Go to Project Settings > API
   - Copy the Project URL and anon/public key

### 3. Configure Environment Variables

```bash
# Copy the example file
cp .env.example .env.local

# Edit .env.local with your Supabase credentials
```

Your `.env.local` should look like:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## 🏗️ Project Structure

```
.
├── app/                  # Next.js App Router pages
│   ├── (auth)/          # Auth pages (sign-in, sign-up)
│   ├── dashboard/       # Protected member dashboard
│   ├── auth/            # Auth callback handlers
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Landing page
│   ├── error.tsx        # Error boundary
│   └── not-found.tsx    # 404 page
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   ├── forms/          # Form components
│   ├── layout/         # Layout components
│   └── shared/         # Shared components
├── lib/                # Utilities and helpers
│   ├── supabase/       # Supabase client configs
│   ├── utils.ts        # Utility functions
│   └── errors.ts       # Error handling
├── types/              # TypeScript type definitions
│   └── database.types.ts
├── tests/              # Test files
│   ├── unit/
│   └── integration/
├── middleware.ts       # Next.js middleware (auth)
├── supabase-migration.sql  # Database schema
└── netlify.toml        # Netlify config
```

## 🗄️ Database Schema

### Tables

- **members** - User profiles and membership info
- **tickets** - Ticket postings (swap/donate)
- **activity_log** - Activity tracking

See `supabase-migration.sql` for complete schema with RLS policies.

## 🔐 Security Features

- ✅ HTTPS enforced (Netlify)
- ✅ Row-Level Security (RLS) policies
- ✅ Secure session management
- ✅ Protected API routes
- ✅ Input validation with Zod
- ✅ CSRF protection
- ✅ Security headers configured

## 📝 Available Scripts

```bash
# Development
npm run dev          # Start dev server

# Production
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler check
```

## 🚢 Deployment to Netlify

### Option 1: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod
```

### Option 2: Git Integration (Recommended)

1. Push code to GitHub
2. Go to Netlify Dashboard
3. Click "Add new site" > "Import an existing project"
4. Connect to your GitHub repo
5. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
6. Add environment variables in Netlify dashboard
7. Deploy!

### Environment Variables in Netlify

Add these in: Site settings > Environment variables

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_APP_URL (your Netlify domain)
NODE_ENV=production
```

## 🧪 Testing

### Run Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Manual Testing Checklist

- [ ] Sign up new user
- [ ] Sign in existing user
- [ ] Create ticket posting
- [ ] Edit ticket posting
- [ ] Delete ticket posting
- [ ] View all tickets
- [ ] Update profile
- [ ] View activity log
- [ ] Test on mobile devices

## 🛠️ Development Workflow

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes and commit: `git commit -m "feat: your feature"`
3. Push to GitHub: `git push origin feature/your-feature`
4. Netlify auto-deploys preview
5. Review and merge to main
6. Production deployment

## 📚 Key Technologies

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **Hosting:** Netlify
- **Forms:** react-hook-form + Zod

## 🐛 Troubleshooting

### Build Errors

**Issue:** `Module not found: Can't resolve '@/...'`
**Solution:** Ensure `tsconfig.json` has correct path mapping

**Issue:** `Supabase client error`
**Solution:** Check `.env.local` has correct credentials

### Database Errors

**Issue:** `Row Level Security policy violation`
**Solution:** Verify RLS policies in Supabase dashboard

**Issue:** `Foreign key constraint fails`
**Solution:** Ensure member profile exists before creating tickets

### Deployment Errors

**Issue:** Build fails on Netlify
**Solution:** Check environment variables are set in Netlify

## 📞 Support

For issues or questions:
- Check the [PROGRESS.md](./PROGRESS.md) tracker
- Review [TECH_STACK.md](./TECH_STACK.md) for architecture details
- Consult [PRD.md](./PRD.md) for feature requirements

## 🎯 Next Steps

After initial setup:

1. ✅ Complete database setup in Supabase
2. ✅ Configure environment variables
3. ⏭️ Build remaining UI components
4. ⏭️ Implement auth pages
5. ⏭️ Create dashboard pages
6. ⏭️ Add tests
7. ⏭️ Deploy to production

See [PROGRESS.md](./PROGRESS.md) for detailed task tracking.

## 📄 License

Private project - All rights reserved.

---

**Built with ❤️ using Next.js, Supabase, and Netlify**
