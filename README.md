# qry-lite
qry-lite is a super lightweight chat interface for interfacing with a Large Language Model (LLM).

## setting it up
An easy way to get started is by using docker compose. Here's an example configuration for qry-lite:

```yml
// docker-compose.yml
version: "3.8"
services:
  qry-lite:
    image: ghcr.io/qry-ai/qry-lite:main
    restart: always
    ports:
      - 80
      - 8080
    environment:
      - ALLOWED_ORIGINS=http://localhost:80
      - VITE_QRY_API_URL=http://localhost:8080
      - OPENAI_BASE_URL=...
      - OPENAI_API_KEY=...
```

## demo
<img width="1280" height="720" alt="Screenshot 2025-12-18 at 13 00 12" src="https://github.com/user-attachments/assets/a59be4a3-3319-4ced-9957-1f4ae8f1459f" />

# license
See [LICENSE](./LICENSE.md)
