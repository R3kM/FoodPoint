import "./SellerPage.css";

import ProductCard from "../common/ProductCard";
import StarRow from "../common/StarRow";

import { MOCK_PRODUCTS } from "../../data/mockProducts";
import { BUSINESS_TYPES } from "../../data/businessTypes";

import { colorForType } from "../../utils/helpers";

export default function SellerPage({
  seller,
  user,
  onAddToCart,
  showToast,
  onBack,
}) {
  const products = MOCK_PRODUCTS.filter(
    (product) =>
      product.vendedor_id === seller.id &&
      product.ativo
  );

  const sellerColor = colorForType(
    seller.tipo_negocio
  );

  const handleAddProduct = (product) => {
    if (!user) {
      showToast(
        "Faça login para adicionar produtos ao carrinho."
      );
      return;
    }

    onAddToCart(product, seller);

    showToast(
      `${product.nome} adicionado ao carrinho.`
    );
  };

  return (
    <main className="seller-page">
      <button
        className="back-button"
        onClick={onBack}
      >
        Voltar
      </button>

      <section className="seller-banner">
        <div
          className="seller-banner-overlay"
          style={{
            background: sellerColor,
          }}
        />
      </section>

      <section className="seller-info-card">
        <div className="seller-header">
          <div>
            <h1 className="seller-name">
              {seller.nome_empresa}
            </h1>

            <div className="seller-meta">
              <StarRow
                stars={seller.estrelas}
                count={seller.num_avaliacoes}
              />

              <span className="seller-category">
                {
                  BUSINESS_TYPES[
                    seller.tipo_negocio
                  ]
                }
              </span>

              {seller.verificado && (
                <span className="verified-badge">
                  Verificado
                </span>
              )}
            </div>
          </div>
        </div>

        {seller.descricao_loja && (
          <p className="seller-description">
            {seller.descricao_loja}
          </p>
        )}

        <div className="seller-details">
          <div className="seller-detail-item">
            <strong>Bairro:</strong>{" "}
            {seller.bairro}
          </div>

          <div className="seller-detail-item">
            <strong>Cidade:</strong>{" "}
            {seller.cidade} - {seller.uf}
          </div>

          <div className="seller-detail-item">
            <strong>Tempo médio:</strong>{" "}
            {seller.tempo_medio_preparo} min
          </div>

          <div className="seller-detail-item">
            <strong>Vendas:</strong>{" "}
            {seller.total_vendas}
          </div>
        </div>

        <div className="seller-actions">
          {seller.whatsapp_link && (
            <a
              href={seller.whatsapp_link}
              target="_blank"
              rel="noreferrer"
              className="seller-action-button"
            >
              WhatsApp
            </a>
          )}

          {seller.instagram && (
            <a
              href={`https://instagram.com/${seller.instagram.replace(
                "@",
                ""
              )}`}
              target="_blank"
              rel="noreferrer"
              className="seller-action-button"
            >
              Instagram
            </a>
          )}
        </div>
      </section>

      <section className="products-section">
        <div className="products-header">
          <h2>Cardápio</h2>

          <span>
            {products.length} produtos
          </span>
        </div>

        {products.length > 0 ? (
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                seller={seller}
                onAdd={() =>
                  handleAddProduct(product)
                }
              />
            ))}
          </div>
        ) : (
          <div className="empty-products">
            <h3>
              Nenhum produto disponível
            </h3>

            <p>
              Este vendedor ainda não
              cadastrou produtos.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}