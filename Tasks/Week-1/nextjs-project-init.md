### Task: Initialize Next.js Project with Tailwind CSS

**Description**: Set up a Next.js project with App Router, TypeScript, and Tailwind CSS. Configure ESLint, Prettier, and basic project structure.

**PDR Reference**: None

**Dependencies**: None

**Estimated Effort**: 8 hours

**Acceptance Criteria**:

- Next.js project runs locally with `npm run dev`.
- Tailwind CSS is integrated and applies styles.
- ESLint and Prettier enforce consistent code formatting.
- Basic folder structure: `/app`, `/components`, `/lib`, `/styles`.

**Sample Code**:

```tsx
// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Remax Unified Platform',
  description:
    'Unified real estate platform for property search and management',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-montserrat text-dark-charcoal">{children}</body>
    </html>
  );
}
```

```css
// styles/globals.css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --primary-red: #ff1200;
  --primary-blue: #0043ff;
  --dark-charcoal: #232323;
  --white: #ffffff;
}
```
