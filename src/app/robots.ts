import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://realremax-kvpi.vercel.app';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/auth/callback',
          '/dashboard/',
          '/profile',
          '/favorites',
          '/_next/',
          '/admin/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/auth/callback',
          '/dashboard/',
          '/profile',
          '/favorites',
          '/_next/',
          '/admin/',
        ],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: [
          '/api/',
          '/auth/callback',
          '/dashboard/',
          '/profile',
          '/favorites',
          '/_next/',
          '/admin/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
