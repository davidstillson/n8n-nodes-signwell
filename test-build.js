// Simple test to check if TypeScript compilation works
const { execSync } = require('child_process');
const fs = require('fs');

console.log('Testing TypeScript compilation...');

try {
  // Check if node_modules exists
  if (!fs.existsSync('node_modules')) {
    console.log('Installing dependencies...');
    execSync('npm install', { stdio: 'inherit' });
  }

  // Try TypeScript compilation
  console.log('Running TypeScript compilation...');
  execSync('npx tsc --noEmit', { stdio: 'inherit' });
  console.log('✅ TypeScript compilation successful!');

  // Try full build
  console.log('Running full build...');
  execSync('npx tsc', { stdio: 'inherit' });
  console.log('✅ Build successful!');

  // Copy SVG files
  console.log('Copying SVG files...');
  execSync('cp nodes/**/*.svg dist/nodes/SignWell/ 2>/dev/null || true', { stdio: 'inherit' });
  console.log('✅ SVG files copied!');

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
