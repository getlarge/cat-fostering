ci: ## Run CI workflow defined in GitHub Actions CI workflow.
	@echo 'ℹ️  Prerequisites: https://github.com/nektos/act#installation-through-package-managers'
	@echo 'ℹ️  Prerequisites: https://github.com/cli/cli#installation'
	@echo '{"head_commit": {"message": "build latest"}}' >github_event.tmp

  # export GITHUB_TOKEN=$(gh auth token)
  # export DOTENV_PRIVATE_KEY_CI=$(cat .env.keys | grep DOTENV_PRIVATE_KEY_CI | cut -d '=' -f2 | tr -d '"')
	@act push --container-daemon-socket="unix:///var/run/docker.sock" --bind --env-file='' --var NX_CLOUD_DISTRIBUTED_EXECUTION=${NX_CLOUD_DISTRIBUTED_EXECUTION:-false} -s GITHUB_TOKEN="${GITHUB_TOKEN}" -s DOTENV_PRIVATE_KEY_CI=${DOTENV_PRIVATE_KEY_CI} --pull=true -e github_event.tmp
	@rm -f github_event.tmp


ci-clean: ## Clean up containers and volumes created by CI workflow.
	@docker compose --profile ci -p cat-fostering down

dev-up: ## Start development environment.
	@docker compose --profile dev -p cat-fostering --env-file .env up -d

dev-down: ## Stop development environment.
	@docker compose --profile dev -p cat-fostering --env-file .env down

dev-logs: ## Show logs of development environment.
	@docker compose --profile dev -p cat-fostering logs -f --tail=100

dev-clean: ## Clean up containers and volumes created by development environment.
	@docker compose --profile dev -p cat-fostering down -v --rmi all

staging-up: ## Start staging environment.
	@npx dotenvx run -- docker compose --profile staging -p cat-fostering-staging up -d

staging-down: ## Stop staging environment.
	@npx dotenvx run -- docker compose --profile staging -p cat-fostering-staging down

staging-logs: ## Show logs of staging environment.
	@docker compose --profile staging -p cat-fostering-staging logs -f --tail=100

staging-clean: ## Clean up containers and volumes created by staging environment.
	@docker compose --profile staging -p cat-fostering-staging down -v --rmi all

caddy-build: ## Build Caddy image.
	@docker buildx build infra/caddy -f infra/caddy/Dockerfile -t getlarge/cat-fostering-caddy --load

caddy-push: ## Push Caddy image.
	@docker buildx build infra/caddy -f infra/caddy/Dockerfile --platform linux/amd64,linux/arm64 -t getlarge/cat-fostering-caddy --push",
