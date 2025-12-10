import React, { useState, useRef, useEffect } from 'react';
import styles from './styles.module.css';

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{ sender: 'user' | 'bot'; text: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMessage = { sender: 'user' as const, text: query };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setQuery('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/agent/chat', { // Assuming your FastAPI is on 8000
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Failed to get reader from response body.');
      }

      let botResponseText = '';
      setMessages((prevMessages) => [...prevMessages, { sender: 'bot', text: '' }]); // Add an empty bot message to start streaming

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        botResponseText += chunk;

        setMessages((prevMessages) => {
          const lastMessage = prevMessages[prevMessages.length - 1];
          if (lastMessage && lastMessage.sender === 'bot') {
            return [
              ...prevMessages.slice(0, -1),
              { ...lastMessage, text: botResponseText },
            ];
          }
          return prevMessages; // Should not happen if we pre-added an empty bot message
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'bot', text: `Error: Could not connect to the agent. Is the backend running? (${error instanceof Error ? error.message : String(error)})` },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button className={styles.chatbotToggleButton} onClick={toggleChat} title="Open Chatbot">
        💬
      </button>

      {isOpen && (
        <div className={styles.chatbotPopup}>
          <div className={styles.chatbotHeader}>
            <h3>Textbook Tutor</h3>
            <button className={styles.closeButton} onClick={toggleChat}>
              &times;
            </button>
          </div>
          <div className={styles.chatbotMessages}>
            {messages.length === 0 && (
              <div className={styles.welcomeMessage}>
                Hi there! Ask me anything about Humanoid Robotics.
              </div>
            )}
            {messages.map((msg, index) => (
              <div key={index} className={`${styles.message} ${styles[msg.sender]}`}>
                {msg.text}
              </div>
            ))}
            {isLoading && (
              <div className={`${styles.message} ${styles.bot}`}>
                <span className={styles.loadingDot}>.</span>
                <span className={styles.loadingDot}>.</span>
                <span className={styles.loadingDot}>.</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSendMessage} className={styles.chatbotInputForm}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask a question..."
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading}>
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;
