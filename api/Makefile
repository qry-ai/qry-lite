ENV_VARS = \
	SOURCE_DOTENV=true \
	ALLOWED_ORIGINS=http://localhost:5173

hot-reload:
	find . -maxdepth 3 -type f | entr -r env $(ENV_VARS) go run main.go

.PHONY: hot-reload