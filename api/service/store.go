package service

import (
	"context"
	"github.com/openai/openai-go/v3"
)

// ConversationLog is a read only log of conversation
type ConversationLog interface {
	GetMessages(ctx context.Context, sessionID string) ([]openai.ChatCompletionMessageParamUnion, error)
}

type ConversationStore interface {
	ConversationLog
	AppendMessage(ctx context.Context, sessionID string, msg openai.ChatCompletionMessageParamUnion) error
}

type InMemoryConversationStore struct {
	conversations map[string][]openai.ChatCompletionMessageParamUnion
}

func NewInMemoryConversationStore() *InMemoryConversationStore {
	return &InMemoryConversationStore{
		conversations: make(map[string][]openai.ChatCompletionMessageParamUnion),
	}
}

func (s *InMemoryConversationStore) GetMessages(
	_ context.Context,
	sessionID string,
) ([]openai.ChatCompletionMessageParamUnion, error) {
	if msgs, ok := s.conversations[sessionID]; ok {
		return msgs, nil
	}
	return []openai.ChatCompletionMessageParamUnion{}, nil
}

func (s *InMemoryConversationStore) AppendMessage(
	ctx context.Context,
	sessionID string,
	msg openai.ChatCompletionMessageParamUnion,
) error {
	s.conversations[sessionID] = append(s.conversations[sessionID], msg)
	return nil
}
