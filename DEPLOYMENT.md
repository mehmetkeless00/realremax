# Deployment Guide - Remax Unified Platform

## Vercel Deployment

### Prerequisites

- GitHub repository
- Vercel account
- Supabase project

### Step 1: Prepare Your Repository

1. **Push to GitHub**

   ```bash
   git add .
   git commit -m "Initial commit for deployment"
   git push origin main
   ```

2. **Environment Variables**
   Create a `.env.local` file locally (not committed to git):
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### Step 2: Deploy to Vercel

#### Option A: Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Configure project settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

5. **Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key

6. Click "Deploy"

#### Option B: Vercel CLI

1. **Install Vercel CLI**:

   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:

   ```bash
   vercel login
   ```

3. **Deploy**:

   ```bash
   vercel
   ```

4. **Follow the prompts**:
   - Link to existing project or create new
   - Set environment variables
   - Deploy

### Step 3: Configure Supabase

1. **Enable Auth Providers**:
   - Go to Supabase Dashboard > Authentication > Providers
   - Enable Google and Facebook OAuth
   - Configure redirect URLs:
     ```
     https://your-domain.vercel.app/auth/callback
     ```

2. **Set up Database**:
   - Run the SQL from `supabase/schema.sql` in Supabase SQL Editor
   - Enable Row Level Security (RLS)

3. **Configure Email Templates**:
   - Go to Authentication > Email Templates
   - Customize confirmation and reset emails

### Step 4: Post-Deployment

1. **Test the Application**:
   - Visit your deployed URL
   - Test user registration/login
   - Test navigation and features

2. **Set up Custom Domain** (Optional):
   - Go to Vercel Dashboard > Domains
   - Add your custom domain
   - Update Supabase redirect URLs

3. **Monitor Performance**:
   - Use Vercel Analytics
   - Monitor Supabase usage

## Environment Variables

### Required Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Optional Variables

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
```

## Build Configuration

The project uses the following build configuration:

- **Node.js Version**: 18.x
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

## Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check environment variables are set
   - Ensure all dependencies are in `package.json`
   - Check TypeScript errors with `npm run type-check`

2. **Authentication Issues**:
   - Verify Supabase URL and keys
   - Check redirect URLs in Supabase
   - Ensure OAuth providers are configured

3. **Database Connection**:
   - Verify RLS policies are set up
   - Check database schema is applied
   - Ensure Supabase project is active

### Support

For deployment issues:

1. Check Vercel deployment logs
2. Verify environment variables
3. Test locally with `npm run build`
4. Check Supabase dashboard for errors

## CI/CD Pipeline

The project is configured for automatic deployments:

- **Trigger**: Push to `main` branch
- **Build**: Automatic on Vercel
- **Preview**: Automatic for pull requests
- **Production**: Automatic for main branch

## Performance Optimization

1. **Image Optimization**: Next.js Image component
2. **Code Splitting**: Automatic with Next.js
3. **Caching**: Vercel Edge Network
4. **CDN**: Global distribution via Vercel
