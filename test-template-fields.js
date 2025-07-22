// Simple test to verify template fields and attachment requests functionality
// This is a basic test to ensure the node structure is correct

const nodeDefinition = require('./nodes/SignWell/SignWell.node.ts');

console.log('Testing SignWell node functionality...');

// Test that the node has the templateFields parameter
const templateFieldsParam = nodeDefinition.SignWell.prototype.description.properties.find(
  prop => prop.name === 'templateFields'
);

if (templateFieldsParam) {
  console.log('✅ Template Fields parameter found');
  console.log('✅ Type:', templateFieldsParam.type);
  console.log('✅ Options:', templateFieldsParam.options[0].values.map(v => v.name));
} else {
  console.log('❌ Template Fields parameter not found');
}

// Test template fields structure
const expectedTemplateFields = ['api_id', 'value'];
const actualTemplateFields = templateFieldsParam?.options[0]?.values?.map(v => v.name) || [];
const hasAllTemplateFields = expectedTemplateFields.every(field => actualTemplateFields.includes(field));
console.log(hasAllTemplateFields ? '✅ All required template fields present' : '❌ Missing required template fields');

// Test that the node has the attachmentRequests parameter
const attachmentRequestsParam = nodeDefinition.SignWell.prototype.description.properties.find(
  prop => prop.name === 'attachmentRequests'
);

if (attachmentRequestsParam) {
  console.log('✅ Attachment Requests parameter found');
  console.log('✅ Type:', attachmentRequestsParam.type);
  console.log('✅ Options:', attachmentRequestsParam.options[0].values.map(v => v.name));
} else {
  console.log('❌ Attachment Requests parameter not found');
}

// Test attachment requests structure
const expectedAttachmentFields = ['name', 'recipient_id', 'required'];
const actualAttachmentFields = attachmentRequestsParam?.options[0]?.values?.map(v => v.name) || [];
const hasAllAttachmentFields = expectedAttachmentFields.every(field => actualAttachmentFields.includes(field));
console.log(hasAllAttachmentFields ? '✅ All required attachment fields present' : '❌ Missing required attachment fields');

console.log('\nTemplate Fields structure:');
console.log(JSON.stringify(templateFieldsParam?.options[0]?.values, null, 2));

console.log('\nAttachment Requests structure:');
console.log(JSON.stringify(attachmentRequestsParam?.options[0]?.values, null, 2));
