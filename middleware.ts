import createMiddleware from 'next-intl/middleware';
import { routing } from './src/i18n/routing';

export default createMiddleware(routing);

// Proper matcher for next-intl v4 with root handling
export const config = {
  matcher: [
    // Root route
    '/',
    // Locale routes
    '/(pt|en)/:path*',
    // All other routes except static files
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
};
