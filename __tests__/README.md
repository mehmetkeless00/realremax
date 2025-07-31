# Comprehensive Testing Guide

Bu klasör, Remax Unified Platform için kapsamlı test yapısını içerir.

## 📁 Test Yapısı

```
__tests__/
├── components/          # Unit Tests - Component testing
│   ├── PropertyCard.test.tsx
│   ├── PropertyListingForm.test.tsx
│   └── InquiryManagement.test.tsx
├── api/                # API Tests - Backend endpoint testing
│   ├── properties.test.ts
│   ├── inquiry.test.ts
│   └── auth.test.ts
├── integration/        # Integration Tests - End-to-end workflows
│   ├── property-flow.test.ts
│   └── user-flow.test.ts
├── performance/        # Performance Tests - Core Web Vitals
│   ├── core-web-vitals.test.ts
│   └── lighthouse.test.ts
└── accessibility/      # Accessibility Tests - WCAG compliance
    ├── wcag.test.ts
    └── a11y.test.ts
```

## 🧪 Test Kategorileri

### 1. Unit Tests (`components/`)

- **Amaç**: Bireysel component'lerin doğru çalıştığını test eder
- **Kapsam**: Rendering, props, state, user interactions
- **Örnek**: PropertyCard component'inin doğru bilgileri gösterdiğini test etme

### 2. API Tests (`api/`)

- **Amaç**: Backend API endpoint'lerinin doğru çalıştığını test eder
- **Kapsam**: CRUD operations, error handling, validation
- **Örnek**: Property creation, update, deletion işlemlerini test etme

### 3. Integration Tests (`integration/`)

- **Amaç**: Birden fazla component ve API'nin birlikte çalışmasını test eder
- **Kapsam**: User workflows, data flow, state management
- **Örnek**: Property creation'dan inquiry submission'a kadar olan süreci test etme

### 4. Performance Tests (`performance/`)

- **Amaç**: Uygulamanın performans metriklerini test eder
- **Kapsam**: Core Web Vitals, bundle size, loading times
- **Örnek**: LCP, FID, CLS değerlerinin kabul edilebilir seviyelerde olmasını test etme

### 5. Accessibility Tests (`accessibility/`)

- **Amaç**: WCAG 2.1 AA uyumluluğunu test eder
- **Kapsam**: Screen reader support, keyboard navigation, color contrast
- **Örnek**: Tüm interactive element'lerin keyboard ile erişilebilir olmasını test etme

## 🚀 Test Çalıştırma

### Tüm Testleri Çalıştırma

```bash
npm test
```

### Belirli Test Kategorisini Çalıştırma

```bash
# Sadece component testleri
npm test __tests__/components/

# Sadece API testleri
npm test __tests__/api/

# Sadece accessibility testleri
npm test __tests__/accessibility/
```

### Watch Mode (Geliştirme sırasında)

```bash
npm run test:watch
```

### Coverage Raporu

```bash
npm run test:coverage
```

### CI/CD için

```bash
npm run test:ci
```

## 📊 Test Coverage Hedefleri

- **Branches**: %70
- **Functions**: %70
- **Lines**: %70
- **Statements**: %70

## 🛠️ Test Konfigürasyonu

### Jest Konfigürasyonu (`jest.config.js`)

- Next.js ile entegre
- TypeScript desteği
- Module path mapping (`@/` prefix)
- Coverage thresholds
- Test environment: jsdom

### Test Setup (`jest.setup.js`)

- Testing Library setup
- Next.js router mocks
- Supabase mocks
- Zustand store mocks
- Global mocks (fetch, IntersectionObserver, etc.)

## 📝 Test Yazma Kuralları

### 1. Test İsimlendirme

```typescript
describe('ComponentName', () => {
  describe('Feature', () => {
    test('should do something when condition', () => {
      // test implementation
    });
  });
});
```

### 2. Arrange-Act-Assert Pattern

```typescript
test('should render property title', () => {
  // Arrange
  const mockProperty = { title: 'Test Property' }

  // Act
  render(<PropertyCard property={mockProperty} />)

  // Assert
  expect(screen.getByText('Test Property')).toBeInTheDocument()
})
```

### 3. Mock Kullanımı

```typescript
// API calls için
jest.mock('@/lib/supabase');

// User interactions için
const user = userEvent.setup();
await user.click(button);
```

## 🔧 Test Utilities

### Custom Render Function

```typescript
import { render } from '@testing-library/react'
import { ThemeProvider } from '@/components/ThemeProvider'

const customRender = (ui, options = {}) => {
  return render(ui, {
    wrapper: ({ children }) => (
      <ThemeProvider>{children}</ThemeProvider>
    ),
    ...options,
  })
}
```

### Test Data Factories

```typescript
const createMockProperty = (overrides = {}) => ({
  id: '1',
  title: 'Test Property',
  price: 450000,
  location: 'Amsterdam',
  status: 'active',
  ...overrides,
});
```

## 🐛 Debugging Tests

### Debug Mode

```bash
npm test -- --verbose
```

### Single Test Debug

```bash
npm test -- --testNamePattern="should render property title"
```

### Visual Debug

```typescript
import { screen } from '@testing-library/react';

// DOM'u konsola yazdır
screen.debug();

// Belirli element'i debug et
screen.debug(screen.getByRole('button'));
```

## 📈 Performance Testing

### Core Web Vitals

- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### Bundle Size Limits

- **Main Bundle**: < 300KB
- **Vendor Bundle**: < 600KB
- **Total Bundle**: < 1MB

## ♿ Accessibility Testing

### WCAG 2.1 AA Requirements

- **Color Contrast**: 4.5:1 minimum
- **Keyboard Navigation**: Tüm interactive element'ler erişilebilir
- **Screen Reader**: Alt text, ARIA labels, semantic HTML
- **Focus Management**: Visible focus indicators

### Test Tools

- `@testing-library/jest-dom` for accessibility matchers
- `jest-axe` for WCAG compliance
- Manual testing with screen readers

## 🔄 Continuous Integration

### GitHub Actions Workflow

```yaml
- name: Run Tests
  run: npm run test:ci

- name: Upload Coverage
  uses: codecov/codecov-action@v3
```

### Pre-commit Hooks

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run test:ci"
    }
  }
}
```

## 📚 Öğrenme Kaynakları

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Core Web Vitals](https://web.dev/vitals/)

## 🤝 Katkıda Bulunma

1. Yeni test yazarken bu rehberi takip edin
2. Test coverage'ı %70'in altına düşürmeyin
3. Accessibility testlerini unutmayın
4. Performance testlerini düzenli olarak çalıştırın
5. Test sonuçlarını dokümante edin
