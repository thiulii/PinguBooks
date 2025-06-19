.PHONY:
start-bdd:
	- /Backend && docker compose up
stop-bdd:
	- /Backend && docker compose down
start-backend:
	- ./Backend 66 npm run dev
run-backend:
	- start-bdd start-backend