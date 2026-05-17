// MessagesPanel — exibe conversas no formato da tabela `mensagens` do banco
export default function MessagesPanel({ messages }) {
  return (
    <div>
      <div className="dashboard-page-header">
        <h1 className="dashboard-page-title">Mensagens</h1>
        <p className="dashboard-page-sub">Comunicação com seus clientes.</p>
      </div>

      <div className="dashboard-card">
        {messages.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px 0", color: "var(--text-3)" }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
              style={{ margin: "0 auto 12px", display: "block", color: "var(--border)" }}>
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
            </svg>
            <p style={{ fontSize: 15, fontWeight: 600, color: "var(--text-2)", marginBottom: 4 }}>
              Nenhuma mensagem ainda
            </p>
            <p style={{ fontSize: 13 }}>As mensagens de clientes aparecerão aqui.</p>
          </div>
        ) : (
          messages.map((m) => {
            // Suporta tanto o formato antigo (sender/text) quanto o novo do banco (remetente_tipo/conteudo)
            const isCliente  = (m.remetente_tipo === "cliente") || (m.sender === "user");
            const conteudo   = m.conteudo || m.text || "";
            const timestamp  = m.enviado_em
              ? new Date(m.enviado_em).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })
              : (m.time || "");

            return (
              <div key={m.id} style={{ padding: "14px 0", borderBottom: "1px solid var(--border-soft)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontWeight: 600, fontSize: 13, color: isCliente ? "var(--primary)" : "var(--text-2)" }}>
                    {isCliente ? "Cliente" : "Você"}
                  </span>
                  {!m.lida && isCliente && (
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#fff", background: "var(--primary)", padding: "2px 7px", borderRadius: "999px" }}>
                      Nova
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 14, color: "var(--text)" }}>{conteudo}</div>
                <div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 4 }}>{timestamp}</div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
