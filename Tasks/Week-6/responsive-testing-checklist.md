### Task: Responsive Testing Checklist

**Description**: Ensure all UI components and pages are fully responsive across device sizes using Tailwind CSS and browser tools.

**Checklist:**

- Test all pages/components at breakpoints: sm, md, lg, xl
- Verify navigation, forms, and modals on mobile
- Check for horizontal scroll and overflow issues
- Use browser dev tools and device emulation
- Validate touch targets and font sizes

**Folder/File Path Suggestions:**

- `/__tests__/responsive/`
- `/components/`

**Acceptance Criteria:**

- No horizontal scroll on any page
- All interactive elements are accessible on mobile
- Layout adapts to all breakpoints

**Estimated Effort:** 2 hours

**Example:**

```tsx
// __tests__/responsive/PropertyCard.responsive.test.tsx
import { render } from '@testing-library/react';
import PropertyCard from '@/components/PropertyCard';

test('PropertyCard is responsive', () => {
  const { container } = render(
    <PropertyCard
      property={{
        id: '1',
        image: '',
        price: 1,
        location: '',
        bedrooms: 1,
        bathrooms: 1,
        size: 1,
      }}
    />
  );
  // Simulate different viewport sizes and assert layout
  // (Use jest-environment-jsdom-fourteen or similar for window resize)
  expect(container.firstChild).toHaveClass('rounded-lg');
});
```
