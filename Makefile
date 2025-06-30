.PHONY:
start-bdd:
	- ./Backend && docker compose up -d
stop-bdd:
	- /Backend && docker compose down
start-backend:
	- ./Backend && npm run dev
run-backend:
	- bdd backend