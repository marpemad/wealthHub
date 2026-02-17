#!/bin/bash

# WealthHub Installation Script for Umbrel
# This script automates the installation of WealthHub on your Umbrel server

set -e

echo "🚀 WealthHub Installation Script for Umbrel"
echo "==========================================="
echo ""

# Check if running on Umbrel
if [ ! -d "$HOME/umbrel" ]; then
    echo "❌ Error: Umbrel directory not found at $HOME/umbrel"
    echo "This script must be run on a machine with Umbrel installed."
    exit 1
fi

# Create app directory
WEALTHHUB_DIR="$HOME/umbrel/apps/wealthhub"

if [ -d "$WEALTHHUB_DIR" ]; then
    echo "⚠️  Directory $WEALTHHUB_DIR already exists"
    read -p "Do you want to continue? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo "📁 Creating WealthHub app directory..."
mkdir -p "$WEALTHHUB_DIR"
cd "$WEALTHHUB_DIR"

echo "📥 Cloning repository..."
if [ -d ".git" ]; then
    git pull origin main
else
    git clone https://github.com/marpemad/wealthHub.git .
fi

echo "⚙️  Setting up environment..."
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "✅ Created .env file"
    echo ""
    echo "⚠️  IMPORTANT: Edit your .env file with your Google Apps Script URL:"
    echo "   nano $WEALTHHUB_DIR/.env"
    echo ""
    read -p "Press Enter once you've configured .env..."
else
    echo "✅ .env file already exists"
fi

echo ""
echo "🐳 Building and starting Docker container..."
docker-compose down 2>/dev/null || true
docker-compose build --no-cache
docker-compose up -d

echo ""
echo "✅ Installation Complete!"
echo ""
echo "🌐 WealthHub is now running at:"
echo "   http://umbrel.local:8787"
echo "   or http://$(hostname -I | awk '{print $1}'):8787"
echo ""
echo "📊 View logs:"
echo "   docker logs -f wealthhub"
echo ""
echo "🛑 Stop the app:"
echo "   cd $WEALTHHUB_DIR && docker-compose down"
echo ""
echo "📖 For more help, see: $WEALTHHUB_DIR/UMBREL.md"
