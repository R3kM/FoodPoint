import "./SellerPage.css";
import ProductCard from "../common/ProductCard";
import StarRow from "../common/StarRow";
import { useProducts } from "../../hooks/useProducts";
import { BUSINESS_TYPES } from "../../data/businessTypes";
import { colorForType } from "../../utils/helpers";

const DIAS_ORDEM  = ["seg","ter","qua","qui","sex","sab","dom"];
const DIA_LABEL   = { seg:"Seg",ter:"Ter",qua:"Qua",qui:"Qui",sex:"Sex",sab:"Sáb",dom:"Dom" };
const TIPO_PIX_LABEL = { cpf:"CPF",cnpj:"CNPJ",email:"E-mail",telefone:"Telefone",aleatoria:"Chave aleatória" };

function InfoBlock({ icon, label, children }) {
  return (
    <div className="seller-info-block">
      <div className="seller-info-block-label">
        <span className="seller-info-icon">{icon}</span>
        {label}
      </div>
      <div className="seller-info-block-value">{children}</div>
    </div>
  );
}

export default function SellerPage({ seller, user, onAddToCart, showToast, onBack }) {
  if (!seller) return null;

  const { products, loading } = useProducts(seller.id);
  const activeProducts = products.filter(p => p.ativo);
  const sellerColor    = colorForType(seller.tipo_negocio);

  const handleAdd = (product) => {
    if (product.esgotado) { showToast?.("Produto esgotado."); return; }
    const result = onAddToCart(product, seller);
    if (result?.error) showToast?.(result.error);
  };

  // Horário de hoje
  const diasSemana  = ["dom","seg","ter","qua","qui","sex","sab"];
  const hojeKey     = diasSemana[new Date().getDay()];
  const rawHorario = seller.horario_funcionamento;
  const horarios = typeof rawHorario === 'string'
    ? (() => { try { return JSON.parse(rawHorario); } catch { return {}; } })()
    : (rawHorario || {});
  const horarioHoje = horarios[hojeKey];

  // Verifica se tem algum horário preenchido
  const temHorario  = DIAS_ORDEM.some(d => horarios[d] && horarios[d] !== "fechado" && horarios[d].trim() !== "");

  return (
    <main className="seller-page">
      <button className="back-button" onClick={onBack} aria-label="Voltar à listagem">← Voltar</button>

      <section className="seller-banner">
        <div className="seller-banner-overlay" style={{ background: sellerColor }} />
      </section>

      <section className="seller-info-card">
        {/* ── Cabeçalho ── */}
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
                <span className="seller-badge-premium">⭐ Premium</span>
              )}
            </div>
          </div>
        </div>

        {/* ── Descrição ── */}
        {seller.descricao_loja && (
          <p className="seller-description">{seller.descricao_loja}</p>
        )}

        {/* ── Grade de detalhes ── */}
        <div className="seller-details-grid">

          {/* Localização */}
          {(seller.bairro || seller.cidade) && (
            <InfoBlock label="Localização">
              {[seller.logradouro && `${seller.logradouro}${seller.numero ? ", " + seller.numero : ""}`,
                seller.bairro,
                [seller.cidade, seller.uf].filter(Boolean).join(" — "),
                seller.cep && `CEP ${seller.cep}`
              ].filter(Boolean).map((linha, i) => (
                <span key={i} style={{ display: "block" }}>{linha}</span>
              ))}
            </InfoBlock>
          )}

          {/* Contato */}
          {(seller.telefone || seller.email) && (
            <InfoBlock label="Contato">
              {seller.telefone && <span style={{ display: "block" }}>{seller.telefone}</span>}
              {seller.email    && <span style={{ display: "block", fontSize: 13, color: "var(--text-3)" }}>{seller.email}</span>}
            </InfoBlock>
          )}

          {/* Responsável */}
          {seller.nome_responsavel && (
            <InfoBlock label="Responsável">
              {seller.nome_responsavel}
            </InfoBlock>
          )}

          {/* Tempo de preparo */}
          {seller.tempo_medio_preparo != null && seller.tempo_medio_preparo > 0 && (
            <InfoBlock label="Tempo de preparo">
              ~{seller.tempo_medio_preparo} minutos
            </InfoBlock>
          )}

          {/* Vendas totais */}
          {seller.total_vendas != null && seller.total_vendas > 0 && (
            <InfoBlock label="Vendas realizadas">
              {seller.total_vendas.toLocaleString("pt-BR")} pedidos
            </InfoBlock>
          )}

          {/* PIX */}
          {seller.chave_pix && (
            <InfoBlock label="Chave PIX">
              <span style={{ fontSize: 12, color: "var(--text-3)", display: "block" }}>
                {TIPO_PIX_LABEL[seller.tipo_chave_pix] || "PIX"}
              </span>
              <span style={{ wordBreak: "break-all" }}>{seller.chave_pix}</span>
            </InfoBlock>
          )}

          {/* Hoje */}
          {horarioHoje && (
            <InfoBlock label={`Hoje (${DIA_LABEL[hojeKey]})`}>
              {horarioHoje === "fechado" ? (
                <span style={{ color: "var(--danger)" }}>Fechado</span>
              ) : (
                <span style={{ color: "var(--success)" }}>{horarioHoje}</span>
              )}
            </InfoBlock>
          )}
        </div>

        {/* ── Horário de funcionamento completo ── */}
        {temHorario && (
          <div className="seller-schedule">
            <h3 className="seller-section-title">Horário de funcionamento</h3>
            <div className="seller-schedule-grid">
              {DIAS_ORDEM.map(dia => {
                const horario  = horarios[dia];
                const isHoje   = dia === hojeKey;
                const fechado  = !horario || horario.toLowerCase() === "fechado" || horario.trim() === "";
                return (
                  <div key={dia} className={`seller-schedule-row ${isHoje ? "today" : ""}`}>
                    <span className="seller-schedule-day">{DIA_LABEL[dia]}</span>
                    <span className={`seller-schedule-time ${fechado ? "closed" : "open"}`}>
                      {fechado ? "Fechado" : horario}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Redes sociais / contato rápido ── */}
        {(seller.whatsapp_link || seller.instagram || seller.facebook) && (
          <div className="seller-actions">
            {seller.whatsapp_link && (
              <a href={seller.whatsapp_link} target="_blank" rel="noreferrer"
                className="seller-action-button seller-action-whatsapp">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
              </a>
            )}
            {seller.instagram && (
              <a href={`https://instagram.com/${seller.instagram.replace("@", "")}`}
                target="_blank" rel="noreferrer" className="seller-action-button seller-action-instagram">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
                Instagram
              </a>
            )}
            {seller.facebook && (
              <a href={seller.facebook.startsWith("http") ? seller.facebook : `https://${seller.facebook}`}
                target="_blank" rel="noreferrer" className="seller-action-button">
                Facebook
              </a>
            )}
          </div>
        )}
      </section>

      {/* ── Cardápio ── */}
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
