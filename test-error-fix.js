// Test to verify the error handling fix
const fs = require('fs');

console.log('Testing error handling fix...');

// Read the GenericFunctions.ts file
const content = fs.readFileSync('nodes/SignWell/GenericFunctions.ts', 'utf8');

// Check for the correct error handling patterns
const checks = [
  {
    name: 'JsonObject import',
    pattern: /import\s*{[^}]*JsonObject[^}]*}\s*from\s*['"]n8n-workflow['"]/,
    expected: true
  },
  {
    name: 'Correct error casting in signWellApiRequest',
    pattern: /throw new NodeApiError\(this\.getNode\(\),\s*error as JsonObject\)/,
    expected: true
  },
  {
    name: 'No "error as Error" patterns',
    pattern: /error as Error/,
    expected: false
  },
  {
    name: 'No "error as any" patterns', 
    pattern: /error as any/,
    expected: false
  }
];

let allPassed = true;

for (const check of checks) {
  const found = check.pattern.test(content);
  const passed = found === check.expected;
  
  if (passed) {
    console.log(`✅ ${check.name}: ${check.expected ? 'Found' : 'Not found'} (as expected)`);
  } else {
    console.log(`❌ ${check.name}: ${found ? 'Found' : 'Not found'} (expected ${check.expected ? 'found' : 'not found'})`);
    allPassed = false;
  }
}

// Count the number of NodeApiError calls
const nodeApiErrorMatches = content.match(/throw new NodeApiError/g);
const nodeApiErrorCount = nodeApiErrorMatches ? nodeApiErrorMatches.length : 0;

console.log(`\nFound ${nodeApiErrorCount} NodeApiError calls`);

if (nodeApiErrorCount === 2) {
  console.log('✅ Expected number of NodeApiError calls found');
} else {
  console.log('❌ Unexpected number of NodeApiError calls');
  allPassed = false;
}

if (allPassed) {
  console.log('\n✅ All error handling checks passed!');
  console.log('The TypeScript compilation should now work correctly.');
} else {
  console.log('\n❌ Some checks failed. Please review the error handling.');
}

console.log('\nTo test the build, run: npm run build');
