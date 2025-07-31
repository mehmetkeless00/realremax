// Responsive Testing Utilities
// Bu dosya responsive tasarım testleri için yardımcı fonksiyonlar içerir

export interface ViewportSize {
  width: number;
  height: number;
  name: string;
}

// Standart viewport boyutları
export const viewportSizes: ViewportSize[] = [
  { width: 320, height: 568, name: 'Mobile Small' },
  { width: 375, height: 667, name: 'Mobile Medium' },
  { width: 414, height: 896, name: 'Mobile Large' },
  { width: 768, height: 1024, name: 'Tablet' },
  { width: 1024, height: 768, name: 'Desktop Small' },
  { width: 1280, height: 720, name: 'Desktop Medium' },
  { width: 1920, height: 1080, name: 'Desktop Large' },
];

// Tailwind breakpoints
export const tailwindBreakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

// Viewport boyutunu ayarla
export const setViewport = (size: ViewportSize): void => {
  if (typeof window !== 'undefined') {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: size.width,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: size.height,
    });
    window.dispatchEvent(new Event('resize'));
  }
};

// Responsive class'ları kontrol et
export const hasResponsiveClass = (
  element: HTMLElement,
  className: string
): boolean => {
  return element.classList.contains(className);
};

// Horizontal scroll kontrolü
export const hasHorizontalScroll = (element: HTMLElement): boolean => {
  return element.scrollWidth > element.clientWidth;
};

// Touch target boyutu kontrolü (minimum 44px)
export const hasValidTouchTarget = (element: HTMLElement): boolean => {
  const rect = element.getBoundingClientRect();
  return rect.width >= 44 && rect.height >= 44;
};

// Font boyutu kontrolü (minimum 16px)
export const hasValidFontSize = (element: HTMLElement): boolean => {
  const computedStyle = window.getComputedStyle(element);
  const fontSize = parseFloat(computedStyle.fontSize);
  return fontSize >= 16;
};

// Responsive grid kontrolü
export const checkResponsiveGrid = (
  container: HTMLElement
): {
  isValid: boolean;
  issues: string[];
} => {
  const issues: string[] = [];
  let isValid = true;

  // Grid class'larını kontrol et
  const hasGridClass = container.classList.contains('grid');
  if (!hasGridClass) {
    issues.push('Container should have grid class');
    isValid = false;
  }

  // Responsive grid class'larını kontrol et
  const responsiveClasses = [
    'grid-cols-1',
    'md:grid-cols-2',
    'lg:grid-cols-3',
    'xl:grid-cols-4',
  ];
  const hasResponsiveClasses = responsiveClasses.some((cls) =>
    container.classList.contains(cls)
  );

  if (!hasResponsiveClasses) {
    issues.push('Container should have responsive grid classes');
    isValid = false;
  }

  return { isValid, issues };
};

// Responsive image kontrolü
export const checkResponsiveImage = (
  imgElement: HTMLImageElement
): {
  isValid: boolean;
  issues: string[];
} => {
  const issues: string[] = [];
  let isValid = true;

  // Alt text kontrolü
  if (!imgElement.alt || imgElement.alt.trim() === '') {
    issues.push('Image should have alt text');
    isValid = false;
  }

  // Responsive class kontrolü
  const hasResponsiveClass =
    imgElement.classList.contains('w-full') ||
    imgElement.classList.contains('h-auto');

  if (!hasResponsiveClass) {
    issues.push('Image should have responsive classes (w-full, h-auto)');
    isValid = false;
  }

  return { isValid, issues };
};

// Form responsive kontrolü
export const checkResponsiveForm = (
  formElement: HTMLFormElement
): {
  isValid: boolean;
  issues: string[];
} => {
  const issues: string[] = [];
  let isValid = true;

  // Form field'larını kontrol et
  const formFields = formElement.querySelectorAll('input, select, textarea');

  formFields.forEach((field) => {
    const element = field as HTMLElement;

    // Touch target kontrolü
    if (!hasValidTouchTarget(element)) {
      issues.push(
        `Form field ${field.tagName} should have minimum 44px touch target`
      );
      isValid = false;
    }

    // Font size kontrolü
    if (!hasValidFontSize(element)) {
      issues.push(
        `Form field ${field.tagName} should have minimum 16px font size`
      );
      isValid = false;
    }
  });

  return { isValid, issues };
};

// Navigation responsive kontrolü
export const checkResponsiveNavigation = (
  navElement: HTMLElement
): {
  isValid: boolean;
  issues: string[];
} => {
  const issues: string[] = [];
  let isValid = true;

  // Mobile menu button kontrolü
  const mobileMenuButton = navElement.querySelector(
    '[aria-label*="menu"], [aria-label*="Menu"]'
  );
  if (!mobileMenuButton) {
    issues.push('Navigation should have mobile menu button');
    isValid = false;
  }

  // Touch target kontrolü
  const navLinks = navElement.querySelectorAll('a, button');
  navLinks.forEach((link) => {
    const element = link as HTMLElement;
    if (!hasValidTouchTarget(element)) {
      issues.push(`Navigation link should have minimum 44px touch target`);
      isValid = false;
    }
  });

  return { isValid, issues };
};

// Responsive test sonuçları
export interface ResponsiveTestResult {
  viewport: ViewportSize;
  passed: boolean;
  issues: string[];
  warnings: string[];
}

// Kapsamlı responsive test
export const runResponsiveTest = (
  container: HTMLElement,
  viewport: ViewportSize
): ResponsiveTestResult => {
  const issues: string[] = [];
  const warnings: string[] = [];

  // Viewport'u ayarla
  setViewport(viewport);

  // Horizontal scroll kontrolü
  if (hasHorizontalScroll(container)) {
    issues.push('Container has horizontal scroll');
  }

  // Grid kontrolü
  const gridCheck = checkResponsiveGrid(container);
  if (!gridCheck.isValid) {
    issues.push(...gridCheck.issues);
  }

  // Image kontrolü
  const images = container.querySelectorAll('img');
  images.forEach((img) => {
    const imageCheck = checkResponsiveImage(img);
    if (!imageCheck.isValid) {
      issues.push(...imageCheck.issues);
    }
  });

  // Form kontrolü
  const forms = container.querySelectorAll('form');
  forms.forEach((form) => {
    const formCheck = checkResponsiveForm(form);
    if (!formCheck.isValid) {
      issues.push(...formCheck.issues);
    }
  });

  // Navigation kontrolü
  const navs = container.querySelectorAll('nav');
  navs.forEach((nav) => {
    const navCheck = checkResponsiveNavigation(nav);
    if (!navCheck.isValid) {
      issues.push(...navCheck.issues);
    }
  });

  // Touch target kontrolü
  const interactiveElements = container.querySelectorAll(
    'button, a, input, select, textarea'
  );
  interactiveElements.forEach((element) => {
    const el = element as HTMLElement;
    if (!hasValidTouchTarget(el)) {
      warnings.push(
        `Interactive element should have minimum 44px touch target`
      );
    }
  });

  return {
    viewport,
    passed: issues.length === 0,
    issues,
    warnings,
  };
};

// Test raporu oluştur
export const generateResponsiveTestReport = (
  results: ResponsiveTestResult[]
): string => {
  let report = '# Responsive Test Report\n\n';

  const totalTests = results.length;
  const passedTests = results.filter((r) => r.passed).length;
  const failedTests = totalTests - passedTests;

  report += `## Summary\n`;
  report += `- Total Tests: ${totalTests}\n`;
  report += `- Passed: ${passedTests}\n`;
  report += `- Failed: ${failedTests}\n`;
  report += `- Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%\n\n`;

  results.forEach((result) => {
    report += `## ${result.viewport.name} (${result.viewport.width}x${result.viewport.height})\n`;
    report += `Status: ${result.passed ? '✅ PASSED' : '❌ FAILED'}\n\n`;

    if (result.issues.length > 0) {
      report += `### Issues:\n`;
      result.issues.forEach((issue) => {
        report += `- ❌ ${issue}\n`;
      });
      report += `\n`;
    }

    if (result.warnings.length > 0) {
      report += `### Warnings:\n`;
      result.warnings.forEach((warning) => {
        report += `- ⚠️ ${warning}\n`;
      });
      report += `\n`;
    }
  });

  return report;
};
