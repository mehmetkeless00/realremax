import createMiddleware from 'next-intl/middleware';
import { routing } from './src/i18n/routing';

export default createMiddleware(routing);

// Explicitly include "/" so default-locale root is always handled
export const config = {
  matcher: ['/', '/((?!api|_next|_vercel|.*\\..*).*)'],
};
