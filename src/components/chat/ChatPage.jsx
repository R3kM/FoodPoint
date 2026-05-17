import { useState } from "react";
import "./Chat.css";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";
import { useChat } from "../../hooks/useChat";
import { useSellers } from "../../hooks/useSellers";

/**
 * ChatPage
 * ─────────
 * Página de chat que conecta clientes e vendedores.
 * Clientes veem a lista de vendedores disponíveis para conversar.
 * Vendedores verão suas conversas ativas (gerenciado pelo MessagesPanel no dashboard).
 */
export default function ChatPage({ user }) {
  const { sellers } = useSellers();
  const [selectedSeller, setSelectedSeller] = useState(null);

  const isSeller  = user?.tipo === "seller";
  const clienteId = !isSeller ? user?.id : null;
  const vendedorId = selectedSeller?.id || null;

  const { messages, sending, send } = useChat({
    clienteId,
    vendedorId,
  });

  const handleSend = (conteudo) => {
    if (!user) return;
    send(conteudo, isSeller ? "vendedor" : "cliente", user.id);
  };

  // Vendedor acessa chat pelo dashboard (MessagesPanel)
  if (isSeller) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "calc(100vh - 72px)", color: "var(--text-3)", fontSize: 15 }}>
        <div style={{ textAlign: "center" }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ margin: "0 auto 12px", display: "block", color: "var(--border)" }}>
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
          </svg>
          <p style={{ fontWeight: 600, color: "var(--text-2)", marginBottom: 4 }}>Gerencie suas mensagens</p>
          <p style={{ fontSize: 13 }}>Acesse o painel do vendedor → aba Mensagens.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-layout">
      <ChatSidebar
        sellers={sellers}
        selectedChat={selectedSeller}
        onSelect={setSelectedSeller}
      />
      <ChatWindow
        selectedChat={selectedSeller}
        messages={messages}
        sending={sending}
        onSendMessage={handleSend}
      />
    </div>
  );
}
