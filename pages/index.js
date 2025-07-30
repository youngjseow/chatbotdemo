import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function ChatApp() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message to history
    setMessages(prev => [...prev, { sender: 'user', text: input }]);
    setInput('');

    // Get AI response
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input })
    });
    const data = await res.json();

    // Add AI response to history
    setMessages(prev => [...prev, { sender: 'ai', text: data.reply }]);
  };

  return (
    <div className="d-flex flex-column vh-100">
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
                : 'bg-light'}`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Fixed Input at Bottom */}
      <div className="p-3 bg-white border-top">
        <form onSubmit={handleSubmit} className="d-flex">
          <input
            type="text"
            className="form-control me-2"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            autoFocus
          />
          <button className="btn btn-primary" type="submit">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
