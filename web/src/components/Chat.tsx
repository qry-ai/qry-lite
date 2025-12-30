import { useState, useRef, useEffect } from "preact/hooks";
import { Search, ArrowUp, Info, BugIcon } from 'lucide-react';
import Markdown from "react-markdown";
import { ContextLevel } from "../gen/proto/gateway/v1/gateway_pb";
import { QryLiteIntroBanner } from "./QryLiteIntroBanner";

const ContextControl = ({ value, onChange, totalMessages }) => {
  const strategies = [
    {
      value: ContextLevel.CHAT_CONTEXT_NONE,
      label: 'None',
      description: 'No prior context'
    },
    {
      value: ContextLevel.CHAT_CONTEXT_RECENT,
      label: 'Recent',
      description: 'Last few messages'
    },
    {
      value: ContextLevel.CHAT_CONTEXT_SUMMARY,
      label: 'Summarized',
      description: 'Condensed history',
      disabled: true
    },
    {
      value: ContextLevel.CHAT_CONTEXT_FULL,
      label: 'Full',
      description: 'Complete context'
    },
  ];

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1 group relative">
        <span className="text-sm text-gray-600 dark:text-gray-400">Context</span>
        <Info
          size={14}
          className="text-gray-400 dark:text-gray-500 cursor-help"
        />
        <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block z-10">
          <div className="bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
            How much conversation history to include
            <div className="absolute top-full right-4 -mt-1 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
          </div>
        </div>
      </div>
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        {strategies.map((strategy) => (
          <button
            disabled={strategy.disabled}
            key={strategy.value}
            onClick={() => onChange(strategy.value)}
            title={strategy.description}
            className={
              strategy.disabled
                ? 'cursor-not-allowed px-3 py-1 text-sm font-medium rounded-md bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 transition-all'
                : value === strategy.value
                  ? 'cursor-pointer px-3 py-1 text-sm font-medium rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm transition-all'
                  : 'cursor-pointer px-3 py-1 text-sm font-medium rounded-md text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-all'
            }
          >
            {strategy.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export interface Message {
  role: 'user' | 'assistant'
  content: string
  isStreaming: boolean
  error?: string
}

const ChatMessage = ({ role, content, isStreaming, error }: Partial<Message>) => {
  const isUser = role === 'user';

  return (
    <div className={
      isUser
        ? 'flex rounded-xl gap-4 p-6 bg-gray-50 dark:bg-gray-800/50'
        : 'flex rounded-xl gap-4 p-6 bg-white dark:bg-gray-900/50'
    }>
      <div className={
        isUser
          ? 'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-semibold bg-blue-500 dark:bg-blue-600 text-white'
          : 'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-semibold bg-gray-800 dark:bg-gray-700 text-white'
      }>
        {isUser ? 'Me' : 'Q'}
      </div>

      <div className="flex-1 max-w-3xl">
        {error ? (
          <div className="text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <p className="font-medium">Error</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        ) : (
          <>
            <div className="text-gray-900 dark:text-gray-100 leading-relaxed whitespace-pre-wrap">
              <Markdown skipHtml>{content}</Markdown>
            </div>

            {isStreaming && (
              <span className="inline-block w-2 h-4 bg-gray-900 dark:bg-gray-100 ml-1 animate-pulse" />
            )}
          </>
        )}
      </div>
    </div>
  );
};

interface ISearchBarProps {
  onSend: (content: string) => void
  disabled?: boolean
}

const SearchBar = ({ onSend, disabled }: ISearchBarProps) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = () => {
    if (query) {
      onSend(query.trim())
      setQuery('')
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <div className={
        isFocused
          ? 'relative bg-white dark:bg-gray-800 border-2 rounded-2xl transition-all duration-200 ease-out border-blue-500 dark:border-blue-400 shadow-[0_0_0_3px_rgba(59,130,246,0.1)] dark:shadow-[0_0_0_3px_rgba(96,165,250,0.2)]'
          : 'relative bg-white dark:bg-gray-800 border-2 rounded-2xl transition-all duration-200 ease-out border-gray-200 dark:border-gray-700 shadow-sm hover:border-gray-300 dark:hover:border-gray-600'
      }>
        <div className="flex items-center gap-3 p-4">
          <Search
            className={
              isFocused
                ? 'flex-shrink-0 transition-colors duration-200 text-blue-500 dark:text-blue-400'
                : 'flex-shrink-0 transition-colors duration-200 text-gray-400 dark:text-gray-500'
            }
            size={22}
          />

          <input
            id='chatInputField'
            disabled={disabled}
            autoFocus
            className="flex-1 text-base text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 bg-transparent border-none outline-none"
            type="text"
            value={query}
            onChange={(e: any) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Ask anything..."
            autoComplete="off"
          />

          <div>
            <button
              onClick={handleSearch}
              disabled={!query.trim()}
              className="flex-shrink-0 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Send message"
            >
              <ArrowUp className="text-blue-500 dark:text-blue-400" size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface IChatProps {
  onSend: (content: string, contextLevel: ContextLevel) => void
  messages: Message[]
  inputDisabled?: boolean
}

export function Chat({ inputDisabled, onSend, messages }: IChatProps) {
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [contextLevel, setContextLevel] = useState<ContextLevel>(ContextLevel.CHAT_CONTEXT_NONE);

  useEffect(() => {
    if (!isUserScrolling && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isUserScrolling]);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;

    setIsUserScrolling(!isAtBottom);
  };

  const handleSendMessage = (content: string, contextLevel: ContextLevel) => {
    onSend(content, contextLevel)
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      {
        (messages.length > 0) ? (
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex-1 px-4 py-8 overflow-y-auto"
          >
            <div className="max-w-3xl mx-auto space-y-4">
              {
                messages.map((msg, idx) => (
                  <ChatMessage
                    key={idx}
                    role={msg.role}
                    content={msg.content}
                    isStreaming={msg.isStreaming}
                    error={msg.error}
                  />
                ))
              }
              <div className="mt-32" ref={messagesEndRef} />
            </div>
          </div>
        ) : (
          <div className="flex-1 px-4 py-8 flex items-center justify-center text-gray-500 dark:text-gray-400">
            <QryLiteIntroBanner />
          </div>
        )
      }

      <div className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-4">
        <div className="max-w-3xl mx-auto">
          <SearchBar onSend={(content) => handleSendMessage(content, contextLevel)} disabled={inputDisabled} />

          <div className="flex flex-row items-center justify-between w-full mt-3 mx-2">
            <ContextControl
              value={contextLevel}
              onChange={setContextLevel}
              totalMessages={messages.length}
            />

            <div className="flex items-center text-[8pt] text-gray-600 dark:text-gray-400 italic">
              <a className="inline-flex items-center gap-1" href='https://github.com/qry-ai/feedback/issues/new' target='_blank'>Share Feedback / Report Issue <BugIcon size={12} /></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
