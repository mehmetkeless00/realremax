import HeroSearch from '@/components/home/HeroSearch';
import ListingCarousel from '@/components/home/ListingCarousel';
import RegionChips from '@/components/home/RegionChips';
import CorporateCTA from '@/components/home/CorporateCTA';
import QuickSearchTags from '@/components/home/QuickSearchTags';

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 md:px-6">
      <section className="py-10 md:py-16">
        <HeroSearch />
      </section>

      <section className="py-8 md:py-12">
        <ListingCarousel
          title="Most Recent"
          seeAllHref="/properties?sort=new"
          dataKey="recent"
        />
      </section>

      <section className="py-8 md:py-12">
        <ListingCarousel
          title="RE/MAX Collection"
          seeAllHref="/collection"
          dataKey="collection"
        />
      </section>

      <section className="py-8 md:py-12">
        <ListingCarousel
          title="Developments"
          seeAllHref="/developments"
          dataKey="developments"
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
