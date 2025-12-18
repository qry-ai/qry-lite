# build the backend api first
FROM golang:1.24-alpine AS api-builder
WORKDIR /app/api
COPY api/go.mod api/go.sum ./
RUN go mod download
COPY api/ .
RUN CGO_ENABLED=0 GOOS=linux go build -o qry-backend-api .

# build the web ui frontend
FROM node:20-alpine AS web-builder
WORKDIR /app
COPY web/package*.json ./
RUN npm ci
COPY web/ .
RUN npm run build

FROM caddy:2-alpine

# pull in the frontend build + server executable
COPY --from=api-builder /app/api/qry-backend-api /usr/local/bin/qry-backend-api
COPY --from=web-builder /app/dist /usr/share/caddy

# we reverse proxy the web with Caddy for ease
RUN echo $':80\nroot * /usr/share/caddy\nfile_server' > /etc/caddy/Caddyfile

EXPOSE 80
CMD caddy start --config /etc/caddy/Caddyfile && /usr/local/bin/qry-backend-api