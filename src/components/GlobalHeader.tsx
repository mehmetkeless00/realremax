'use client';

import { useState } from 'react';
import { usePathname } from '@/i18n/navigation';
import { Link } from '@/i18n/navigation';
import NextLink from 'next/link';
import Logo from './Logo';
import UserMenu from './UserMenu';
import { useUserStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function GlobalHeader() {
  const t = useTranslations('nav');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useUserStore();
  const pathname = usePathname();

  function NavLink({
    href,
    label,
    description,
    onClick,
  }: {
    href: string;
    label: string;
    description?: string;
    onClick?: () => void;
  }) {
    const active = pathname?.startsWith(href);
    return (
      <Link
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        href={href as any}
        onClick={onClick}
        aria-current={active ? 'page' : undefined}
        className={`block py-2 px-4 text-dark-charcoal hover:text-primary hover:bg-gray-50 rounded-md transition-colors ${
          active ? 'text-primary font-semibold' : ''
        }`}
      >
        <div className="font-medium">{label}</div>
        {description && <div className="text-sm text-muted">{description}</div>}
      </Link>
    );
  }

  const navigationLinks = [
    { href: '/properties', label: t('buyRent'), description: undefined },
    { href: '/agents', label: t('agents'), description: undefined },
    { href: '/services', label: t('services'), description: undefined },
  ];

  const handleFreeValuation = () => {
    // Navigate to services page with property valuation filter
    window.location.href = '/services?service=valuation';
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 md:px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo - Far Left */}
          <NextLink
            href="/"
            aria-label="Go to homepage"
            className="flex items-center"
          >
            <Logo size="lg" className="shrink-0" />
          </NextLink>

          {/* Desktop Navigation - Centered */}
          <nav className="hidden md:flex space-x-8">
            {navigationLinks.map((link) => {
              const active = pathname?.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  href={link.href as any}
                  aria-current={active ? 'page' : undefined}
                  className={`text-dark-charcoal hover:text-primary transition-colors font-medium relative group ${
                    active ? 'text-primary font-semibold' : ''
                  }`}
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
                </Link>
              );
            })}
          </nav>

          {/* Right side - User menu and CTA */}
          <div className="flex items-center space-x-4">
            <Link
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              href={'/favorites' as any}
              className="text-dark-charcoal hover:text-primary-red transition-colors p-2 relative"
              title={t('myFavorites')}
              aria-label={t('myFavorites')}
            >
              <span className="sr-only">{t('myFavorites')}</span>
              ❤️
            </Link>

            {user?.user_metadata?.role === 'agent' && (
              <Link
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                href={'/dashboard/listings' as any}
                className="text-dark-charcoal hover:text-primary-blue transition-colors p-2 relative"
                title="My Listings"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </Link>
            )}

            <LanguageSwitcher />
            <UserMenu />

            <Button
              onClick={handleFreeValuation}
              variant="primary"
              size="md"
              className="hidden sm:block"
            >
              {t('freeValuation')}
            </Button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-dark-charcoal hover:text-primary focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
            <nav className="pt-4 space-y-2">
              {navigationLinks.map((link) => (
                <NavLink
                  key={link.href}
                  href={link.href}
                  label={link.label}
                  description={link.description}
                  onClick={() => setIsMobileMenuOpen(false)}
                />
              ))}

              <div className="pt-2">
                <Button
                  onClick={() => {
                    handleFreeValuation();
                    setIsMobileMenuOpen(false);
                  }}
                  variant="primary"
                  size="md"
                  className="w-full"
                >
                  {t('freeValuation')}
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
