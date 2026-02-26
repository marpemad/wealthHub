#!/bin/bash

# WealthHub Docker Compose Helper Script

set -e

COMPOSE_FILE="docker-compose.yml"
PROJECT_NAME="wealthhub"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}  WealthHub Docker Helper${NC}"
    echo -e "${BLUE}================================${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

# Check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
}

# Start services
start_services() {
    print_header
    print_info "Starting WealthHub services..."
    echo ""
    
    check_docker
    
    docker-compose -f "$COMPOSE_FILE" -p "$PROJECT_NAME" up -d
    
    print_success "Services started!"
    echo ""
    print_info "Waiting for services to be ready..."
    sleep 3
    
    # Check backend health
    if curl -s http://localhost:8000/health > /dev/null 2>&1; then
        print_success "Backend is ready (http://localhost:8000)"
    else
        print_error "Backend is not responding"
    fi
    
    echo ""
    print_success "frontend: http://localhost:3000"
    print_success "Backend:  http://localhost:8000"
    echo ""
    print_info "View logs with: docker-compose logs -f"
}

# Stop services
stop_services() {
    print_header
    print_info "Stopping WealthHub services..."
    echo ""
    
    docker-compose -f "$COMPOSE_FILE" -p "$PROJECT_NAME" down
    
    print_success "Services stopped"
}

# View logs
view_logs() {
    docker-compose -f "$COMPOSE_FILE" -p "$PROJECT_NAME" logs -f "$1"
}

# Restart services
restart_services() {
    print_header
    print_info "Restarting WealthHub services..."
    echo ""
    
    docker-compose -f "$COMPOSE_FILE" -p "$PROJECT_NAME" restart
    
    print_success "Services restarted"
}

# Show status
show_status() {
    print_header
    echo ""
    docker-compose -f "$COMPOSE_FILE" -p "$PROJECT_NAME" ps
}

# Clean up
cleanup() {
    print_header
    print_info "Cleaning up Docker resources..."
    echo ""
    
    docker-compose -f "$COMPOSE_FILE" -p "$PROJECT_NAME" down -v
    
    print_success "Cleanup completed"
}

# Show help
show_help() {
    echo ""
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  up              Start all services (default)"
    echo "  down            Stop all services"
    echo "  restart         Restart all services"
    echo "  status          Show service status"
    echo "  logs            View combined logs"
    echo "  logs backend    View backend logs"
    echo "  logs frontend   View frontend logs"
    echo "  clean           Remove all containers and volumes"
    echo "  help            Show this help message"
    echo ""
}

# Main
case "${1:-up}" in
    up)
        start_services
        ;;
    down)
        stop_services
        ;;
    restart)
        restart_services
        ;;
    status)
        show_status
        ;;
    logs)
        view_logs "$2"
        ;;
    clean)
        cleanup
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac
