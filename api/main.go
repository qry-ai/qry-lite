package main

import (
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	godotenv "github.com/joho/godotenv"
	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/option"
	"github.com/qry-ai/qry-lite/api/gen/proto/gateway/v1/gatewayv1connect"
	"github.com/qry-ai/qry-lite/api/internal"
	"github.com/qry-ai/qry-lite/api/service"
	log "github.com/rs/zerolog/log"
	"golang.org/x/net/http2"
	"golang.org/x/net/http2/h2c"
	"net/http"
	"slices"
	"strings"
)

func main() {
	if internal.ShouldHave("SOURCE_DOTENV", "false") == "true" {
		err := godotenv.Load()
		if err != nil {
			log.Err(err).Msg("failed to load .env")
		}
	}

	allowedOrigins := strings.Split(internal.MustHave("ALLOWED_ORIGINS"), ",")
	bindAddress := internal.ShouldHave("BIND_ADDRESS", ":8080")
	openaiApiKey := internal.MustHave("OPENAI_API_KEY")
	openaiBaseUrl := internal.MustHave("OPENAI_BASE_URL")

	cr := chi.NewRouter()
	cr.Use(middleware.Logger)
	cr.Use(func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			origin := r.Header.Get("Origin")

			if slices.Contains(allowedOrigins, origin) {
				w.Header().Set("Access-Control-Allow-Origin", origin)
				w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
				w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, sentry-trace, baggage, connect-protocol-version, Connect-Timeout-Ms, X-User-Agent, X-Qry-Session-Id")
				w.Header().Set("Access-Control-Allow-Credentials", "true")
			}

			if r.Method == "OPTIONS" {
				w.WriteHeader(http.StatusOK)
				return
			}

			next.ServeHTTP(w, r)
		})
	})

	openAiClient := openai.NewClient(
		option.WithAPIKey(openaiApiKey),
		option.WithBaseURL(openaiBaseUrl))

	gatewayService := service.NewGatewayServiceHandler(openAiClient, service.NewInMemoryConversationStore())
	path, handler := gatewayv1connect.NewGatewayServiceHandler(gatewayService)
	cr.Mount(path, handler)

	server := &http2.Server{}
	http2Handler := h2c.NewHandler(cr, server)
	if err := http.ListenAndServe(bindAddress, http2Handler); err != nil {
		log.Err(err).Msg("failed to start http2 server")
	}
}
