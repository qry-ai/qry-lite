package service

import (
	"context"
	"github.com/openai/openai-go/v3"
	v1 "github.com/qry-ai/qry-lite/api/gen/proto/gateway/v1"
)

type ContextWindowService struct {
	store ConversationLog
}

func NewContextWindowService(store ConversationStore) *ContextWindowService {
	return &ContextWindowService{store: store}
}

func (s *ContextWindowService) BuildContextWindow(
	ctx context.Context,
	sessionID string,
	currentMessage string,
	level v1.ContextLevel,
) ([]openai.ChatCompletionMessageParamUnion, error) {
	history, err := s.store.GetMessages(ctx, sessionID)
	if err != nil {
		return nil, err
	}

	currentMsg := openai.UserMessage(currentMessage)

	switch level {
	case v1.ContextLevel_CHAT_CONTEXT_NONE:
		return []openai.ChatCompletionMessageParamUnion{currentMsg}, nil
	case v1.ContextLevel_CHAT_CONTEXT_RECENT:
		return s.getRecentWindow(history, currentMsg), nil
	case v1.ContextLevel_CHAT_CONTEXT_SUMMARY:
		panic("Not yet implemented")
	case v1.ContextLevel_CHAT_CONTEXT_FULL:
		return append(history, currentMsg), nil
	default:
		return append(history, currentMsg), nil
	}
}

func (s *ContextWindowService) getRecentWindow(
	history []openai.ChatCompletionMessageParamUnion,
	currentMsg openai.ChatCompletionMessageParamUnion,
) []openai.ChatCompletionMessageParamUnion {
	// Here we assume that we have a prompt/input and an equivalent
	// reply from the assistant. We want to return 3 pairs of context
	// for a 'recent' window. We should allow this to be configurable in the future...

	const recentPairs = 3

	if len(history) <= recentPairs*2 {
		return append(history, currentMsg)
	}

	// Take last N*2 messages (user + assistant pairs)
	startIdx := len(history) - (recentPairs * 2)
	recent := history[startIdx:]
	return append(recent, currentMsg)
}
