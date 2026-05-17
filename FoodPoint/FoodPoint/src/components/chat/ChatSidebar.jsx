import "./Chat.css";

export default function ChatSidebar({
  sellers = [],
  selectedChat,
  onSelect,
}) {
  return (
    <aside className="chat-sidebar">
      <div className="chat-sidebar-header">
        <h2>Conversas</h2>
      </div>

      <div className="chat-list">
        {sellers.map((seller) => (
          <button
            key={seller.id}
            className={`chat-user ${
              selectedChat?.id === seller.id
                ? "active"
                : ""
            }`}
            onClick={() => onSelect(seller)}
          >
            <div className="chat-avatar">
              {seller.nome_empresa[0]}
            </div>

            <div className="chat-user-info">
              <strong>
                {seller.nome_empresa}
              </strong>

              <span>
                {seller.bairro}
              </span>
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
}