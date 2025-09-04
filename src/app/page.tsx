import HeroSearch from '@/components/home/HeroSearch';
import ListingCarousel from '@/components/home/ListingCarousel';
import RegionChips from '@/components/home/RegionChips';
import CorporateCTA from '@/components/home/CorporateCTA';
import { listActiveListings } from '@/server/db/listings';

export const revalidate = 60; // ISR: refresh every 60 seconds

export default async function HomePage() {
  // Fetch real active listings
  let recentListings: Awaited<ReturnType<typeof listActiveListings>> = [];
  let weeklyListings: Awaited<ReturnType<typeof listActiveListings>> = [];

  try {
    // Get most recent active listings
    recentListings = await listActiveListings(8);

    // Get listings from the last 7 days (if any)
    const allListings = await listActiveListings(20);
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    weeklyListings = allListings
      .filter((listing) => {
        const publishedDate = listing.published_at
          ? new Date(listing.published_at)
          : new Date(listing.created_at);
        return publishedDate >= oneWeekAgo;
      })
      .slice(0, 8);
  } catch (error) {
    // Fail quietly; show empty state
    console.error('Failed to fetch listings:', error);
  }

  return (
    <div className="container mx-auto px-4 md:px-6">
      <section className="py-10 md:py-16">
        <HeroSearch />
      </section>

      <section className="py-8 md:py-12">
        <ListingCarousel
          title="Most Recent"
          seeAllHref="/properties?sort=recent"
          items={recentListings}
          limit={8}
        />
      </section>

      <section className="py-8 md:py-12">
        <ListingCarousel
          title="New this week"
          seeAllHref="/properties?sort=recent&recent_days=7"
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
