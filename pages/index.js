import { useState, useRef, useEffect } from 'react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function ChatApp() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return; // Prevent empty/spam submissions

    // Add user message
    const userMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Get AI response
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });
      const data = await res.json();

      // Add AI response
      setMessages(prev => [...prev, { sender: 'ai', text: data.reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        sender: 'ai', 
        text: "Sorry, I encountered an error. Please try again." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="d-flex flex-column vh-100 bg-light">
      {/* Chat History */}
      <div className="flex-grow-1 overflow-auto p-3">
        {messages.map((msg, i) => (
          <div 
            key={i} 
            className={`mb-2 ${msg.sender === 'user' ? 'text-end' : 'text-start'}`}
          >
            <div 
              className={`d-inline-block p-3 rounded-3 ${msg.sender === 'user' 
                ? 'bg-primary text-white' 
                : 'bg-white border'}`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="text-start mb-2">
            <div className="d-inline-block p-3 rounded-3 bg-white border">
              <div className="spinner-border spinner-border-sm text-secondary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <span className="ms-2">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Fixed Input */}
      <div className="p-3 bg-white border-top">
        <form onSubmit={handleSubmit} className="d-flex">
          <input
            type="text"
            className="form-control me-2"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isLoading ? "Wait for response..." : "Type your message..."}
            disabled={isLoading}
            autoFocus
          />
          <button 
            className="btn btn-primary" 
            type="submit"
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true" />
                Sending...
              </>
            ) : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
}
