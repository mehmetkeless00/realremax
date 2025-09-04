// src/components/property/Gallery.tsx
'use client';

import { SmartImage } from '@/lib/smart-image';

export default function Gallery({
  images,
}: {
  images: { src: string; alt?: string }[];
}) {
  if (!images?.length) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
      {images.map((img, i) => (
        <div
          key={i}
          className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted"
        >
          <SmartImage
            src={img.src}
            alt={img.alt || `Photo ${i + 1}`}
            fill
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}
