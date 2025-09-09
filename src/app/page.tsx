import HeroSearch from '@/components/home/HeroSearch';
import ListingCarousel from '@/components/home/ListingCarousel';
import RegionChips from '@/components/home/RegionChips';
import CorporateCTA from '@/components/home/CorporateCTA';
import { listRecentProperties } from '@/server/db/properties';

export const revalidate = 60; // ISR: refresh every 60 seconds

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  type CarouselItem = {
    id: string;
    title: string;
    price?: number | null;
    location: string | null;
    city?: string;
    country?: string;
    photos?: string[];
    og_image_url?: string;
    slug?: string;
    type?: string;
    bedrooms?: number | null;
    bathrooms?: number | null;
    size?: number | null;
    published_at?: string | null;
    created_at?: string | null;
    coverUrl?: string | null;
  };
  // Fetch real active listings
  let recentListings: Awaited<ReturnType<typeof listRecentProperties>> = [];
  let weeklyListings: Awaited<ReturnType<typeof listRecentProperties>> = [];

  try {
    // Get most recent listings (no strict status filter in dev)
    recentListings = await listRecentProperties(8);

    // Get listings from the last 7 days (if any)
    const allListings = await listRecentProperties(20);
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const toDate = (v: unknown): Date | null => {
      if (typeof v === 'string' || typeof v === 'number') {
        const d = new Date(v);
        return isNaN(d.getTime()) ? null : d;
      }
      if (v instanceof Date) return v;
      return null;
    };

    weeklyListings = allListings
      .filter((listing) => {
        const l = listing as Record<string, unknown>;
        const publishedDate =
          toDate(l['published_at']) ?? toDate(l['created_at']) ?? new Date(0);
        return publishedDate >= oneWeekAgo;
      })
      .slice(0, 8);
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[home] listings load failed:', (error as Error).message);
    }
    recentListings = [];
    weeklyListings = [];
  }

  return (
    <div className="container mx-auto px-4 md:px-6">
      <section className="py-10 md:py-16">
        <HeroSearch />
      </section>

      <section className="py-8 md:py-12">
        {recentListings.length > 0 ? (
          <ListingCarousel
            title="Most Recent"
            seeAllHref="/properties?sort=recent"
            items={recentListings as unknown as CarouselItem[]}
            limit={8}
          />
        ) : (
          <div className="text-center text-muted-foreground">
            No listings available.
          </div>
        )}
      </section>

      <section className="py-8 md:py-12">
        {weeklyListings.length > 0 ? (
          <ListingCarousel
            title="New this week"
            seeAllHref="/properties?sort=recent&recent_days=7"
            items={weeklyListings as unknown as CarouselItem[]}
            limit={8}
          />
        ) : null}
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
