// Test to verify SignWell Trigger node is properly registered
const fs = require('fs');
const path = require('path');

console.log('Testing SignWell Trigger node registration...');

// Check package.json registration
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const registeredNodes = packageJson.n8n.nodes;

console.log('\n=== Package.json Registration ===');
console.log('Registered nodes:', registeredNodes);

const hasSignWellNode = registeredNodes.includes('dist/nodes/SignWell/SignWell.node.js');
const hasSignWellTrigger = registeredNodes.includes('dist/nodes/SignWell/SignWellTrigger.node.js');

console.log(`✅ SignWell node registered: ${hasSignWellNode}`);
console.log(`✅ SignWell Trigger node registered: ${hasSignWellTrigger}`);

// Check if built files exist
console.log('\n=== Built Files Check ===');
const signWellNodePath = 'dist/nodes/SignWell/SignWell.node.js';
const signWellTriggerPath = 'dist/nodes/SignWell/SignWellTrigger.node.js';

const signWellNodeExists = fs.existsSync(signWellNodePath);
const signWellTriggerExists = fs.existsSync(signWellTriggerPath);

console.log(`✅ SignWell node built: ${signWellNodeExists}`);
console.log(`✅ SignWell Trigger node built: ${signWellTriggerExists}`);

// Check node configurations
if (signWellTriggerExists) {
  console.log('\n=== SignWell Trigger Configuration ===');
  const triggerContent = fs.readFileSync(signWellTriggerPath, 'utf8');
  
  const checks = [
    { name: 'Has trigger group', pattern: /group:\s*\[\s*['"]trigger['"]/ },
    { name: 'Has webhook configuration', pattern: /webhooks:\s*\[/ },
    { name: 'Has webhookMethods', pattern: /webhookMethods\s*=/ },
    { name: 'Has webhook function', pattern: /async webhook\s*\(/ },
    { name: 'Has events parameter', pattern: /displayName:\s*['"]Events['"]/ },
    { name: 'Exports SignWellTrigger class', pattern: /exports\.SignWellTrigger/ }
  ];
  
  let allPassed = true;
  for (const check of checks) {
    const passed = check.pattern.test(triggerContent);
    console.log(`${passed ? '✅' : '❌'} ${check.name}: ${passed ? 'Found' : 'Missing'}`);
    if (!passed) allPassed = false;
  }
  
  if (allPassed) {
    console.log('\n🎉 SignWell Trigger node is properly configured!');
    console.log('\n📋 Next steps:');
    console.log('1. Restart your n8n instance');
    console.log('2. Look for "SignWell Trigger" in the Triggers section');
    console.log('3. Configure webhook events to trigger workflows');
  } else {
    console.log('\n❌ Some configuration issues found');
  }
} else {
  console.log('\n❌ SignWell Trigger node not built properly');
}

console.log('\n=== Summary ===');
if (hasSignWellNode && hasSignWellTrigger && signWellNodeExists && signWellTriggerExists) {
  console.log('✅ Both nodes are registered and built correctly');
  console.log('✅ SignWell Trigger should now appear in the Triggers section');
  console.log('✅ SignWell actions should appear in the Actions section');
} else {
  console.log('❌ Registration or build issues detected');
}
