import { useState, useEffect } from "react";
import "./SellerDashboard.css";
import ProductManager from "./ProductManager";
import OrdersPanel    from "./OrdersPanel";
import MessagesPanel  from "./MessagesPanel";
import { formatCurrency } from "../../utils/formatters";
import { getConversations, getMessages } from "../../services/api";

const NAV = [
  { key: "overview",  label: "Visão geral" },
  { key: "products",  label: "Produtos" },
  { key: "orders",    label: "Pedidos" },
  { key: "messages",  label: "Mensagens" },
];

export default function SellerDashboard({
  seller, products, orders, messages: messagesProp,
  onAddProduct, onRemoveProduct, onEditProduct,
  onUpdateProfile, onDeleteAccount, onUpdateOrderStatus,
}) {
  const [tab, setTab]       = useState("overview");
  const [messages, setMessages] = useState(messagesProp || []);
  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);

  // Busca mensagens do backend quando não estiver em modo mock
  useEffect(() => {
    if (!seller?.id || import.meta.env.VITE_USE_MOCK !== "false") return;
    (async () => {
      const { data: convs } = await getConversations({ vendedor_id: seller.id });
      if (!convs?.length) return;
      const allMsgs = await Promise.all(
        convs.map(c => getMessages(c.id).then(r => r.data || []))
      );
      setMessages(allMsgs.flat());
    })();
  }, [seller?.id]);

  return (
    <div className="seller-dashboard">
      <aside className="dashboard-sidebar">
        <div className="dashboard-sidebar-header">
          <div className="dashboard-seller-avatar">
            {seller?.nome_empresa?.[0]?.toUpperCase() || "V"}
          </div>
          <div className="dashboard-seller-name">{seller?.nome_empresa || "Minha Loja"}</div>
          <div className="dashboard-seller-plan">Plano {seller?.plano || "gratuito"}</div>
        </div>

        <nav className="dashboard-nav">
          {NAV.map(n => (
            <button
              key={n.key}
              className={`dashboard-nav-btn ${tab === n.key ? "active" : ""}`}
              onClick={() => setTab(n.key)}
            >
              {n.label}
              {n.key === "orders" && orders.length > 0 && (
                <span style={{ marginLeft:"auto", background:"var(--primary)", color:"white", fontSize:11, fontWeight:700, padding:"2px 7px", borderRadius:"999px" }}>
                  {orders.length}
                </span>
              )}
            </button>
          ))}
        </nav>
      </aside>

      <main className="dashboard-main">
        {tab === "overview" && (
          <>
            <div className="dashboard-page-header">
              <h1 className="dashboard-page-title">
                Olá, {seller?.nome_empresa?.split(" ")[0]}
              </h1>
              <p className="dashboard-page-sub">Aqui está um resumo do seu negócio.</p>
            </div>

            <div className="dashboard-stats">
              <div className="dashboard-stat-card">
                <div className="dashboard-stat-label">Produtos</div>
                <div className="dashboard-stat-value">{products.length}</div>
              </div>
              <div className="dashboard-stat-card">
                <div className="dashboard-stat-label">Pedidos</div>
                <div className="dashboard-stat-value">{orders.length}</div>
              </div>
              <div className="dashboard-stat-card">
                <div className="dashboard-stat-label">Receita total</div>
                <div className="dashboard-stat-value primary">{formatCurrency(totalRevenue)}</div>
              </div>
              <div className="dashboard-stat-card">
                <div className="dashboard-stat-label">Mensagens</div>
                <div className="dashboard-stat-value">{messages.length}</div>
              </div>
            </div>

            <div className="dashboard-card">
              <div className="dashboard-card-header">
                <h2 className="dashboard-card-title">Ações rápidas</h2>
              </div>
              <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
                <button className="btn-primary" onClick={() => setTab("products")}>Novo produto</button>
                <button className="btn-secondary" onClick={() => setTab("orders")}>Ver pedidos</button>
              </div>
            </div>
          </>
        )}

        {tab === "products" && (
          <ProductManager
            products={products}
            onAddProduct={onAddProduct}
            onRemoveProduct={onRemoveProduct}
            onEditProduct={onEditProduct}
          />
        )}

        {tab === "orders" && (
          <OrdersPanel orders={orders} onUpdateOrderStatus={onUpdateOrderStatus} />
        )}

        {tab === "messages" && <MessagesPanel messages={messages} />}
      </main>
    </div>
  );
}
