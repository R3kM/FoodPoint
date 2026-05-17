import { useState } from "react";
import { formatCurrency } from "../../utils/formatters";

const STATUSES = [
  { key: "pendente",        label: "Pendente" },
  { key: "confirmado",      label: "Confirmado" },
  { key: "em_preparo",      label: "Em preparo" },
  { key: "pronto_retirada", label: "Pronto p/ retirada" },
  { key: "entregue",        label: "Retirado" },
  { key: "cancelado",       label: "Cancelado" },
];

const STATUS_STYLE = {
  pendente:        { color: "#C98300", bg: "#FFF8E6" },
  confirmado:      { color: "#1A7A4A", bg: "#E8F5EE" },
  em_preparo:      { color: "#6366f1", bg: "#EEF2FF" },
  pronto_retirada: { color: "#0891b2", bg: "#E0F7FA" },
  entregue:        { color: "#1A7A4A", bg: "#E8F5EE" },
  cancelado:       { color: "#C9291A", bg: "#FDECEA" },
};

const FILTER_OPTIONS = [
  { key: "todos",           label: "Todos" },
  { key: "pendente",        label: "Pendentes" },
  { key: "em_preparo",      label: "Em preparo" },
  { key: "pronto_retirada", label: "Prontos" },
  { key: "entregue",        label: "Retirados" },
  { key: "cancelado",       label: "Cancelados" },
];

const PAGE_SIZE = 10;

export default function OrdersPanel({ orders, onUpdateOrderStatus }) {
  const [filter,   setFilter]   = useState("todos");
  const [page,     setPage]     = useState(1);

  const filtered = [...orders]
    .reverse()
    .filter(o => filter === "todos" || o.status === filter);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleFilter = (key) => { setFilter(key); setPage(1); };

  return (
    <div>
      <div className="dashboard-page-header">
        <h1 className="dashboard-page-title">Pedidos</h1>
        <p className="dashboard-page-sub">Gerencie e atualize o status dos pedidos recebidos.</p>
      </div>

      <div className="dashboard-card">
        <div className="dashboard-card-header">
          <h2 className="dashboard-card-title">Pedidos</h2>
          <span style={{ fontSize: 13, color: "var(--text-3)", background: "var(--surface-2)", padding: "4px 10px", borderRadius: "999px" }}>
            {filtered.length} pedido{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Filtro por status */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
          {FILTER_OPTIONS.map(f => (
            <button key={f.key} onClick={() => handleFilter(f.key)}
              style={{
                padding: "5px 14px", borderRadius: "999px", fontSize: 13, fontWeight: 600,
                border: "1.5px solid",
                borderColor: filter === f.key ? "var(--primary)" : "var(--border)",
                background:  filter === f.key ? "var(--primary)" : "var(--surface)",
                color:       filter === f.key ? "#fff" : "var(--text-2)",
                cursor: "pointer",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {paginated.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px 0", color: "var(--text-3)" }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
              style={{ margin: "0 auto 12px", display: "block", color: "var(--border)" }}>
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            <p style={{ fontSize: 15, fontWeight: 600, color: "var(--text-2)", marginBottom: 4 }}>
              Nenhum pedido {filter !== "todos" ? `com status "${FILTER_OPTIONS.find(f => f.key === filter)?.label}"` : "ainda"}
            </p>
            {filter !== "todos" && (
              <button onClick={() => handleFilter("todos")}
                style={{ fontSize: 13, color: "var(--primary)", background: "none", border: "none", cursor: "pointer", marginTop: 8 }}>
                Ver todos os pedidos
              </button>
            )}
          </div>
        ) : (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {paginated.map(order => {
                const st = STATUS_STYLE[order.status] || STATUS_STYLE.pendente;
                return (
                  <div key={order.id} style={{
                    border: "1.5px solid var(--border-soft)",
                    borderRadius: "var(--r-md)", padding: "16px 18px",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                      <div>
                        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--text)", marginBottom: 3 }}>
                          Pedido #{String(order.id).slice(-6)}
                        </div>
                        <div style={{ fontSize: 13, color: "var(--text-3)" }}>{order.customer}</div>
                        {order.horario_retirada && (
                          <div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 2 }}>
                            🕐 Retirada: {new Date(order.horario_retirada).toLocaleString("pt-BR")}
                          </div>
                        )}
                        {order.criado_em && (
                          <div style={{ fontSize: 12, color: "var(--text-3)" }}>
                            Realizado: {order.criado_em}
                          </div>
                        )}
                      </div>
                      <span style={{
                        fontSize: 12, fontWeight: 700, padding: "5px 12px",
                        borderRadius: "999px", color: st.color, background: st.bg,
                        whiteSpace: "nowrap",
                      }}>
                        {STATUSES.find(s => s.key === order.status)?.label || order.status}
                      </span>
                    </div>

                    {order.items && (
                      <div style={{ fontSize: 13, color: "var(--text-2)", marginBottom: 12, paddingBottom: 10, borderBottom: "1px solid var(--border-soft)" }}>
                        {order.items.map((item, i) => (
                          <div key={i} style={{ display: "flex", justifyContent: "space-between" }}>
                            <span>{item.quantidade || item.qty}x {item.nome}</span>
                            <span>{formatCurrency((item.preco_unitario || item.preco) * (item.quantidade || item.qty))}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {order.observacoes && (
                      <div style={{ fontSize: 12, color: "var(--text-3)", marginBottom: 10, fontStyle: "italic" }}>
                        💬 {order.observacoes}
                      </div>
                    )}

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                      <span style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 800, color: "var(--primary)" }}>
                        {formatCurrency(order.total)}
                      </span>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <label htmlFor={`status-${order.id}`} style={{ fontSize: 12, color: "var(--text-3)" }}>
                          Mudar status:
                        </label>
                        <select id={`status-${order.id}`}
                          value={order.status}
                          onChange={e => onUpdateOrderStatus(order.id, e.target.value)}
                          aria-label={`Alterar status do pedido #${String(order.id).slice(-6)}`}
                          style={{
                            border: "1.5px solid var(--border)", borderRadius: "var(--r-sm)",
                            padding: "7px 10px", fontSize: 13, color: "var(--text)",
                            background: "var(--surface)", cursor: "pointer",
                          }}
                        >
                          {STATUSES.map(s => (
                            <option key={s.key} value={s.key}>{s.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Paginação */}
            {totalPages > 1 && (
              <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 20 }}>
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  aria-label="Página anterior"
                  style={{ padding: "6px 14px", borderRadius: "var(--r-sm)", border: "1.5px solid var(--border)", background: "var(--surface)", cursor: page === 1 ? "not-allowed" : "pointer", opacity: page === 1 ? 0.4 : 1 }}>
                  ← Anterior
                </button>
                <span style={{ padding: "6px 14px", fontSize: 13, color: "var(--text-2)" }}>
                  {page} / {totalPages}
                </span>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  aria-label="Próxima página"
                  style={{ padding: "6px 14px", borderRadius: "var(--r-sm)", border: "1.5px solid var(--border)", background: "var(--surface)", cursor: page === totalPages ? "not-allowed" : "pointer", opacity: page === totalPages ? 0.4 : 1 }}>
                  Próxima →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
