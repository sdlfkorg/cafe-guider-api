# Determine this makefile's path.
# Be sure to place this BEFORE `include` directives, if any.
THIS_FILE := $(lastword $(MAKEFILE_LIST))

PROJECT := cafe_guider_api

DOCKER_COMPOSE_LOCAL := docker compose --file docker-compose.yml --project-name $(PROJECT)
DOCKER_LOCAL := docker

DOCKER_COMPOSE := $(DOCKER_COMPOSE_LOCAL)
DOCKER := $(DOCKER_LOCAL)


info:
	$(DOCKER) info

docker-ps:
	$(DOCKER) ps -a --filter "label=com.docker.compose.project=$(PROJECT)"

ips:
	sh -c "$(DOCKER) ps -a --filter "label=com.docker.compose.project=$(PROJECT)" -q | xargs -I {} $(DOCKER) inspect --format '{{.Name}} {{.State.Status}} {{range .NetworkSettings.Networks}}{{.IPAddress}} {{end}}' {}"

networks:
	docker network ls -q | xargs -I{} docker network inspect {} | jq --raw-output '"\(.[0].Name) \(.[0].IPAM.Config[0].Subnet)"'

config:
	$(DOCKER_COMPOSE) config

ps:
	$(DOCKER_COMPOSE) ps

stop:
	$(DOCKER_COMPOSE) stop

start:
	$(DOCKER_COMPOSE) up -d

clean:
	$(DOCKER_COMPOSE) down --volumes

cc:
	@set -e ;\
	echo "What is the command do you want to run via docker-compose? e.g. ps" ;\
    read dc_command ;\
	$(DOCKER_COMPOSE) $$dc_command

dc:
	@set -e ;\
	echo "What is the command do you want to run via docker? e.g. ps" ;\
    read dc_command ;\
	$(DOCKER) $$dc_command

default:
	@ date

env:
	@if [ -a ".env" ]; then echo "Env file exists, passing..."; else cp sample.env .env; echo "Env file created.."; fi

logs:
	$(DOCKER_COMPOSE) logs -f

dev:
	$(DOCKER_COMPOSE) up

restart:
	$(DOCKER_COMPOSE) restart

build:
	$(DOCKER_COMPOSE) build

prune:
	$(DOCKER) prune system
