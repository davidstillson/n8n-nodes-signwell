// Simple test to verify webhook functionality
// This is a basic test to ensure the webhook structure is correct

const nodeDefinition = require('./nodes/SignWell/SignWell.node.ts');

console.log('Testing SignWell node webhook functionality...');

// Test that the node has webhook support
const nodeDesc = nodeDefinition.SignWell.prototype.description;

// Check if webhooks are defined
if (nodeDesc.webhooks && nodeDesc.webhooks.length > 0) {
  console.log('✅ Webhooks configuration found');
  console.log('✅ Webhook path:', nodeDesc.webhooks[0].path);
  console.log('✅ Webhook method:', nodeDesc.webhooks[0].httpMethod);
} else {
  console.log('❌ Webhooks configuration not found');
}

// Check if webhook resource is available
const webhookResource = nodeDesc.properties.find(prop => 
  prop.name === 'resource' && 
  prop.options.some(opt => opt.value === 'webhook')
);

if (webhookResource) {
  console.log('✅ Webhook resource found in node properties');
} else {
  console.log('❌ Webhook resource not found');
}

// Check webhook operations
const webhookOperations = nodeDesc.properties.find(prop => 
  prop.name === 'operation' && 
  prop.displayOptions?.show?.resource?.includes('webhook')
);

if (webhookOperations) {
  console.log('✅ Webhook operations found');
  const operations = webhookOperations.options.map(op => op.value);
  console.log('✅ Available operations:', operations);
  
  // Check for trigger operation
  if (operations.includes('trigger')) {
    console.log('✅ Trigger operation available');
  } else {
    console.log('❌ Trigger operation missing');
  }
} else {
  console.log('❌ Webhook operations not found');
}

// Check webhook events parameter
const eventsParam = nodeDesc.properties.find(prop => 
  prop.name === 'events' && 
  prop.displayOptions?.show?.operation?.includes('trigger')
);

if (eventsParam) {
  console.log('✅ Events parameter found');
  console.log('✅ Available events:', eventsParam.options.length);
  
  // Check for key events
  const eventValues = eventsParam.options.map(opt => opt.value);
  const keyEvents = ['document_completed', 'document_signed', 'document_created'];
  const hasKeyEvents = keyEvents.every(event => eventValues.includes(event));
  
  if (hasKeyEvents) {
    console.log('✅ All key events available');
  } else {
    console.log('❌ Missing key events');
  }
} else {
  console.log('❌ Events parameter not found');
}

// Check if webhookMethods are defined
const nodeInstance = new nodeDefinition.SignWell();
if (nodeInstance.webhookMethods) {
  console.log('✅ Webhook methods defined');
  if (nodeInstance.webhookMethods.default) {
    console.log('✅ Default webhook methods available');
    const methods = Object.keys(nodeInstance.webhookMethods.default);
    console.log('✅ Webhook methods:', methods);
  }
} else {
  console.log('❌ Webhook methods not defined');
}

// Check if webhook function exists
if (typeof nodeInstance.webhook === 'function') {
  console.log('✅ Webhook function defined');
} else {
  console.log('❌ Webhook function not defined');
}

console.log('\nWebhook functionality test completed!');
