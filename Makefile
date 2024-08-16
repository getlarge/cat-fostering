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
