package service

import (
	"connectrpc.com/connect"
	"context"
	"errors"
	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/packages/ssestream"
	v1 "github.com/qry-ai/qry-lite/api/gen/proto/gateway/v1"
	"github.com/rs/zerolog/log"
)

type GatewayServiceHandler struct {
	openAiClient openai.Client
}

func NewGatewayServiceHandler(openAiClient openai.Client) *GatewayServiceHandler {
	return &GatewayServiceHandler{
		openAiClient: openAiClient,
	}
}

func (g GatewayServiceHandler) Query(ctx context.Context, req *v1.QueryRequest, rw *connect.ServerStream[v1.QueryResponse]) error {
	stream := g.openAiClient.Chat.Completions.NewStreaming(ctx, openai.ChatCompletionNewParams{
		Messages: []openai.ChatCompletionMessageParamUnion{
			openai.UserMessage(req.Content),
		},
	})
	defer func(stream *ssestream.Stream[openai.ChatCompletionChunk]) {
		err := stream.Close()
		if err != nil {
			log.Err(err).Msg("failed to close openai-client stream")
		}
	}(stream)

	for stream.Next() {
		chunk := stream.Current()

		if len(chunk.Choices) > 0 && chunk.Choices[0].Delta.Content != "" {
			if err := rw.Send(&v1.QueryResponse{
				Token:       chunk.Choices[0].Delta.Content,
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

	if err := rw.Send(&v1.QueryResponse{
		EndOfStream: true,
	}); err != nil {
		log.Err(err).Msg("failed to write end-of-stream")
		return errors.New("failed to write end-of-stream")
	}

	return nil
}
