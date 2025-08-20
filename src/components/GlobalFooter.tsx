import Link from 'next/link';
import Logo from '@/components/Logo';

type LinkItem = { label: string; href: string };

const explore: LinkItem[] = [
  { label: 'Buy', href: '/properties?mode=buy' },
  { label: 'Rent', href: '/properties?mode=rent' },
  { label: 'Agents', href: '/agents' },
  { label: 'Services', href: '/services' },
];

const account: LinkItem[] = [
  { label: 'Sign in', href: '/auth/signin' },
  { label: 'Sign up', href: '/auth/signup' },
  { label: 'Favorites', href: '/favorites' },
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Profile', href: '/profile' },
];

const tools: LinkItem[] = [
  { label: 'Advanced Search', href: '/advanced-search-bar' },
  { label: 'Add Listing', href: '/property-listing-form' },
];

function Section({ title, items }: { title: string; items: LinkItem[] }) {
  return (
    <nav aria-label={title} className="space-y-3">
      <h4 className="text-sm font-semibold text-fg">{title}</h4>
      <ul className="space-y-2">
        {items.map((it) => (
          <li key={it.href}>
            <Link
              href={it.href}
              className="text-sm text-muted-foreground hover:text-primary"
            >
              {it.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default function GlobalFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white border-t">
      <div className="container mx-auto px-4 md:px-6">
        {/* Top */}
        <div className="py-12 grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link
              href="/"
              aria-label="Go to homepage"
              className="inline-flex items-center"
            >
              <Logo size="md" className="shrink-0" />
            </Link>
            <p className="text-sm text-muted-foreground">
              Discover properties, connect with trusted agents, and make
              confident decisions.
            </p>
          </div>

          <Section title="Explore" items={explore} />
          <Section title="My Account" items={account} />
          <Section title="Tools" items={tools} />
        </div>

        {/* Bottom */}
        <div className="border-t py-6 text-xs text-muted-foreground flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p>© {year} Remax Wise — All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-primary">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-primary">
              Terms
            </Link>
            <Link href="/contact" className="hover:text-primary">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
