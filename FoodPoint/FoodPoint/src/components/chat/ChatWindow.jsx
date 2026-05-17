import "./Chat.css";

import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";

export default function ChatWindow({
  selectedChat,
  messages,
  onSendMessage,
}) {
  if (!selectedChat) {
    return (
      <div className="chat-empty">
        <h2>
          Selecione uma conversa
        </h2>

        <p>
          Escolha um vendedor para
          começar o chat.
        </p>
      </div>
    );
  }

  return (
    <section className="chat-window">
      <div className="chat-window-header">
        <div className="chat-avatar">
          {selectedChat.nome_empresa[0]}
        </div>

        <div>
          <h3>
            {selectedChat.nome_empresa}
          </h3>

          <span>
            {selectedChat.bairro}
          </span>
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
          />
        ))}
      </div>

      <ChatInput
        onSend={onSendMessage}
      />
    </section>
  );
}