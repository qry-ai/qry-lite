import { useState, useRef, useEffect, useImperativeHandle } from "preact/hooks";
import { Search, ArrowUp } from 'lucide-react';
import Markdown from "react-markdown";
import { Checkbox } from "./Checkbox";

export interface Message {
  role: 'user' | 'assistant'
  content: string
  isStreaming: boolean
  error?: string
}

const ChatMessage = ({ role, content, isStreaming, error }: Partial<Message>) => {
  const isUser = role === 'user';

  return (
    <div className={`flex rounded-xl gap-4 p-6 ${isUser ? 'bg-gray-50' : 'bg-white'}`}>
      <div className={`
        w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-semibold
        ${isUser ? 'bg-blue-500 text-white' : 'bg-gray-800 text-white'}
      `}>
        {isUser ? 'Me' : 'Q'}
      </div>

      <div className="flex-1 max-w-3xl">
        {error ? (
          <div className="text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="font-medium">Error</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        ) : (
          <>
            <div className="text-gray-900 leading-relaxed whitespace-pre-wrap">
              <Markdown>{content}</Markdown>
            </div>

            {isStreaming && (
              <span className="inline-block w-2 h-4 bg-gray-900 ml-1 animate-pulse" />
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
      <div className={`
        relative bg-white border-2 rounded-2xl
        transition-all duration-200 ease-out
        ${isFocused
          ? 'border-blue-500 shadow-[0_0_0_3px_rgba(59,130,246,0.1)]'
          : 'border-gray-200 shadow-sm hover:border-gray-300'
        }
      `}>
        <div className="flex items-center gap-3 p-4">
          <Search
            className={`flex-shrink-0 transition-colors duration-200 ${isFocused ? 'text-blue-500' : 'text-gray-400'
              }`}
            size={22}
          />

          <input
            id='chatInputField'
            disabled={disabled}
            autoFocus
            className="flex-1 text-base text-gray-900 placeholder-gray-400 bg-transparent border-none outline-none"
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
              className="flex-shrink-0 p-2 hover:bg-gray-200 rounded-lg transition-colors"
              title="Copy to clipboard"
            >
              <ArrowUp className="text-blue-500" size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface IChatProps {
  onSend: (content: string) => void
  messages: Message[]
  inputDisabled?: boolean
}

export function Chat({ inputDisabled, onSend, messages }: IChatProps) {
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [shareContext, setShareContext] = useState(true)

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

  const handleSendMessage = (content) => {
    onSend(content)
  };

  return (
    <div className="flex flex-col h-full">
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 px-4 py-8 overflow-y-auto"
      >
        <div className="max-w-3xl mx-auto">
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

      <div className="border-t border-gray-200 bg-white px-4 py-4">
        <div className="max-w-3xl mx-auto">
          <SearchBar onSend={handleSendMessage} disabled={inputDisabled} />

          <div class="flex flex-row items-center justify-end mt-2 mx-2">
            <Checkbox checked={shareContext} onChange={() => setShareContext(prev => !prev)} label="Share entire context" />
          </div>
        </div>
      </div>
    </div>
  );
}