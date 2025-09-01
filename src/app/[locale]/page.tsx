import HeroSearch from '@/components/home/HeroSearch';
import ListingCarousel from '@/components/home/ListingCarousel';
import RegionChips from '@/components/home/RegionChips';
import CorporateCTA from '@/components/home/CorporateCTA';
import { listPublishedListings } from '@/server/db/listings';
import { getTranslations } from 'next-intl/server';

export const revalidate = 60;

export default async function HomePage() {
  const t = await getTranslations('home');
  let recentListings = [] as Awaited<ReturnType<typeof listPublishedListings>>;
  let weeklyListings = [] as Awaited<ReturnType<typeof listPublishedListings>>;

  try {
    recentListings = await listPublishedListings(8);
    const all = await listPublishedListings(20);
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    weeklyListings = all
      .filter((l) => {
        const d = l.published_at
          ? new Date(l.published_at)
          : new Date(l.created_at);
        return d >= oneWeekAgo;
      })
      .slice(0, 8);
  } catch (e) {
    console.error('Failed to fetch listings:', e);
  }

  return (
    <div className="container mx-auto px-4 md:px-6">
      <section className="py-10 md:py-16">
        <HeroSearch />
      </section>

      <section className="py-8 md:py-12">
        <ListingCarousel
          title={t('sections.mostRecent')}
          seeAllHref={{ pathname: '/properties', query: { sort: 'recent' } }}
          items={recentListings}
          limit={8}
        />
      </section>

      <section className="py-8 md:py-12">
        <ListingCarousel
          title={t('sections.newThisWeek')}
          seeAllHref={{ pathname: '/properties', query: { sort: 'recent' } }}
          items={weeklyListings}
          limit={8}
        />
      </section>

      <section className="py-8 md:py-12">
        <RegionChips />
      </section>

      <section className="py-10 md:py-16">
        <CorporateCTA />
      </section>
    </div>
  );
}
