'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useUserStore } from '@/lib/store';
import { signOut } from '@/lib/auth';
import { Button } from '@/components/ui/button';

export default function UserMenu() {
  const { user, profile, signOut: signOutFromStore } = useUserStore();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      signOutFromStore();
      setIsOpen(false);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center space-x-4">
        <Link
          href="/auth/signin"
          className="text-dark-charcoal hover:text-primary-blue font-medium"
        >
          Sign In
        </Link>
        <Button asChild variant="primary" size="sm">
          <Link href="/auth/signup">
            <span>Sign Up</span>
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-dark-charcoal hover:text-primary-blue focus:outline-none"
      >
        <div className="w-6 h-6 bg-primary-red rounded-full flex items-center justify-center text-white font-medium">
          {profile?.name
            ? profile.name.charAt(0).toUpperCase()
            : user.email?.charAt(0).toUpperCase()}
        </div>
        <span className="hidden md:block font-medium">
          {profile?.name || user.email}
        </span>
        <svg
          className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
          <div className="px-4 py-3 border-b border-border">
            <p className="text-sm font-medium text-fg">Signed in as</p>
            <p className="text-xs text-muted">{user.email}</p>
            <p className="text-xs text-muted capitalize">
              {user.role || 'visitor'}
            </p>
          </div>

          <div className="py-1">
            <Link
              href="/profile"
              className="block px-4 py-2 text-sm text-fg hover:bg-black/5"
            >
              Profile
            </Link>
            <Link
              href="/dashboard"
              className="block px-4 py-2 text-sm text-fg hover:bg-black/5"
            >
              Dashboard
            </Link>
            <Link
              href="/favorites"
              className="block px-4 py-2 text-sm text-fg hover:bg-black/5"
            >
              Favorites
            </Link>
          </div>

          <div className="py-1 border-t border-border">
            <button
              onClick={handleSignOut}
              className="block w-full text-left px-4 py-2 text-sm text-fg hover:bg-black/5"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
