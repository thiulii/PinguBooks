.PHONY:
start-bdd:
	- cd Backend && docker compose up -d
stop-bdd:
	- cd Backend && docker compose down
start-backend:
	- cd Backend && npm run dev
run-backend:
	- make start-bdd
	- make start-backend
run-frontend:
	-cd Backend && npm start
