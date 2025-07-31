'use client';

import { useState, useEffect } from 'react';
import PropertyCard from '@/components/PropertyCard';
import GlobalHeader from '@/components/GlobalHeader';
import {
  viewportSizes,
  runResponsiveTest,
  generateResponsiveTestReport,
} from '@/lib/utils/responsiveTesting';

// Mock property data
const mockProperty = {
  id: '1',
  title: 'Beautiful Modern House',
  price: 500000,
  location: 'Amsterdam, Netherlands',
  type: 'house',
  bedrooms: 3,
  bathrooms: 2,
  size: 150,
  status: 'active',
  images: ['/images/placeholder-property.svg'],
  created_at: '2024-01-01T00:00:00Z',
};

export default function ResponsiveTestingDemo() {
  const [currentViewport, setCurrentViewport] = useState(viewportSizes[2]); // Mobile Large
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);

  // Simulate viewport change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: currentViewport.width,
      });
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: currentViewport.height,
      });
      window.dispatchEvent(new Event('resize'));
    }
  }, [currentViewport]);

  const runTests = async () => {
    setIsRunningTests(true);
    const results = [];

    for (const viewport of viewportSizes) {
      setCurrentViewport(viewport);

      // Wait for DOM update
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Run tests on PropertyCard
      const propertyCardContainer = document.querySelector(
        '[data-testid="property-card"]'
      ) as HTMLElement;
      if (propertyCardContainer) {
        const result = runResponsiveTest(propertyCardContainer, viewport);
        results.push(result);
      }
    }

    setTestResults(results);
    setIsRunningTests(false);
  };

  const generateReport = () => {
    if (testResults.length === 0) return '';
    return generateResponsiveTestReport(testResults);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <GlobalHeader />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Responsive Testing Demo
          </h1>

          {/* Viewport Selector */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Viewport Selector</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {viewportSizes.map((viewport) => (
                <button
                  key={viewport.name}
                  onClick={() => setCurrentViewport(viewport)}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    currentViewport.name === viewport.name
                      ? 'border-primary-blue bg-blue-50 text-primary-blue'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-sm font-medium">{viewport.name}</div>
                  <div className="text-xs text-gray-500">
                    {viewport.width}x{viewport.height}
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-4 p-3 bg-gray-100 rounded-lg">
              <div className="text-sm">
                <strong>Current Viewport:</strong> {currentViewport.name} (
                {currentViewport.width}x{currentViewport.height})
              </div>
            </div>
          </div>

          {/* Test Controls */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={runTests}
                disabled={isRunningTests}
                className="bg-primary-blue text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRunningTests ? 'Running Tests...' : 'Run Responsive Tests'}
              </button>

              {testResults.length > 0 && (
                <button
                  onClick={() => {
                    const report = generateReport();
                    const blob = new Blob([report], { type: 'text/markdown' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'responsive-test-report.md';
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
                >
                  Download Report
                </button>
              )}
            </div>
          </div>

          {/* Component Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* PropertyCard Preview */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">
                PropertyCard Component
              </h2>
              <div data-testid="property-card">
                <PropertyCard property={mockProperty} />
              </div>
            </div>

            {/* Grid vs List View */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Grid vs List View</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Grid View</h3>
                  <div className="w-full">
                    <PropertyCard property={mockProperty} view="grid" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">List View</h3>
                  <div className="w-full">
                    <PropertyCard property={mockProperty} view="list" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Test Results */}
          {testResults.length > 0 && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Test Results</h2>

              <div className="mb-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-gray-100 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">
                      {testResults.length}
                    </div>
                    <div className="text-sm text-gray-600">Total Tests</div>
                  </div>
                  <div className="text-center p-3 bg-green-100 rounded-lg">
                    <div className="text-2xl font-bold text-green-900">
                      {testResults.filter((r) => r.passed).length}
                    </div>
                    <div className="text-sm text-green-600">Passed</div>
                  </div>
                  <div className="text-center p-3 bg-red-100 rounded-lg">
                    <div className="text-2xl font-bold text-red-900">
                      {testResults.filter((r) => !r.passed).length}
                    </div>
                    <div className="text-sm text-red-600">Failed</div>
                  </div>
                  <div className="text-center p-3 bg-blue-100 rounded-lg">
                    <div className="text-2xl font-bold text-blue-900">
                      {(
                        (testResults.filter((r) => r.passed).length /
                          testResults.length) *
                        100
                      ).toFixed(1)}
                      %
                    </div>
                    <div className="text-sm text-blue-600">Success Rate</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {testResults.map((result, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-2 ${
                      result.passed
                        ? 'border-green-200 bg-green-50'
                        : 'border-red-200 bg-red-50'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">
                        {result.viewport.name} ({result.viewport.width}x
                        {result.viewport.height})
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          result.passed
                            ? 'bg-green-200 text-green-800'
                            : 'bg-red-200 text-red-800'
                        }`}
                      >
                        {result.passed ? 'PASSED' : 'FAILED'}
                      </span>
                    </div>

                    {result.issues.length > 0 && (
                      <div className="mb-2">
                        <h4 className="text-sm font-medium text-red-700 mb-1">
                          Issues:
                        </h4>
                        <ul className="text-sm text-red-600 space-y-1">
                          {result.issues.map(
                            (issue: string, issueIndex: number) => (
                              <li key={issueIndex}>• {issue}</li>
                            )
                          )}
                        </ul>
                      </div>
                    )}

                    {result.warnings.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-yellow-700 mb-1">
                          Warnings:
                        </h4>
                        <ul className="text-sm text-yellow-600 space-y-1">
                          {result.warnings.map(
                            (warning: string, warningIndex: number) => (
                              <li key={warningIndex}>• {warning}</li>
                            )
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Responsive Guidelines */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">
              Responsive Design Guidelines
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Breakpoints</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <strong>Mobile Small:</strong> 320px - 375px
                  </li>
                  <li>
                    <strong>Mobile Medium:</strong> 375px - 414px
                  </li>
                  <li>
                    <strong>Mobile Large:</strong> 414px - 768px
                  </li>
                  <li>
                    <strong>Tablet:</strong> 768px - 1024px
                  </li>
                  <li>
                    <strong>Desktop:</strong> 1024px+
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">Best Practices</h3>
                <ul className="space-y-2 text-sm">
                  <li>• Minimum 44px touch targets</li>
                  <li>• Minimum 16px font size</li>
                  <li>• No horizontal scroll</li>
                  <li>• Proper alt text for images</li>
                  <li>• Responsive grid layouts</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
