import { useState } from "react";
import ProductForm from "./ProductForm";
import { formatCurrency } from "../../utils/formatters";

// Calcula status de estoque igual à view vw_estoque do banco
function getEstoqueStatus(p) {
  if (p.esgotado) return "esgotado";
  const restante = p.quantidade_inicial - p.quantidade_vendida;
  if (p.alerta_estoque_baixo > 0 && restante <= p.alerta_estoque_baixo) return "baixo";
  return "ok";
}

const ESTOQUE_BADGE = {
  ok:       { label: "Em estoque",   color: "#1A7A4A", bg: "#E8F5EE" },
  baixo:    { label: "Estoque baixo", color: "#C98300", bg: "#FFF8E6" },
  esgotado: { label: "Esgotado",     color: "#C9291A", bg: "#FDECEA" },
};

export default function ProductManager({ products, onAddProduct, onRemoveProduct, onEditProduct }) {
  const [showForm,       setShowForm]       = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [filter,         setFilter]         = useState("todos");

  const openNew   = () => { setEditingProduct(null); setShowForm(true); };
  const openEdit  = (p) => { setEditingProduct(p);   setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditingProduct(null); };

  const filtered = products.filter(p => {
    if (filter === "todos")    return true;
    if (filter === "ativo")    return p.ativo && !p.esgotado;
    if (filter === "esgotado") return p.esgotado;
    if (filter === "baixo") {
      const r = p.quantidade_inicial - p.quantidade_vendida;
      return !p.esgotado && p.alerta_estoque_baixo > 0 && r <= p.alerta_estoque_baixo;
    }
    return true;
  });

  return (
    <div>
      <div className="dashboard-page-header">
        <h1 className="dashboard-page-title">Produtos</h1>
        <p className="dashboard-page-sub">Gerencie seu catálogo e acompanhe o estoque.</p>
      </div>

      <div className="dashboard-card">
        <div className="dashboard-card-header">
          <h2 className="dashboard-card-title">Catálogo</h2>
          {!showForm && (
            <button className="btn-primary" onClick={openNew} aria-label="Adicionar novo produto">
              + Novo produto
            </button>
          )}
        </div>

        {/* Filtro de estoque */}
        {!showForm && products.length > 0 && (
          <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
            {[
              { key: "todos",    label: "Todos" },
              { key: "ativo",    label: "Disponíveis" },
              { key: "baixo",    label: "⚠ Estoque baixo" },
              { key: "esgotado", label: "Esgotados" },
            ].map(f => (
              <button key={f.key}
                onClick={() => setFilter(f.key)}
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
        )}

        {showForm && (
          <ProductForm
            editingProduct={editingProduct}
            onAddProduct={onAddProduct}
            onEditProduct={onEditProduct}
            onClose={closeForm}
          />
        )}

        {products.length === 0 && !showForm ? (
          <div style={{ textAlign: "center", padding: "48px 0", color: "var(--text-3)" }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
              style={{ margin: "0 auto 12px", display: "block", color: "var(--border)" }}>
              <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
            </svg>
            <p style={{ fontSize: 15, fontWeight: 600, color: "var(--text-2)", marginBottom: 4 }}>
              Nenhum produto cadastrado
            </p>
            <p style={{ fontSize: 13 }}>Comece adicionando seu primeiro produto.</p>
          </div>
        ) : !showForm && (
          <div className="dashboard-product-list">
            {filtered.length === 0 && (
              <p style={{ fontSize: 14, color: "var(--text-3)", padding: "24px 0", textAlign: "center" }}>
                Nenhum produto nesta categoria.
              </p>
            )}
            {filtered.map(p => {
              const status  = getEstoqueStatus(p);
              const badge   = ESTOQUE_BADGE[status];
              const restante = p.quantidade_inicial - p.quantidade_vendida;

              return (
                <div className="dashboard-product-row" key={p.id}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, flex: 1, minWidth: 0 }}>
                    {p.imagem_url ? (
                      <img src={p.imagem_url} alt={p.nome}
                        style={{ width: 48, height: 48, objectFit: "cover", borderRadius: "var(--r-sm)", flexShrink: 0 }} />
                    ) : (
                      <div style={{
                        width: 48, height: 48, background: "var(--surface-2)",
                        borderRadius: "var(--r-sm)", flexShrink: 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                          style={{ color: "var(--border)" }}>
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                          <circle cx="8.5" cy="8.5" r="1.5"/>
                          <polyline points="21 15 16 10 5 21"/>
                        </svg>
                      </div>
                    )}
                    <div className="dashboard-product-info" style={{ minWidth: 0 }}>
                      <h3 style={{ marginBottom: 2 }}>{p.nome}</h3>
                      <span className="dashboard-product-price">{formatCurrency(p.preco)}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4, flexWrap: "wrap" }}>
                        <span style={{
                          fontSize: 11, fontWeight: 700, padding: "2px 8px",
                          borderRadius: "999px", color: badge.color, background: badge.bg,
                        }}>
                          {badge.label}
                        </span>
                        {status !== "esgotado" && (
                          <span style={{ fontSize: 11, color: "var(--text-3)" }}>
                            {restante} restante{restante !== 1 ? "s" : ""}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="dashboard-product-actions">
                    <button className="btn-secondary" onClick={() => openEdit(p)}
                      aria-label={`Editar ${p.nome}`}>
                      Editar
                    </button>
                    <button className="btn-danger" onClick={() => onRemoveProduct(p.id)}
                      aria-label={`Remover ${p.nome}`}>
                      Remover
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
