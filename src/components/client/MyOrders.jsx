import "./MyOrders.css";
import { formatCurrency } from "../../utils/formatters";

const STATUS_LABEL = {
  pendente:       { label: "Pendente",           color: "#C98300", bg: "#FFF8E6" },
  confirmado:     { label: "Confirmado",          color: "#1A7A4A", bg: "#E8F5EE" },
  em_preparo:     { label: "Em preparo",          color: "#6366f1", bg: "#EEF2FF" },
  pronto_retirada:{ label: "Pronto p/ retirada",  color: "#0891b2", bg: "#E0F7FA" },
  entregue:       { label: "Retirado",            color: "#1A7A4A", bg: "#E8F5EE" },
  cancelado:      { label: "Cancelado",           color: "#C9291A", bg: "#FDECEA" },
};

export default function MyOrders({ orders, onBack }) {
  return (
    <main className="my-orders-page">
      <button className="back-button" onClick={onBack}>← Voltar</button>

      <div className="my-orders-inner">
        <div className="my-orders-header">
          <h1>Meus Pedidos</h1>
          <p>Acompanhe o andamento dos seus pedidos.</p>
        </div>

        {orders.length === 0 ? (
          <div className="orders-empty">
            <div className="orders-empty-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
            </div>
            <h3>Nenhum pedido ainda</h3>
            <p>Seus pedidos aparecerão aqui após a compra.</p>
          </div>
        ) : (
          <div className="orders-list">
            {[...orders].reverse().map(order => {
              const st = STATUS_LABEL[order.status] || STATUS_LABEL.pendente;
              return (
                <div className="order-card-client" key={order.id}>
                  <div className="order-card-head">
                    <div>
                      <span className="order-card-id">Pedido #{String(order.id).slice(-6)}</span>
                      <span className="order-card-vendor">{order.vendedor}</span>
                    </div>
                    <span className="order-status-pill" style={{ color: st.color, background: st.bg }}>
                      {st.label}
                    </span>
                  </div>

                  <div className="order-card-items">
                    {order.items?.map((item, i) => (
                      <div key={i} className="order-item-row">
                        <span>{item.quantidade || item.qty}x {item.nome}</span>
                        <span>{formatCurrency((item.preco_unitario || item.preco) * (item.quantidade || item.qty))}</span>
                      </div>
                    ))}
                  </div>

                  <div className="order-card-foot">
                    <span className="order-card-date">{order.criado_em}</span>
                    <span className="order-card-total">{formatCurrency(order.total)}</span>
                  </div>

                  {/* Progress bar */}
                  <div className="order-progress">
                    {["pendente","confirmado","em_preparo","pronto_retirada","entregue"].map((s, i, arr) => {
                      const currentIdx = arr.indexOf(order.status);
                      const done = i <= currentIdx && order.status !== "cancelado";
                      return (
                        <div key={s} className="order-progress-step">
                          <div className={`order-progress-dot ${done ? "done" : ""}`} />
                          {i < arr.length - 1 && (
                            <div className={`order-progress-line ${i < currentIdx ? "done" : ""}`} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div className="order-progress-labels">
                    {["Pendente","Confirmado","Preparo","Pronto","Retirado"].map(l => (
                      <span key={l}>{l}</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
