# Remax Unified Platform

Unified real estate platform for property search and management built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Features

- 🏠 Property search and management
- 👥 User authentication and authorization
- 🏢 Agent management system
- 📋 Property listings with advanced filtering
- 🔒 Row-Level Security (RLS) for data protection
- 📱 Responsive design with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **State Management**: Zustand (coming soon)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm
- Supabase account

### 1. Clone and Install

```bash
git clone <repository-url>
cd proje-rem
npm install
```

### 2. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Create a `.env.local` file in the root directory:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the database schema:

```bash
# Copy the SQL from supabase/schema.sql and run it in your Supabase SQL editor
# Or use Supabase CLI if you have it installed
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Database Schema

The application uses the following PostgreSQL tables:

- **users**: User accounts with roles (visitor, registered, agent)
- **agents**: Real estate agent profiles
- **properties**: Property information and details
- **listings**: Property listings with sale/rent status

All tables have Row-Level Security (RLS) enabled for secure data access.

## Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── layout.tsx      # Root layout with metadata
│   ├── page.tsx        # Home page
│   └── globals.css     # Global styles
├── components/         # Reusable components
├── lib/               # Utility functions
│   ├── supabase.ts    # Supabase client
│   └── database.ts    # Database operations
└── styles/            # Additional styles
```

## Development

- **ESLint**: Code linting with Next.js and TypeScript rules
- **Prettier**: Code formatting
- **TypeScript**: Type safety throughout the application

## Deployment

The easiest way to deploy is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import your repository to Vercel
3. Add your environment variables
4. Deploy!

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.
