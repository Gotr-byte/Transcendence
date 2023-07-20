#------Colors--------
EOC		=	"\033[0;0m"
RED		=	"\033[1;31m"
YELLOW	=	"\033[1;33m"
GREEN	=	"\033[1;32m"
#====================

all: up

up:	
	@docker-compose -f ./docker-compose.yml up -d --build

down:
	@docker compose -f ./docker-compose.yml down

clean:
	@docker compose -f ./docker-compose.yml down --rmi all

re: clean all


