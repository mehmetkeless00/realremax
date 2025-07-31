### Task: Design System & Tailwind Theme Setup

**Description & Context:**
Centralize the color palette, typography, and spacing in `tailwind.config.js`. Apply consistent class naming conventions and responsive design patterns. Document font usage (Montserrat, Gotham) and ensure accessibility contrast.

**Technology Stack:** Tailwind CSS, Next.js, TypeScript

**Folder/File Path Suggestions:**

- `/tailwind.config.js`
- `/styles/`
- `/docs/design-system.md`

**Dependencies:**

- None (should be done early in project)

**Estimated Effort:** 3 hours

**Acceptance Criteria:**

- All colors, fonts, and spacing are defined in Tailwind config
- Typography and color contrast meet accessibility standards
- Font usage is documented and imported
- Responsive utility classes are used consistently

**Code Example:**

```js
// tailwind.config.js (snippet)
module.exports = {
  theme: {
    extend: {
      colors: {
        'primary-red': '#ff1200',
        'primary-blue': '#0043ff',
        'dark-charcoal': '#232323',
      },
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
        gotham: ['Gotham', 'Arial', 'sans-serif'],
      },
    },
  },
};
```

```css
/* styles/globals.css (snippet) */
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap');
:root {
  --primary-red: #ff1200;
  --primary-blue: #0043ff;
  --dark-charcoal: #232323;
}
```

// Reference: Use in all UI components, see also `responsive-testing-checklist.md`.
