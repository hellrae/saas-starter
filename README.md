# Modern SaaS Starter Kit

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A production-ready starter template for building modern SaaS applications with Next.js and TypeScript. This boilerplate provides a solid foundation with built-in authentication, email workflows, database integration, and a polished UI components system.

## Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe code
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Pre-built UI components
- **React Hook Form** - Form handling
- **Sonner** - Toast notifications
- **React Email** - Email template components

### Backend
- **tRPC** - End-to-end typesafe APIs
- **better-auth** - Secure authentication and session management
- **Drizzle ORM** - Type-safe database operations
- **PostgreSQL** - Database
- **Resend** - Email delivery service

### Development
- **Biome** - Fast linting and formatting
- **Zod** - Runtime validation
- **pnpm** - Fast, disk space efficient package manager
- **T3 Env** - Type-safe environment variables
- **React Email** - Type-safe email templates
- **Centralized SEO Config** - Easy-to-manage SEO settings

## Folder Structure

```
src/
├── app/              # Next.js App Router pages and layouts
│   ├── (auth)/      # Authentication-related routes
│   └── api/         # API routes for auth and tRPC
├── components/       # Reusable React components
│   ├── forms/       # Form components for auth and account management
│   └── ui/          # Base UI components (shadcn/ui)
├── lib/             # Core utilities and configurations
│   ├── auth/        # Authentication setup and handlers
│   ├── trpc/        # tRPC client configuration
│   └── utils/       # Helper functions and utilities
├── server/          # Server-side code
│   ├── db/          # Database schema and configuration
│   ├── email/       # Email templates and sending logic
│   └── trpc/        # tRPC router and procedure definitions
└── types/           # TypeScript type definitions
```

## Core Features

### Authentication
- Complete email & password authentication flow
- Social authentication support
- Password reset workflow
- Email verification
- Session management
- Account settings and profile updates

### Email System
- Transactional email templates
- Email verification workflow
- Password reset emails
- Email change verification
- Responsive email designs with React Email

### Database & API
- Type-safe database schema with Drizzle ORM
- PostgreSQL database integration
- tRPC for type-safe API routes
- Efficient data fetching with React Query

### UI/UX
- Modern, responsive design
- Dark mode support
- Form validation and error handling
- Toast notifications
- Loading states and feedback
- Accessible components
- Consistent typography system

## Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/hellrae/saas-starter.git
cd saas-starter
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up your environment variables:

   a. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

   b. Update the `.env` file with your values:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/your_database"

   # Auth
   BETTER_AUTH_SECRET="your-long-secret-key-min-32-chars"
   DOMAIN_NAME="yourdomain.com"

   # Email (Resend.com)
   RESEND_API_KEY="re_..." # Get from https://resend.com

   # Public URLs
   NEXT_PUBLIC_BASE_URL="http://localhost:3000"
   NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:3000/api/auth"
   ```

All environment variables are type-safe and validated at runtime using `@t3-oss/env-nextjs`. The schema is defined in `src/lib/utils/env.ts`.

4. Set up the database:
```bash
pnpm db:push    # Push schema to database
pnpm db:migrate # Run migrations
```

5. Start the development server:
```bash
pnpm dev
```

## Customization Guide

### Adding New Routes
1. Create new pages in `src/app/` following Next.js App Router conventions
2. Add corresponding API routes in `src/app/api/` if needed
3. Create tRPC procedures in `src/server/trpc/routers/`

### Database Schema
1. Modify or add schemas in `src/server/db/schema/`
2. Generate migrations:
```bash
pnpm db:generate
pnpm db:push
```

### Adding UI Components
1. Install new shadcn/ui components:
```bash
pnpm ui:add [component-name]
```
2. Create custom components in `src/components/`
3. Style with Tailwind CSS utilities

### Email Templates
1. Add new email templates in `src/server/email/templates/`
2. Use React Email components for consistent styling
3. Register new email types in `src/server/email/index.ts`

### Typography & Fonts
The starter uses Next.js built-in font optimization with a centralized font management system:

1. Font Configuration:
   - Geist Sans as primary font
   - Geist Mono for code and monospace content
   - CSS variables for consistent font usage
   ```typescript
   const geistSans = Geist({
     variable: "--font-geist-sans",
     subsets: ["latin"],
   });
   
   const geistMono = Geist_Mono({
     variable: "--font-geist-mono",
     subsets: ["latin"],
   });
   ```

### SEO Configuration
The starter includes a comprehensive SEO system with:

1. Centralized SEO Configuration in `src/lib/utils/seo.ts`:
```typescript
export const appSeo = {
  name: "Your App Name",
  title: "Your App Name – Your Tagline",
  description: "Your app description",
  url: "https://yourdomain.com",
  // OpenGraph, Twitter cards, icons, etc.
}
```

2. Advanced Metadata Features:
   - OpenGraph and Twitter Cards
   - JSON-LD structured data
   - Automatic canonical URLs
   - Customizable metadata per page
   - SEO-friendly robots configuration
   - PWA manifest support

3. Usage:
   - Global SEO settings are automatically applied through the root layout
   - Override metadata in any page using Next.js Metadata API
   - Example page override:
   ```typescript
   export const metadata = {
     title: "Custom Page Title",
     description: "Custom page description",
     // Will inherit other settings from root layout
   }
   ```

4. SEO Best Practices:
   - Semantic HTML structure
   - Proper heading hierarchy
   - Responsive images with alt text
   - Schema.org JSON-LD integration
   - Mobile-friendly viewport settings

### Environment Variables
1. Add new environment variables in `src/lib/utils/env.ts`
2. Variables are validated using Zod schemas:
```typescript
server: {
  DATABASE_URL: z.string().min(1),
  // Add server-side variables
},
client: {
  NEXT_PUBLIC_BASE_URL: z.string().min(1),
  // Add client-side variables
}
```
3. TypeScript will enforce usage of these variables throughout the application

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
