#!/bin/bash

# Setup script for Rep's EduCompass demo mode
echo "🧭 Setting up Rep's EduCompass for demo mode..."

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "Creating .env.local from example..."
    cp .env.local.example .env.local
else
    echo ".env.local already exists"
fi

# Update or add the NEXT_PUBLIC_USE_MOCKS variable
if grep -q "NEXT_PUBLIC_USE_MOCKS" .env.local; then
    # Update existing line
    sed -i 's/^NEXT_PUBLIC_USE_MOCKS=.*/NEXT_PUBLIC_USE_MOCKS=true/' .env.local
    echo "✅ Updated NEXT_PUBLIC_USE_MOCKS=true in .env.local"
else
    # Add new line
    echo "" >> .env.local
    echo "# Demo mode configuration" >> .env.local
    echo "NEXT_PUBLIC_USE_MOCKS=true" >> .env.local
    echo "✅ Added NEXT_PUBLIC_USE_MOCKS=true to .env.local"
fi

echo ""
echo "🎉 Demo setup complete!"
echo ""
echo "To start the demo:"
echo "1. Run: npm run dev"
echo "2. Open: http://localhost:3000"
echo ""
echo "The app will now use mock data for demonstration."
echo "To switch back to real Google Classroom data, set NEXT_PUBLIC_USE_MOCKS=false"
