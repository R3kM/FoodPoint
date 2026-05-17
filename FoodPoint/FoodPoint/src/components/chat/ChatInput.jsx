import { useState } from "react";

import "./Chat.css";

export default function ChatInput({
  onSend,
}) {
  const [message, setMessage] =
    useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    onSend(message);

    setMessage("");
  };

  return (
    <form
      className="chat-input-area"
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        placeholder="Digite sua mensagem..."
        value={message}
        onChange={(e) =>
          setMessage(e.target.value)
        }
      />

      <button type="submit">
        Enviar
      </button>
    </form>
  );
}