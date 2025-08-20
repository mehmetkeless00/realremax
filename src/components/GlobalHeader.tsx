'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from './Logo';
import UserMenu from './UserMenu';
import { useUserStore } from '@/lib/store';
import { Button } from '@/components/ui/button';

export default function GlobalHeader() {
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
        href={href}
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
    {
      href: '/properties',
      label: 'Buy/Rent',
      description: 'Find your dream home or rental',
    },
    { href: '/agents', label: 'Agents', description: 'Find agents' },
    { href: '/services', label: 'Services', description: 'Our services' },
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
          <Link
            href="/"
            aria-label="Go to homepage"
            className="flex items-center"
          >
            <Logo size="lg" className="shrink-0" />
          </Link>

          {/* Desktop Navigation - Centered */}
          <nav className="hidden md:flex space-x-8">
            {navigationLinks.map((link) => {
              const active = pathname?.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
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
              href="/favorites"
              className="text-dark-charcoal hover:text-primary-red transition-colors p-2 relative"
              title="My Favorites"
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
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </Link>

            {user?.user_metadata?.role === 'agent' && (
              <Link
                href="/dashboard/listings"
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

            <UserMenu />

            <Button
              onClick={handleFreeValuation}
              variant="primary"
              size="md"
              className="hidden sm:block"
            >
              Free Valuation
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
                  Free Valuation
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
