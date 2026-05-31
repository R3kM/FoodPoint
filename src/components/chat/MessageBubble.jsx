import "./Chat.css";

/**
 * Ícone de check duplo estilo WhatsApp
 * lida=true  → azul (mensagem vista)
 * lida=false → cinza (enviada, não vista)
 */
function ReadReceipt({ lida }) {
  const color = lida ? "#4fc3f7" : "rgba(255,255,255,0.55)";
  return (
    <svg
      className="read-receipt"
      width="16" height="11"
      viewBox="0 0 16 11"
      fill="none"
      aria-label={lida ? "Visualizada" : "Enviada"}
    >
      {/* primeira barra */}
      <polyline
        points="1,5.5 4.5,9 10,2"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* segunda barra (deslocada para a direita) */}
      <polyline
        points="5,5.5 8.5,9 14,2"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function MessageBubble({ message, myTipo }) {
  // Suporta tanto o formato do banco (remetente_tipo/conteudo)
  // quanto o formato mock antigo (sender/text)
  const conteudo = message.conteudo || message.text || "";
  const remetente = message.remetente_tipo || message.sender || "";
  const isMe = remetente === myTipo;
  const lida = Boolean(message.lida);

  const timestamp = message.enviado_em
    ? new Date(message.enviado_em).toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : message.time || "";

  return (
    <div className={`message-bubble ${isMe ? "me" : "other"}`}>
      <div className="message-text">{conteudo}</div>
      <div className="message-meta">
        <span>{timestamp}</span>
        {isMe && <ReadReceipt lida={lida} />}
      </div>
    </div>
  );
}
