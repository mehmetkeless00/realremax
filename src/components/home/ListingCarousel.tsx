import Link from 'next/link';
import Image from 'next/image';
import { listingsCardProps, type ListingItem } from '@/data/home';

type Props = {
  title: string;
  seeAllHref: string;
  dataKey?: keyof typeof listingsCardProps; // optional now
  items?: ListingItem[];
  limit?: number;
};

export default function ListingCarousel({
  title,
  seeAllHref,
  dataKey = 'recent',
  items,
  limit,
}: Props) {
  const all = items ?? listingsCardProps[dataKey];
  const list = typeof limit === 'number' ? all.slice(0, limit) : all;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl md:text-3xl font-bold text-fg">{title}</h2>
        <Link href={seeAllHref} className="text-sm hover:text-primary">
          See all →
        </Link>
      </div>

      {/* Mobile: horizontal scroll; Desktop: grid */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-6
                      lg:[&>*]:snap-none
                      overflow-x-auto snap-x lg:overflow-visible"
      >
        {list.map((it) => (
          <Link
            key={it.id}
            href={`/properties/${it.id}`}
            className="min-w-[260px] lg:min-w-0 snap-start rounded-2xl bg-white border shadow-sm overflow-hidden hover:shadow-md transition"
          >
            <div className="relative aspect-video">
              <Image
                src={it.img}
                alt={it.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <div className="font-semibold">{it.price}</div>
              <div className="text-sm text-muted">{it.location}</div>
              {'tag' in it && it.tag ? (
                <div className="mt-2 inline-block text-xs rounded-full border px-2 py-1">
                  {it.tag}
                </div>
              ) : null}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
