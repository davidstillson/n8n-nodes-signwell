// Debug script to help troubleshoot SignWell webhook creation
console.log('🔍 SignWell Webhook Creation Debug Guide');
console.log('==========================================\n');

console.log('✅ FIXED ISSUES IN VERSION 1.4.3:');
console.log('1. Changed "url" parameter to "callback_url" (SignWell API requirement)');
console.log('2. Added detailed error logging and debugging');
console.log('3. Improved error handling in webhook creation\n');

console.log('🚀 TESTING STEPS:');
console.log('1. Restart your n8n instance');
console.log('2. Create a new workflow');
console.log('3. Add "SignWell Trigger" node');
console.log('4. Configure your SignWell API credentials');
console.log('5. Select events to listen for');
console.log('6. Try to activate the workflow\n');

console.log('🔍 DEBUGGING:');
console.log('If you still get errors, check the n8n logs for:');
console.log('- "Creating SignWell webhook with:" - Shows the request being sent');
console.log('- "SignWell API Request:" - Shows the full HTTP request');
console.log('- "SignWell API Error:" - Shows detailed error information');
console.log('- "SignWell webhook creation response:" - Shows the API response\n');

console.log('📋 COMMON ISSUES TO CHECK:');
console.log('1. API Key: Make sure your SignWell API key is valid');
console.log('2. Base URL: Should be "https://www.signwell.com/api/v1"');
console.log('3. Permissions: API key needs webhook creation permissions');
console.log('4. Network: n8n needs to reach SignWell API endpoints\n');

console.log('🔧 MANUAL TEST:');
console.log('You can test webhook creation manually with curl:');
console.log('');
console.log('curl -X POST https://www.signwell.com/api/v1/hooks \\');
console.log('  -H "X-Api-Key: YOUR_API_KEY" \\');
console.log('  -H "Content-Type: application/json" \\');
console.log('  -d \'{"callback_url": "https://your-n8n-instance.com/webhook/test"}\'');
console.log('');
console.log('Expected response: {"id": "webhook_id", "callback_url": "..."}');
console.log('');

console.log('📞 NEXT STEPS:');
console.log('1. Try activating the workflow again');
console.log('2. Check n8n logs for the detailed error messages');
console.log('3. If still failing, share the specific error from the logs');
console.log('4. Verify your SignWell API key has webhook permissions\n');

console.log('🎯 EXPECTED BEHAVIOR:');
console.log('- SignWell Trigger should appear in Triggers section');
console.log('- When activated, it creates a webhook in SignWell');
console.log('- SignWell events will trigger your n8n workflow');
console.log('- You can manage webhooks via SignWell node actions\n');

console.log('Version 1.4.3 includes the API parameter fix and better debugging!');
