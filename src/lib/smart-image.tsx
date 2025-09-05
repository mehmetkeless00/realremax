// src/lib/smart-image.tsx
'use client';

import Image from 'next/image';
import { isRenderableSrc, isSupabaseOrSigned } from '@/lib/image-helpers';

/**
 * SmartImage: src yoksa img render etmez (veya boş blok),
 * Supabase/signed URL'lerde unoptimized kullanır.
 */
export function SmartImage(props: {
  src?: string | null;
  alt?: string;
  fill?: boolean;
  className?: string;
  placeholder?: 'empty' | 'block';
}) {
  const { src, alt, fill, className, placeholder = 'block' } = props;

  if (!isRenderableSrc(src)) {
    if (placeholder === 'empty') return null;
    return <div className={className} aria-label="no-image" />;
  }

  return (
    <Image
      src={src}
      alt={alt || 'image'}
      fill={fill}
      className={className}
      unoptimized={isSupabaseOrSigned(src)}
      onError={(e) => {
        // son çare: native <img> ile göster
        const parent = (e.target as HTMLImageElement).parentElement;
        if (!parent) return;
        const img = document.createElement('img');
        img.src = src;
        img.alt = alt || 'image';
        Object.assign(img.style, {
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        });
        parent.innerHTML = '';
        parent.appendChild(img);
      }}
    />
  );
}
