// Simple test to verify template fields functionality
// This is a basic test to ensure the node structure is correct

const nodeDefinition = require('./nodes/SignWell/SignWell.node.ts');

console.log('Testing SignWell node template fields functionality...');

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

// Test the structure
const expectedFields = ['api_id', 'value'];
const actualFields = templateFieldsParam?.options[0]?.values?.map(v => v.name) || [];

const hasAllFields = expectedFields.every(field => actualFields.includes(field));
console.log(hasAllFields ? '✅ All required fields present' : '❌ Missing required fields');

console.log('\nTemplate Fields structure:');
console.log(JSON.stringify(templateFieldsParam?.options[0]?.values, null, 2));
