import "./Common.css";

import { formatCurrency } from "../../utils/formatters";

export default function ProductCard({
  product,
  onAdd,
}) {
  return (
    <div className="product-card">
      <div className="product-image-placeholder">
        Produto
      </div>

      <div className="product-content">
        <h3>{product.nome}</h3>

        <p className="product-description">
          {product.descricao}
        </p>

        <div className="product-footer">
          <strong>
            {formatCurrency(product.preco)}
          </strong>

          <button
            className="add-button"
            onClick={onAdd}
          >
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
}