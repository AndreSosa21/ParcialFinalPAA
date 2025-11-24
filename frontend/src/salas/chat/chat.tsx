import { useState, useEffect, useRef } from "react";
import type { FormEvent } from "react";
import "./chat.css";

type ChatMessage = {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
};

type ChatProps = {
  roomName: string;
  username: string;
};

const Chat = ({ roomName, username }: ChatProps) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      sender: "Sistema",
      content: `Bienvenido a la sala "${roomName}". Esta demo funciona solo en frontend (por ahora).`,
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    const newMessage: ChatMessage = {
      id: messages.length ? messages[messages.length - 1].id + 1 : 1,
      sender: username || "Invitado",
      content: trimmed,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
  };

  const isTyping = input.trim().length > 0;

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div>
          <p className="chat-kicker">💭 Conversación en vivo</p>
          <h3 className="chat-title">{roomName}</h3>
        </div>
        <span className="chat-status">
          🟢 Simulación WS · sólo frontend
        </span>
      </div>

      <div className="chat-messages">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`chat-message ${
              msg.sender === username ? "chat-message-own" : ""
            }`}
          >
            <div className="chat-message-header">
              <span className="chat-sender">
                {msg.sender === username ? "😎 Tú" : `🙂 ${msg.sender}`}
              </span>
              <span className="chat-time">{msg.timestamp}</span>
            </div>
            <p className="chat-content">{msg.content}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-hint">
        {isTyping
          ? "✍️ Presiona Enter o el botón para enviar."
          : "💡 Escribe un mensaje para empezar la conversación."}
      </div>

      <form className="chat-input-row" onSubmit={handleSend}>
        <input
          type="text"
          value={input}
          maxLength={280}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe un mensaje bonito…"
        />
        <button type="submit">Enviar ➤</button>
      </form>
    </div>
  );
};

export default Chat;
