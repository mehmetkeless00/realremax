import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';
import ToastContainer from '@/components/ToastContainer';
import GlobalHeader from '@/components/GlobalHeader';

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Remax Unified Platform',
  description:
    'Unified real estate platform for property search and management',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} font-montserrat text-dark-charcoal antialiased`}
      >
        <GlobalHeader />
        <main>{children}</main>
        <ToastContainer />
      </body>
    </html>
  );
}
