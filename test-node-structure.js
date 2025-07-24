// Test to verify the node structure separation
const fs = require('fs');

console.log('Testing SignWell node structure...');

// Read both files
const signWellContent = fs.readFileSync('nodes/SignWell/SignWell.node.ts', 'utf8');
const signWellTriggerContent = fs.readFileSync('nodes/SignWell/SignWellTrigger.node.ts', 'utf8');

console.log('\n=== SignWell Node (Actions) ===');

// Check SignWell node structure
const signWellChecks = [
  {
    name: 'No webhook trigger functionality',
    pattern: /webhookMethods|async webhook\(/,
    expected: false
  },
  {
    name: 'Has webhook resource for actions',
    pattern: /name: 'Webhook'.*value: 'webhook'/s,
    expected: true
  },
  {
    name: 'Has webhook list operation',
    pattern: /name: 'List'.*value: 'list'.*List all webhooks/s,
    expected: true
  },
  {
    name: 'Has webhook create operation',
    pattern: /name: 'Create'.*value: 'create'.*Create a new webhook/s,
    expected: true
  },
  {
    name: 'Has webhook delete operation',
    pattern: /name: 'Delete'.*value: 'delete'.*Delete a webhook/s,
    expected: true
  },
  {
    name: 'Has webhook operations in execute function',
    pattern: /if \(resource === 'webhook'\)/,
    expected: true
  },
  {
    name: 'Group is transform (not trigger)',
    pattern: /group: \['transform'\]/,
    expected: true
  }
];

let signWellPassed = true;
for (const check of signWellChecks) {
  const found = check.pattern.test(signWellContent);
  const passed = found === check.expected;
  
  if (passed) {
    console.log(`✅ ${check.name}: ${check.expected ? 'Found' : 'Not found'} (as expected)`);
  } else {
    console.log(`❌ ${check.name}: ${found ? 'Found' : 'Not found'} (expected ${check.expected ? 'found' : 'not found'})`);
    signWellPassed = false;
  }
}

console.log('\n=== SignWell Trigger Node (Triggers) ===');

// Check SignWell Trigger node structure
const triggerChecks = [
  {
    name: 'Has webhookMethods',
    pattern: /webhookMethods\s*=/,
    expected: true
  },
  {
    name: 'Has webhook function',
    pattern: /async webhook\(/,
    expected: true
  },
  {
    name: 'Has events parameter',
    pattern: /displayName: 'Events'/,
    expected: true
  },
  {
    name: 'Has verifyHash parameter',
    pattern: /displayName: 'Verify Hash'/,
    expected: true
  },
  {
    name: 'Group is trigger',
    pattern: /group: \['trigger'\]/,
    expected: true
  },
  {
    name: 'Has webhook configuration',
    pattern: /webhooks: \[/,
    expected: true
  },
  {
    name: 'No execute function',
    pattern: /async execute\(/,
    expected: false
  }
];

let triggerPassed = true;
for (const check of triggerChecks) {
  const found = check.pattern.test(signWellTriggerContent);
  const passed = found === check.expected;
  
  if (passed) {
    console.log(`✅ ${check.name}: ${check.expected ? 'Found' : 'Not found'} (as expected)`);
  } else {
    console.log(`❌ ${check.name}: ${found ? 'Found' : 'Not found'} (expected ${check.expected ? 'found' : 'not found'})`);
    triggerPassed = false;
  }
}

console.log('\n=== Summary ===');
if (signWellPassed && triggerPassed) {
  console.log('✅ All structure checks passed!');
  console.log('✅ SignWell node properly configured for actions only');
  console.log('✅ SignWell Trigger node properly configured for triggers only');
  console.log('\nThe node structure now follows n8n best practices:');
  console.log('- Triggers are in a separate SignWell Trigger node');
  console.log('- Actions (webhook management) are in the main SignWell node');
  console.log('- Similar to how Slack separates triggers and actions');
} else {
  console.log('❌ Some structure checks failed');
}

console.log('\nTo test the build, run: npm run build');
