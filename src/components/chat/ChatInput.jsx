import { useState } from "react";
import "./Chat.css";

export default function ChatInput({ onSend, disabled }) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim() || disabled) return;
    onSend(text.trim());
    setText("");
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-input-row">
      <input
        className="chat-input"
        type="text"
        placeholder="Digite sua mensagem..."
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyDown={handleKey}
        disabled={disabled}
      />
      <button className="chat-send-btn" onClick={handleSend} disabled={disabled}>
        {disabled ? "..." : "Enviar"}
      </button>
    </div>
  );
}
