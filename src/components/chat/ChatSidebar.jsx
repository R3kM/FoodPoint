import "./Chat.css";

export default function ChatSidebar({ sellers, selectedChat, onSelect }) {
  return (
    <aside className="chat-sidebar">
      <div className="chat-sidebar-header">Conversas</div>
      <div className="chat-sidebar-list">
        {sellers.map(seller => (
          <div
            key={seller.id}
            className={`chat-contact ${selectedChat?.id === seller.id ? "active" : ""}`}
            onClick={() => onSelect(seller)}
          >
            <div className="chat-contact-avatar">
              {seller.nome_empresa?.[0]?.toUpperCase() || "V"}
            </div>
            <div>
              <div className="chat-contact-name">{seller.nome_empresa}</div>
              <div className="chat-contact-sub">{seller.bairro}</div>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
