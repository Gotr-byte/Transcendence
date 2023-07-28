#------Colors--------
EOC		=	"\033[0;0m"
RED		=	"\033[1;31m"
YELLOW	=	"\033[1;33m"
GREEN	=	"\033[1;32m"
#====================

all: up

up:	
	@echo $(GREEN) Starting Containers ... $(EOC);
	@docker compose -f ./docker-compose.yml up --build


silent:	
	@echo $(GREEN) Starting Containers silently ... $(EOC);
	@docker compose -f ./docker-compose.yml up -d --build

down:
	@docker compose -f ./docker-compose.yml down
	@echo $(YELLOW) Containers Removed $(EOC);

clean:
	@docker compose -f ./docker-compose.yml down --rmi all
	@echo $(RED) Images Removed $(EOC);

dev_up:	
	@echo $(GREEN) Starting Containers ... $(EOC);
	@docker compose -f ./docker-compose.dev.yml up --build

dev_down:
	@docker compose -f ./docker-compose.dev.yml down
	@echo $(YELLOW) Containers Removed $(EOC);

dev_clean:
	@docker compose -f ./docker-compose.dev.yml down --rmi all
	@echo $(RED) Images Removed $(EOC);

re: clean all

.PHONY: up