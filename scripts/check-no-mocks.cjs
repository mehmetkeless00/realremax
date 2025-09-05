#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const MOCK_PATTERNS = [
  /import.*mock/i,
  /import.*demo/i,
  /from.*mock/i,
  /from.*demo/i,
  /getMock/i,
  /mockData/i,
  /demoData/i,
  /FAKE_/i,
  /SAMPLE_/i,
  /mock-properties/i,
  /mock-developments/i,
  /getAgentsMock/i,
  /searchPropertiesMock/i,
  /demoServices/i,
  /demoServiceIds/i,
  /mockRequest/i,
];

const IGNORED_DIRS = [
  'node_modules',
  '.next',
  '.git',
  '__tests__',
  '__mocks__',
  'scripts',
];

const IGNORED_FILES = [
  'check-no-mocks.cjs',
  'jest.setup.js',
  'jest.config.js',
];

// Files that are intentionally demo pages (UI examples)
const DEMO_PAGES = [
  'agents-demo/page.tsx',
  'cls-optimization-demo/page.tsx',
  'design-system-demo/page.tsx',
  'image-optimization-demo/page.tsx',
  'pagination-demo/page.tsx',
  'property-card-demo/page.tsx',
  'responsive-testing-demo/page.tsx',
  'RealtimeDemo.tsx',
];

function shouldIgnoreDir(dirName) {
  return IGNORED_DIRS.includes(dirName);
}

function shouldIgnoreFile(fileName) {
  return IGNORED_FILES.includes(fileName);
}

function isDemoPage(filePath) {
  return DEMO_PAGES.some(demoPage => filePath.includes(demoPage));
}

function scanDirectory(dirPath, relativePath = '') {
  const results = [];
  
  try {
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const relativeItemPath = path.join(relativePath, item);
      
      if (shouldIgnoreDir(item)) {
        continue;
      }
      
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        results.push(...scanDirectory(fullPath, relativeItemPath));
      } else if (stat.isFile() && (item.endsWith('.ts') || item.endsWith('.tsx') || item.endsWith('.js') || item.endsWith('.jsx'))) {
        if (!shouldIgnoreFile(item)) {
          results.push(relativeItemPath);
        }
      }
    }
  } catch (error) {
    console.warn(`Warning: Could not scan directory ${dirPath}:`, error.message);
  }
  
  return results;
}

function checkFileForMocks(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const issues = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineNumber = i + 1;
      
      for (const pattern of MOCK_PATTERNS) {
        if (pattern.test(line)) {
          issues.push({
            line: lineNumber,
            content: line.trim(),
            pattern: pattern.source,
          });
        }
      }
    }
    
    return issues;
  } catch (error) {
    console.warn(`Warning: Could not read file ${filePath}:`, error.message);
    return [];
  }
}

function main() {
  console.log('🔍 Scanning for mock/demo imports in production code...');
  
  const srcDir = path.join(process.cwd(), 'src');
  if (!fs.existsSync(srcDir)) {
    console.log('✅ No src directory found, skipping scan');
    return 0;
  }
  
  const files = scanDirectory(srcDir);
  console.log(`📁 Found ${files.length} source files to check`);
  
  let totalIssues = 0;
  const filesWithIssues = [];
  
  for (const file of files) {
    // Skip demo pages as they are intentionally UI examples
    if (isDemoPage(file)) {
      continue;
    }
    
    const fullPath = path.join(srcDir, file);
    const issues = checkFileForMocks(fullPath);
    
    if (issues.length > 0) {
      totalIssues += issues.length;
      filesWithIssues.push({ file, issues });
    }
  }
  
  if (totalIssues === 0) {
    console.log('✅ No mock/demo imports found in production code');
    return 0;
  }
  
  console.error('\n❌ Mock/demo imports found in production code:');
  console.error('   This build will fail to prevent mock data from reaching production.\n');
  
  for (const { file, issues } of filesWithIssues) {
    console.error(`📄 ${file}:`);
    for (const issue of issues) {
      console.error(`   Line ${issue.line}: ${issue.content}`);
      console.error(`   Pattern: ${issue.pattern}\n`);
    }
  }
  
  console.error(`\n🚫 Total issues: ${totalIssues}`);
  console.error('   Please remove all mock/demo imports and references from production code.');
  console.error('   Move test-only mocks to __mocks__/ directory.');
  
  return 1;
}

if (require.main === module) {
  const exitCode = main();
  process.exit(exitCode);
}
