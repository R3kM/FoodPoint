import "./SellerPage.css";
import ProductCard from "../common/ProductCard";
import StarRow from "../common/StarRow";
import { useProducts } from "../../hooks/useProducts";
import { BUSINESS_TYPES } from "../../data/businessTypes";
import { colorForType } from "../../utils/helpers";

export default function SellerPage({ seller, user, onAddToCart, showToast, onBack }) {
  if (!seller) return null;

  // Usa useProducts — em mock carrega de mockProducts.js, em produção chama a API
  const { products, loading } = useProducts(seller.id);
  // Mostra todos os produtos ativos (incluindo esgotados, para o cliente saber que existem)
  const activeProducts = products.filter(p => p.ativo);
  const sellerColor    = colorForType(seller.tipo_negocio);

  const handleAdd = (product) => {
    if (product.esgotado) { showToast?.("Produto esgotado."); return; }
    const result = onAddToCart(product, seller);
    if (result?.error) showToast?.(result.error);
  };

  // Horário de hoje
  const diasSemana = ["dom","seg","ter","qua","qui","sex","sab"];
  const hoje       = diasSemana[new Date().getDay()];
  const horarioHoje = seller.horario_funcionamento?.[hoje];

  return (
    <main className="seller-page">
      <button className="back-button" onClick={onBack} aria-label="Voltar à listagem">← Voltar</button>

      <section className="seller-banner">
        <div className="seller-banner-overlay" style={{ background: sellerColor }} />
      </section>

      <section className="seller-info-card">
        <div className="seller-header">
          <div>
            <h1 className="seller-name">{seller.nome_empresa}</h1>
            <div className="seller-meta">
              <StarRow stars={seller.estrelas ?? 0} count={seller.num_avaliacoes ?? 0} />
              {seller.tipo_negocio && (
                <span className="seller-category">{BUSINESS_TYPES[seller.tipo_negocio]}</span>
              )}
              {seller.verificado === 1 && <span className="verified-badge">✓ Verificado</span>}
              {seller.plano === "premium" && (
                <span style={{ fontSize: 11, fontWeight: 700, color: "#b45309", background: "#FEF3C7", padding: "2px 8px", borderRadius: "999px" }}>
                  Premium
                </span>
              )}
            </div>
          </div>
        </div>

        {seller.descricao_loja && (
          <p className="seller-description">{seller.descricao_loja}</p>
        )}

        <div className="seller-details">
          {seller.bairro && (
            <div className="seller-detail-item">
              <strong>📍 Local</strong>
              <span className="seller-detail-value">
                {seller.bairro}{seller.cidade ? `, ${seller.cidade}` : ""}{seller.uf ? ` — ${seller.uf}` : ""}
              </span>
            </div>
          )}
          {seller.tempo_medio_preparo != null && (
            <div className="seller-detail-item">
              <strong>⏱ Preparo</strong>
              <span className="seller-detail-value">{seller.tempo_medio_preparo} min</span>
            </div>
          )}
          {seller.total_vendas != null && (
            <div className="seller-detail-item">
              <strong>🛍 Vendas</strong>
              <span className="seller-detail-value">{seller.total_vendas.toLocaleString("pt-BR")}</span>
            </div>
          )}
          {horarioHoje && (
            <div className="seller-detail-item">
              <strong>🕐 Hoje</strong>
              <span className="seller-detail-value">{horarioHoje}</span>
            </div>
          )}
          {seller.chave_pix && (
            <div className="seller-detail-item">
              <strong>💸 PIX</strong>
              <span className="seller-detail-value">{seller.chave_pix}</span>
            </div>
          )}
        </div>

        {(seller.whatsapp_link || seller.instagram || seller.facebook) && (
          <div className="seller-actions">
            {seller.whatsapp_link && (
              <a href={seller.whatsapp_link} target="_blank" rel="noreferrer"
                className="seller-action-button" aria-label="Contato via WhatsApp">
                WhatsApp
              </a>
            )}
            {seller.instagram && (
              <a href={`https://instagram.com/${seller.instagram.replace("@", "")}`}
                target="_blank" rel="noreferrer"
                className="seller-action-button" aria-label="Ver Instagram">
                Instagram
              </a>
            )}
            {seller.facebook && (
              <a href={seller.facebook.startsWith("http") ? seller.facebook : `https://${seller.facebook}`}
                target="_blank" rel="noreferrer"
                className="seller-action-button" aria-label="Ver Facebook">
                Facebook
              </a>
            )}
          </div>
        )}
      </section>

      <section className="products-section">
        <div className="products-header">
          <h2>Cardápio</h2>
          <span className="products-count">
            {loading ? "…" : `${activeProducts.length} produto${activeProducts.length !== 1 ? "s" : ""}`}
          </span>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "48px 0", color: "var(--text-3)", fontSize: 14 }}>
            Carregando produtos…
          </div>
        ) : activeProducts.length > 0 ? (
          <div className="products-grid">
            {activeProducts.map(p => (
              <ProductCard key={p.id} product={p} onAdd={() => handleAdd(p)} />
            ))}
          </div>
        ) : (
          <div className="empty-products">
            <h3 style={{ fontFamily: "var(--font-display)", marginBottom: 8 }}>Nenhum produto disponível</h3>
            <p style={{ color: "var(--text-3)", fontSize: 14 }}>Este vendedor ainda não cadastrou produtos.</p>
          </div>
        )}
      </section>
    </main>
  );
}
