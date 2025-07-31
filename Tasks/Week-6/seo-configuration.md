### Task: Next.js SEO & Social Meta Tags

**Description & Context:**
Configure SEO and social meta tags for all pages using `next/head`. Add Open Graph and Twitter card support. Automate dynamic metadata for property pages.

**Technology Stack:** Next.js, TypeScript

**Folder/File Path Suggestions:**

- `/components/SeoHead.tsx`
- `/app/property/[id]/page.tsx`

**Dependencies:**

- None

**Estimated Effort:** 2 hours

**Acceptance Criteria:**

- All pages have unique title, description, and meta tags
- Open Graph and Twitter cards are present
- Property pages generate dynamic metadata

**Code Example:**

```tsx
// components/SeoHead.tsx
import Head from 'next/head';

interface SeoHeadProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
}

export default function SeoHead({
  title,
  description,
  image,
  url,
}: SeoHeadProps) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {image && <meta property="og:image" content={image} />}
      {url && <meta property="og:url" content={url} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}
    </Head>
  );
}
```

// Reference: Use in all page components, see also `property-detail-page.md` for dynamic SEO.
