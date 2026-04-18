.PHONY: help install \
        dev-backend dev-frontend \
        build-backend build-frontend build \
        test-backend test-backend-e2e test-frontend test \
        lint-backend lint-frontend lint \
        docker-build docker-up docker-down docker-logs docker-restart \
        clean

.DEFAULT_GOAL := help

##@ Help

help: ## Show this help message
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m<target>\033[0m\n"} \
	  /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-22s\033[0m %s\n", $$1, $$2 } \
	  /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) }' $(MAKEFILE_LIST)

##@ Installation

install: ## Install dependencies for both services
	cd backend  && npm ci
	cd frontend && npm ci

##@ Development

dev-backend: ## Start backend in watch mode (port 3001)
	cd backend && npm run start:dev

dev-frontend: ## Start frontend dev server (port 3000)
	cd frontend && npm run dev

##@ Build

build-backend: ## Compile backend TypeScript → dist/
	cd backend && npm run build

build-frontend: ## Next.js production build
	cd frontend && npm run build

build: build-backend build-frontend ## Build both services

##@ Test

test-backend: ## Run backend unit tests
	cd backend && npm test

test-backend-e2e: ## Run backend e2e tests
	cd backend && npm run test:e2e

test-frontend: ## Run frontend tests
	cd frontend && npm test

test: test-backend test-frontend ## Run all unit tests

##@ Lint

lint-backend: ## Lint backend
	cd backend && npm run lint

lint-frontend: ## Lint frontend
	cd frontend && npm run lint

lint: lint-backend lint-frontend ## Lint both services

##@ Docker

docker-build: ## Build Docker images for all services
	docker compose build

docker-up: ## Start all containers in the background
	docker compose up -d

docker-down: ## Stop and remove containers
	docker compose down

docker-logs: ## Follow logs for all containers
	docker compose logs -f

docker-restart: ## Restart all containers
	docker compose restart

##@ Clean

clean: ## Remove build artefacts and node_modules
	rm -rf backend/dist backend/node_modules
	rm -rf frontend/.next frontend/node_modules
