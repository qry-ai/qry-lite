package service

import (
	"connectrpc.com/connect"
	"context"
	"encoding/json"
	"errors"
	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/packages/ssestream"
	v1 "github.com/qry-ai/qry-lite/api/gen/proto/gateway/v1"
	"github.com/rs/zerolog/log"
	"strings"
)

type GatewayServiceHandler struct {
	openAiClient  openai.Client
	contextWindow *ContextWindowService
	store         ConversationStore
}

func NewGatewayServiceHandler(
	client openai.Client,
	store ConversationStore,
) *GatewayServiceHandler {
	return &GatewayServiceHandler{
		openAiClient:  client,
		contextWindow: NewContextWindowService(store),
		store:         store,
	}
}

func (g *GatewayServiceHandler) Query(
	ctx context.Context,
	req *v1.QueryRequest,
	rw *connect.ServerStream[v1.QueryResponse],
) error {
	messages, err := g.contextWindow.BuildContextWindow(
		ctx,
		req.SessionId,
		req.Content,
		req.ContextLevel,
	)
	if err != nil {
		log.Err(err).Msg("failed to build context window")
		return errors.New("failed to build context window")
	}

	msgs, _ := json.MarshalIndent(messages, "  ", "  ")

	log.Debug().Msgf("Message Log:\n%v\n", string(msgs))

	stream := g.openAiClient.Chat.Completions.NewStreaming(ctx, openai.ChatCompletionNewParams{
		Messages: messages,
	})

	defer func(stream *ssestream.Stream[openai.ChatCompletionChunk]) {
		err := stream.Close()
		if err != nil {
			log.Err(err).Msg("failed to close openai-client stream")
		}
	}(stream)

	responseBuilder := strings.Builder{}

	for stream.Next() {
		chunk := stream.Current()

		if len(chunk.Choices) > 0 && chunk.Choices[0].Delta.Content != "" {
			content := chunk.Choices[0].Delta.Content
			responseBuilder.WriteString(content)

			if err := rw.Send(&v1.QueryResponse{
				Token:       content,
				EndOfStream: false,
			}); err != nil {
				log.Err(err).Msg("failed to write chunk")
				return errors.New("failed to write chunk")
			}
		}
	}

	if err := stream.Err(); err != nil {
		return err
	}

	if err := g.store.AppendMessage(ctx, req.SessionId, openai.UserMessage(req.Content)); err != nil {
		log.Err(err).Msg("failed to store user message")
	}

	if err := g.store.AppendMessage(ctx, req.SessionId, openai.AssistantMessage(responseBuilder.String())); err != nil {
		log.Err(err).Msg("failed to store assistant message")
	}

	if err := rw.Send(&v1.QueryResponse{
		EndOfStream: true,
	}); err != nil {
		log.Err(err).Msg("failed to write end-of-stream")
		return errors.New("failed to write end-of-stream")
	}

	return nil
}
