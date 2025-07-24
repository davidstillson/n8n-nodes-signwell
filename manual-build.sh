#!/bin/bash

echo "Starting manual build process..."

# Clean dist folder
echo "Cleaning dist folder..."
rm -rf dist

# Run TypeScript compilation
echo "Running TypeScript compilation..."
npx tsc

# Check if compilation was successful
if [ $? -eq 0 ]; then
    echo "✅ TypeScript compilation successful!"
    
    # Copy SVG files
    echo "Copying SVG files..."
    mkdir -p dist/nodes/SignWell
    cp nodes/**/*.svg dist/nodes/SignWell/ 2>/dev/null || true
    
    echo "✅ Build completed successfully!"
else
    echo "❌ TypeScript compilation failed!"
    exit 1
fi
