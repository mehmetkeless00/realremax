### Task: Create Global Header Component

**Description**: Build a responsive global header with logo, navigation links (Buy, Rent, Agents, Services), and user menu using Tailwind CSS.

**PDR Reference**: Global Header (Section 4.2.1)

**Dependencies**: None

**Estimated Effort**: 6 hours

**Acceptance Criteria**:
- Header displays logo, navigation links, and user menu.
- Responsive design with hamburger menu for mobile (<768px).
- Links navigate to correct routes using Next.js App Router.
- Styles match PDR color palette and typography.

**Sample Code**:
```tsx
// components/GlobalHeader.tsx
'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function GlobalHeader() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-primary-red font-gotham font-bold text-2xl">Remax</Link>
        <nav className="hidden md:flex space-x-6">
          <Link href="/buy" className="text-dark-charcoal hover:text-primary-blue">Buy</Link>
          <Link href="/rent" className="text-dark-charcoal hover:text-primary-blue">Rent</Link>
          <Link href="/agents" className="text-dark-charcoal hover:text-primary-blue">Agents</Link>
          <Link href="/services" className="text-dark-charcoal hover:text-primary-blue">Services</Link>
        </nav>
        <div className="flex items-center space-x-4">
          <button className="text-dark-charcoal">Account</button>
          <button className="bg-primary-red text-white px-4 py-2 rounded">Free Valuation</button>
          <button className="md:hidden" onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}>☰</button>
        </div>
      </div>
      {isMobileMenuOpen && (
        <nav className="md:hidden bg-white px-4 py-2">
          <Link href="/buy" className="block py-2">Buy</Link>
          <Link href="/rent" className="block py-2">Rent</Link>
          <Link href="/agents" className="block py-2">Agents</Link>
          <Link href="/services" className="block py-2">Services</Link>
        </nav>
      )}
    </header>
  );
}
```