#!/bin/bash

# ======================================
# WealthHub - Start Script
# ======================================
# 
# Run this script to start WealthHub
# with Docker Compose
#
# Usage: ./start.sh
#

cd "$(dirname "$0")" || exit

echo "🚀 WealthHub - Starting Services"
echo ""
echo "📍 Make sure Docker is running!"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker."
    exit 1
fi

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose is not installed."
    exit 1
fi

echo "✅ Docker is running"
echo ""
echo "🏗️  Building and starting services..."
echo ""

# Start services
docker-compose up --build

# If the command fails
if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Error starting services"
    echo ""
    echo "Troubleshooting:"
    echo "  1. Make sure no other services are using ports 3000 or 8000"
    echo "  2. Run: lsof -ti:3000 | xargs kill -9"
    echo "  3. Run: lsof -ti:8000 | xargs kill -9"
    exit 1
fi
