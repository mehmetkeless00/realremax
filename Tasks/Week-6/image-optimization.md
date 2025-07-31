### Task: Image Optimization & Lazy Loading

**Description & Context:**
Optimize all property and user-uploaded images using Next.js `next/image` for responsive, performant delivery. Integrate lazy loading and placeholders for images from Supabase Storage.

**Technology Stack:** Next.js, TypeScript, Supabase Storage, Tailwind CSS

**Folder/File Path Suggestions:**

- `/components/OptimizedImage.tsx`
- `/lib/storage/`

**Dependencies:**

- Supabase Storage integration
- Property card and gallery components

**Estimated Effort:** 3 hours

**Acceptance Criteria:**

- All images use `next/image` with proper `alt`, `width`, `height`
- Lazy loading and blur placeholders are enabled
- Images from Supabase Storage are optimized
- No layout shift or broken images

**Code Example:**

```tsx
// components/OptimizedImage.tsx
import Image from 'next/image';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
}: OptimizedImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      placeholder="blur"
      blurDataURL="/placeholder.png" // Use a small base64 or static placeholder
      loading="lazy"
      className="rounded-lg object-cover"
    />
  );
}
```

// Reference: Use in `property-card-component.md`, `property-detail-page.md`.
