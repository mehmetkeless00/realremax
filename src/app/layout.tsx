import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';
import ToastContainer from '@/components/ToastContainer';
import GlobalHeader from '@/components/GlobalHeader';
import { generatePageMetadata } from '@/components/SeoHead';
import {
  WebsiteStructuredData,
  LocalBusinessStructuredData,
} from '@/components/StructuredData';
import GoogleAnalytics from '@/components/GoogleAnalytics';

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
});

export const metadata: Metadata = generatePageMetadata('home', {
  title: 'RealRemax - Find Your Dream Property',
  description:
    'Discover the perfect property for sale or rent. Browse thousands of listings with detailed information, photos, and virtual tours. Your trusted partner in real estate.',
  keywords: [
    'real estate',
    'property search',
    'houses for sale',
    'apartments for rent',
    'real estate listings',
    'buy property',
    'rent property',
  ],
  url: 'https://realremax-kvpi.vercel.app',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#1e40af" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={`${montserrat.variable} font-montserrat text-dark-charcoal antialiased`}
      >
        <WebsiteStructuredData />
        <LocalBusinessStructuredData />
        <GlobalHeader />
        <main>{children}</main>
        <ToastContainer />
        <GoogleAnalytics
          measurementId={
            process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX'
          }
        />
      </body>
    </html>
  );
}
