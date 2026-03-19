#!/bin/bash
# Setup script for GrievanceGrid Worker

set -e

echo "🚀 Setting up GrievanceGrid Worker..."

# Check Python version
PYTHON_VERSION=$(python3 --version 2>&1 | awk '{print $2}')
echo "✓ Python version: $PYTHON_VERSION"

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "✓ Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📥 Installing dependencies..."
pip install --upgrade pip setuptools wheel
pip install -r requirements.txt

# Setup .env file
if [ ! -f ".env" ]; then
    echo "🔧 Setting up .env from .env.example..."
    cp .env.example .env
    echo "⚠️  Please update .env with your configuration"
else
    echo "✓ .env file already exists"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env with your actual configuration"
echo "2. Start Redis: docker run -d -p 6379:6379 redis:7-alpine"
echo "3. Start Qdrant: docker run -d -p 6333:6333 qdrant/qdrant"
echo "4. Run worker: celery -A src.celery_app:celery_app worker --loglevel=INFO"
echo "5. Or run beat: celery -A src.celery_app:celery_app beat --loglevel=INFO"
