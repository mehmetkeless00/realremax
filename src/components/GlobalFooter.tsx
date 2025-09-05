import { Link } from '@/i18n/navigation';
import NextLink from 'next/link';
import Logo from '@/components/Logo';
import { useTranslations } from 'next-intl';

type LinkItem = {
  label: string;
  href:
    | '/'
    | '/properties'
    | '/agents'
    | '/services'
    | '/favorites'
    | '/dashboard'
    | '/profile'
    | '/auth/signin'
    | '/auth/signup'
    | '/advanced-search-bar'
    | '/property-listing-form'
    | { pathname: '/properties'; query: { mode: string } };
};

function Section({ title, items }: { title: string; items: LinkItem[] }) {
  return (
    <nav aria-label={title} className="space-y-3">
      <h4 className="text-sm font-semibold text-fg">{title}</h4>
      <ul className="space-y-2">
        {items.map((it, index) => (
          <li key={index}>
            <Link
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              href={it.href as any}
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
  const t = useTranslations('footer');
  const year = new Date().getFullYear();

  const explore: LinkItem[] = [
    {
      label: t('buy'),
      href: { pathname: '/properties', query: { mode: 'buy' } },
    },
    {
      label: t('rent'),
      href: { pathname: '/properties', query: { mode: 'rent' } },
    },
    { label: t('agents'), href: '/agents' },
    { label: t('services'), href: '/services' },
  ];

  const account: LinkItem[] = [
    { label: t('signIn'), href: '/auth/signin' },
    { label: t('signUp'), href: '/auth/signup' },
    { label: t('favorites'), href: '/favorites' },
    { label: t('dashboard'), href: '/dashboard' },
    { label: t('profile'), href: '/profile' },
  ];

  const tools: LinkItem[] = [
    { label: t('advancedSearch'), href: '/advanced-search-bar' },
    { label: t('addListing'), href: '/property-listing-form' },
  ];

  return (
    <footer className="bg-white border-t">
      <div className="container mx-auto px-4 md:px-6 py-10 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <NextLink
              href="/"
              aria-label="Go to homepage"
              className="inline-flex items-center"
            >
              <Logo size="md" className="shrink-0" />
            </NextLink>
            <p className="text-sm text-muted-foreground">{t('tagline')}</p>
          </div>

          <Section title={t('explore')} items={explore} />
          <Section title={t('myAccount')} items={account} />
          <Section title={t('tools')} items={tools} />
        </div>

        <div className="border-top py-6 text-xs text-muted-foreground flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p>{t('copyright', { year })}</p>
          <div className="flex gap-4">
            <NextLink href="/privacy" className="hover:text-primary">
              {t('privacy')}
            </NextLink>
            <NextLink href="/terms" className="hover:text-primary">
              {t('terms')}
            </NextLink>
            <NextLink href="/contact" className="hover:text-primary">
              {t('contact')}
            </NextLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
