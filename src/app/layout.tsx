import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';
import ToastContainer from '@/components/ToastContainer';
import GlobalHeader from '@/components/GlobalHeader';
import GlobalFooter from '@/components/GlobalFooter';

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  ),
  title: {
    default: 'Remax Unified Platform',
    template: '%s | Remax Unified Platform',
  },
  description:
    'Unified real estate platform for property search and management. Find your perfect property with trusted agents.',
  keywords: ['real estate', 'property', 'buy', 'rent', 'agents', 'remax'],
  authors: [{ name: 'Remax Team' }],
  creator: 'Remax Team',
  publisher: 'Remax Unified Platform',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Remax Unified Platform',
    description:
      'Unified real estate platform for property search and management',
    siteName: 'Remax Unified Platform',
    images: [
      {
        url: '/logo.png',
        width: 120,
        height: 120,
        alt: 'Remax Unified Platform Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Remax Unified Platform',
    description:
      'Unified real estate platform for property search and management',
    images: ['/logo.png'],
    creator: '@remax',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} font-sans text-fg antialiased`}>
        <GlobalHeader />
        <main>{children}</main>
        <GlobalFooter />
        <ToastContainer />
      </body>
    </html>
  );
}
