import type { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import GlobalHeader from '@/components/GlobalHeader';
import GlobalFooter from '@/components/GlobalFooter';
import ToastContainer from '@/components/ToastContainer';

async function getMessages(locale: string) {
  try {
    const [common, nav, home, properties, footer] = await Promise.all([
      import(`@/messages/${locale}/common.json`),
      import(`@/messages/${locale}/nav.json`),
      import(`@/messages/${locale}/home.json`),
      import(`@/messages/${locale}/properties.json`),
      import(`@/messages/${locale}/footer.json`),
    ]);
    return {
      ...common.default,
      nav: nav.default,
      home: home.default,
      properties: properties.default,
      footer: footer.default,
    };
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  const site = await getTranslations({ locale, namespace: 'meta' });

  // PT default + 'as-needed' => PT kanonik "/"
  return {
    title: { default: t('title'), template: `%s | ${site('siteName')}` },
    description: t('description'),
    alternates: { languages: { en: '/en', pt: '/' } },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages(locale);
  if (!messages) return notFound();

  // <<< DİKKAT: Burada ARTIK html/body YOK >>>
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <GlobalHeader />
      <main>{children}</main>
      <GlobalFooter />
      <ToastContainer />
    </NextIntlClientProvider>
  );
}
