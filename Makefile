# Determine this makefile's path.
# Be sure to place this BEFORE `include` directives, if any.
THIS_FILE := $(lastword $(MAKEFILE_LIST))

PROJECT := cafe_guider_api
DB_NAME_PRIFIX ?= cafe_guider
ENV ?= dev


DOCKER_COMPOSE_LOCAL := docker compose --file docker-compose.yml --project-name $(PROJECT)
DOCKER_LOCAL := docker

DOCKER_COMPOSE := $(DOCKER_COMPOSE_LOCAL)
DOCKER := $(DOCKER_LOCAL)

ifeq ($(ENV),dev)
    DB_NAME ?= $(DB_NAME_PRIFIX)_dev_db
else ifeq ($(ENV),test)
    DB_NAME ?= $(DB_NAME_PRIFIX)_test_db
else ifeq ($(ENV),prod)
    DB_NAME ?= $(DB_NAME_PRIFIX)_prod_db
endif

export DB_NAME

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

init: init-env init-db
	@echo "Initialization completed"

# 初始化環境變量文件
init-env:
	@if [ ! -f .env ]; then \
		echo "Creating .env file..."; \
		echo "DB_NAME=$(DB_NAME)" > .env; \
		echo "POSTGRES_USER=postgres" >> .env; \
		echo "POSTGRES_PASSWORD=1234567890" >> .env; \
		echo "Env file created."; \
	else \
		echo "Env file already exists, skipping..."; \
	fi

# 初始化數據庫目錄和腳本
init-db:
	@if [ ! -d ./data/initdb.d ]; then \
		mkdir -p ./data/initdb.d; \
		echo "Created initdb.d directory"; \
	fi
	@echo "CREATE DATABASE \"$(DB_NAME)\" WITH OWNER = postgres ENCODING = 'UTF8';" > ./data/initdb.d/initdb.sql
	@chmod 644 ./data/initdb.d/initdb.sql
	@echo "Database initialization script created"


check-env:
	@echo "Current DB_NAME is: $(DB_NAME)"
	@echo "Content of .env file:"
	@cat .env


# 列出所有表格
tables:
	docker exec -it cafe-guider-db psql -U postgres -d $(DB_NAME) -c "\dt"

# 查看詳細的表格信息
tables-detail:
	docker exec -it cafe-guider-db psql -U postgres -d $(DB_NAME) -c "\dt+"

# 進入 psql 介面
psql:
	docker exec -it cafe-guider-db psql -U postgres -d $(DB_NAME)

# 查看特定表格結構（使用：make describe-table TABLE=表格名稱）
describe-table:
	@if [ -z "$(TABLE)" ]; then \
		echo "Usage: make describe-table TABLE=table_name"; \
	else \
		docker exec -it cafe-guider-db psql -U postgres -d $(DB_NAME) -c "\d $(TABLE)"; \
	fi