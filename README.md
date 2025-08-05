# Remax Unified Platform

Unified real estate platform for property search and management built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Features

- 🏠 Property search and management
- 👥 User authentication and authorization
- 🏢 Agent management system
- 📋 Property listings with advanced filtering
  - 🔒 Row-Level Security (RLS) for data protection
  - 📱 Responsive design with Tailwind CSS
  - 🔍 Advanced search with filters
  - ❤️ Favorites system with real-time updates
  - 📸 Property photo upload and management
  - 📞 Property inquiry system
  - 🗺️ Google Maps integration
  - 📊 Google Analytics 4 integration
  - 📈 SEO optimized with structured data

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **State Management**: Zustand
- **Form Handling**: React Hook Form + Zod
- **Testing**: Jest, React Testing Library
- **Deployment**: Vercel
- **Analytics**: Google Analytics 4

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm
- Supabase account
- Google Analytics 4 account (for production)

### 1. Clone and Install

```bash
git clone <repository-url>
cd proje-rem
npm install
```

### 2. Environment Setup

Create a `.env.local` file in the root directory:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Google Analytics 4
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
```

### 3. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and keys
3. Run the database schema from `supabase/schema.sql`
4. Apply RLS policies from `supabase/policies/`

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server

# Code Quality
npm run lint            # Run ESLint
npm run lint:fix        # Fix ESLint errors
npm run type-check      # TypeScript type checking
npm run format          # Format code with Prettier
npm run format:check    # Check code formatting

# Testing
npm run test            # Run all tests
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Run tests with coverage
npm run test:ci         # Run tests for CI
npm run test:production # Run production verification tests

# Deployment
npm run deploy:staging    # Deploy to staging
npm run deploy:production # Deploy to production
npm run post-deploy:check # Post-deployment verification
```

## Database Schema

The application uses the following PostgreSQL tables:

- **users**: User accounts with roles (visitor, registered, agent)
- **agents**: Real estate agent profiles
- **properties**: Property information and details
- **listings**: Property listings with sale/rent status
- **favorites**: User favorite properties
- **inquiries**: Property inquiries from users

All tables have Row-Level Security (RLS) enabled for secure data access.

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # User dashboard
│   ├── properties/        # Property pages
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── forms/            # Form components
│   └── ...               # Other components
├── lib/                  # Utility functions
│   ├── store/            # Zustand stores
│   ├── utils/            # Utility functions
│   └── validation/       # Zod schemas
└── types/                # TypeScript types
```

## Testing

The project includes comprehensive testing:

- **Unit Tests**: Component and utility function tests
- **Integration Tests**: API and user flow tests
- **E2E Tests**: End-to-end user journey tests
- **Accessibility Tests**: WCAG compliance tests
- **Performance Tests**: Core Web Vitals tests
- **Production Tests**: Post-deployment verification

Run tests with:

```bash
npm run test              # All tests
npm run test:coverage     # With coverage report
npm run test:production   # Production verification
```

## SEO Features

- ✅ Meta tags and Open Graph
- ✅ Twitter Cards
- ✅ Structured data (JSON-LD)
- ✅ Sitemap.xml generation
- ✅ Robots.txt configuration
- ✅ Google Analytics 4 integration
- ✅ Core Web Vitals optimization

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Import your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy with: `npm run deploy:production`

### Post-Deployment Checklist

See `DEPLOYMENT_CHECKLIST.md` for a comprehensive deployment verification guide.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm run test`
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
