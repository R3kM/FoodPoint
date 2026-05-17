import "./Chat.css";
import ChatInput from "./ChatInput";
import MessageBubble from "./MessageBubble";

export default function ChatWindow({ selectedChat, messages, sending, onSendMessage }) {
  if (!selectedChat) {
    return (
      <div className="chat-window">
        <div className="chat-empty">
          <div>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{margin:"0 auto 12px",display:"block",color:"var(--border)"}}><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
            <p style={{fontWeight:600,color:"var(--text-2)",marginBottom:4}}>Selecione uma conversa</p>
            <p style={{fontSize:13}}>Escolha um vendedor na lista ao lado para começar.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-window">
      <div className="chat-window-header">{selectedChat.nome_empresa}</div>
      <div className="chat-messages">
        {messages.length === 0 && (
          <div style={{textAlign:"center",color:"var(--text-3)",fontSize:13,marginTop:32}}>
            Sem mensagens ainda. Diga olá!
          </div>
        )}
        {messages.map(m => (
          <MessageBubble key={m.id} message={m} />
        ))}
      </div>
      <ChatInput onSend={onSendMessage} disabled={sending} />
    </div>
  );
}
