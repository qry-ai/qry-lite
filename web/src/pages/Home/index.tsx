import { Chat } from '../../module';
import { ContextLevel, GatewayService } from '../../gen/proto/gateway/v1/gateway_pb';
import { useClientWithCallback } from '../../hooks/rpc';
import { useRef, useState } from 'preact/hooks';
import { Message } from '../../components/Chat';

const TopBanner = () => {
	return (
		<div className="fixed top-0 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 w-full text-white px-4 py-1 text-center z-50 shadow-md">
			<p className="text-sm">
				Qry Lite is in early development &mdash; privacy-first AI chat, open source and always free. <a className="underline hover:text-blue-100 font-medium" target="_blank" rel="noopener noreferrer" href='https://qry.lol/about-us'>Learn about our mission</a>
			</p>
		</div>
	)
}

export function Home() {
	const gatewayServiceClient = useClientWithCallback(GatewayService)

	const [messages, setMessages] = useState<Message[]>([]);
	const [isStreaming, setIsStreaming] = useState(false);
	const streamingMessageIndexRef = useRef(-1);

	const handleSendMessage = (content: string, contextLevel: ContextLevel) => {
		setMessages(prev => [...prev, { role: 'user', content, isStreaming: false }]);

		setMessages(prev => {
			streamingMessageIndexRef.current = prev.length;
			return [...prev, { role: 'assistant', content: '', isStreaming: true }];
		});

		let partialMessageContent = ''

		gatewayServiceClient.query(
			{
				content: content,
				contextLevel: contextLevel
			},
			(response) => {
				if (response?.token) {
					partialMessageContent += response.token;
					setMessages(prev => {
						const newMessages = [...prev];
						newMessages[streamingMessageIndexRef.current] = {
							role: 'assistant',
							content: partialMessageContent,
							isStreaming: true
						};
						return newMessages;
					});
				}

				if (response?.endOfStream) {
					setIsStreaming(false);
					setMessages(prev => {
						const newMessages = [...prev];
						newMessages[streamingMessageIndexRef.current] = {
							role: 'assistant',
							content: partialMessageContent,
							isStreaming: false
						};
						return newMessages;
					});
				}
			},
			(err) => {
				setIsStreaming(false);

				if (err) {
					const errorMessage = err?.message || 'An error occurred. Please try again.';
					setMessages(prev => {
						const newMessages = [...prev];
						newMessages[streamingMessageIndexRef.current] = {
							role: 'assistant',
							content: partialMessageContent || '',
							error: errorMessage,
							isStreaming: false
						};
						return newMessages;
					});
				}
			}
		);
	};

	return (
		<div className="h-dvh flex flex-col">
			<main className="flex-1 overflow-y-auto">
				<TopBanner />

				<Chat
					onSend={handleSendMessage}
					messages={messages}
					inputDisabled={isStreaming} />
			</main>
		</div>
	);
}
