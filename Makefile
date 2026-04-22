.PHONY: help dev prod build install clean logs shell

help: ## Show this help message
	@echo ''
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)
	@echo ''

install: ## Install dependencies locally
	npm install

dev: ## Start development server with hot reload (Docker)
	docker compose up

dev-local: ## Start development server locally (no Docker)
	npm run dev

build: ## Build production image
	docker compose -f docker-compose.prod.yml build

prod: ## Run production server
	docker compose -f docker-compose.prod.yml up -d

stop: ## Stop all running containers
	docker compose down
	docker compose -f docker-compose.prod.yml down 2>/dev/null || true

logs: ## Tail container logs
	docker compose logs -f

shell: ## Open a shell in the dev container
	docker compose exec app sh

clean: ## Remove containers, volumes, and local build artifacts
	docker compose down -v
	docker compose -f docker-compose.prod.yml down -v 2>/dev/null || true
	rm -rf node_modules dist

lint: ## Run linter
	npm run lint 2>/dev/null || echo "No lint script configured"

preview: ## Build and preview production build locally
	npm run build && npm run preview
