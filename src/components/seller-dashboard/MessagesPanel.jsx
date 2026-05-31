import { useState, useEffect, useRef, useCallback } from "react";
import { getConversations, getMessages, sendMessage, markMessagesRead } from "../../services/api";
import MessageBubble from "../chat/MessageBubble";
import "../chat/Chat.css";
import "./MessagesPanel.css";

export default function MessagesPanel({ seller }) {
  const [conversas,        setConversas]        = useState([]);
  const [selectedConversa, setSelectedConversa] = useState(null);
  const [messages,         setMessages]         = useState([]);
  const [inputText,        setInputText]        = useState("");
  const [sending,          setSending]          = useState(false);
  const [loading,          setLoading]          = useState(true);
  const pollRef   = useRef(null);
  const bottomRef = useRef(null);

  // ── Busca lista de conversas ──────────────────────────────────────────────
  useEffect(() => {
    if (!seller?.id) return;

    async function loadConversas() {
      const { data } = await getConversations({ vendedor_id: seller.id });
      if (data) setConversas(data);
      setLoading(false);
    }

    loadConversas();
  }, [seller?.id]);

  // ── Busca mensagens da conversa selecionada + polling ─────────────────────
  useEffect(() => {
    clearInterval(pollRef.current);
    if (!selectedConversa) return;

    async function loadMessages() {
      const { data } = await getMessages(selectedConversa.id);
      if (data) {
        setMessages(data);
        // Marca mensagens do cliente como lidas
        const naoLidas = data.filter(m => m.remetente_tipo === "cliente" && !m.lida);
        if (naoLidas.length) {
          await markMessagesRead(selectedConversa.id, "vendedor");
          setMessages(prev => prev.map(m =>
            m.remetente_tipo === "cliente" ? { ...m, lida: 1 } : m
          ));
          // Atualiza badge de não lidas na lista de conversas
          setConversas(prev => prev.map(c =>
            c.id === selectedConversa.id ? { ...c, nao_lidas: 0 } : c
          ));
        }
      }
    }

    loadMessages();
    pollRef.current = setInterval(loadMessages, 4000);
    return () => clearInterval(pollRef.current);
  }, [selectedConversa?.id]);

  // ── Scroll automático para o final ───────────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Envio de mensagem ─────────────────────────────────────────────────────
  const handleSend = useCallback(async () => {
    if (!inputText.trim() || !selectedConversa || sending) return;
    setSending(true);

    const optimistic = {
      id:             `tmp-${Date.now()}`,
      conversa_id:    selectedConversa.id,
      remetente_tipo: "vendedor",
      remetente_id:   seller.id,
      conteudo:       inputText.trim(),
      lida:           0,
      enviado_em:     new Date().toISOString(),
    };

    setMessages(prev => [...prev, optimistic]);
    setInputText("");

    const { data, error } = await sendMessage({
      conversa_id:    selectedConversa.id,
      remetente_tipo: "vendedor",
      remetente_id:   seller.id,
      conteudo:       inputText.trim(),
    });

    if (error) {
      setMessages(prev => prev.filter(m => m.id !== optimistic.id));
    } else {
      setMessages(prev => prev.map(m => m.id === optimistic.id ? data : m));
    }

    setSending(false);
  }, [inputText, selectedConversa, seller?.id, sending]);

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  // ── Conta não lidas por conversa ──────────────────────────────────────────
  const naoLidasPorConversa = conversas.reduce((acc, c) => {
    acc[c.id] = c.nao_lidas || 0;
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="messages-panel-empty">
        <p style={{ color: "var(--text-3)" }}>Carregando conversas…</p>
      </div>
    );
  }

  return (
    <div className="messages-panel">
      {/* ── Sidebar de conversas ── */}
      <aside className="messages-sidebar">
        <div className="messages-sidebar-header">
          <h2>Mensagens</h2>
          {conversas.length > 0 && (
            <span className="messages-count-badge">{conversas.length}</span>
          )}
        </div>

        {conversas.length === 0 ? (
          <div className="messages-panel-empty">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.5">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
            </svg>
            <p>Nenhuma conversa ainda</p>
            <span>As mensagens de clientes aparecerão aqui.</span>
          </div>
        ) : (
          <div className="messages-sidebar-list">
            {conversas.map(c => {
              const naoLidas = naoLidasPorConversa[c.id] || 0;
              const isSelected = selectedConversa?.id === c.id;
              return (
                <button
                  key={c.id}
                  className={`messages-contact ${isSelected ? "active" : ""}`}
                  onClick={() => setSelectedConversa(c)}
                >
                  <div className="messages-contact-avatar">
                    {String(c.cliente_id || "C")}
                  </div>
                  <div className="messages-contact-info">
                    <span className="messages-contact-name">
                      Cliente #{c.cliente_id}
                    </span>
                    <span className="messages-contact-sub">
                      Conversa #{c.id}
                    </span>
                  </div>
                  {naoLidas > 0 && (
                    <span className="messages-unread-badge">{naoLidas}</span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </aside>

      {/* ── Janela de chat ── */}
      <div className="messages-chat-window">
        {!selectedConversa ? (
          <div className="messages-chat-empty">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.5">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
            </svg>
            <p>Selecione uma conversa</p>
            <span>Escolha um cliente na lista ao lado para responder.</span>
          </div>
        ) : (
          <>
            <div className="messages-chat-header">
              <div className="messages-chat-header-avatar">
                {String(selectedConversa.cliente_id || "C")}
              </div>
              <div>
                <div className="messages-chat-header-name">
                  Cliente #{selectedConversa.cliente_id}
                </div>
                <div className="messages-chat-header-sub">Conversa #{selectedConversa.id}</div>
              </div>
            </div>

            <div className="messages-chat-body">
              {messages.length === 0 ? (
                <div style={{ textAlign: "center", color: "var(--text-3)", fontSize: 13, marginTop: 32 }}>
                  Sem mensagens ainda.
                </div>
              ) : (
                messages.map(m => (
                  <MessageBubble key={m.id} message={m} myTipo="vendedor" />
                ))
              )}
              <div ref={bottomRef} />
            </div>

            <div className="messages-chat-input-row">
              <input
                className="chat-input"
                type="text"
                placeholder="Digite sua resposta…"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={handleKey}
                disabled={sending}
              />
              <button
                className="chat-send-btn"
                onClick={handleSend}
                disabled={sending || !inputText.trim()}
              >
                {sending ? "…" : "Enviar"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
