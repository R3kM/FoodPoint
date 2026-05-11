import "./CartSidebar.css";

import { formatCurrency } from "../../utils/formatters";

export default function CartSidebar({
  items,
  onClose,
  onQty,
  onCheckout,
}) {
  const subtotal = items.reduce(
    (acc, item) =>
      acc + item.preco * item.qty,
    0
  );

  const totalItems = items.reduce(
    (acc, item) => acc + item.qty,
    0
  );

  return (
    <div className="cart-overlay">
      <aside className="cart-sidebar">
        <div className="cart-header">
          <div>
            <h2>Carrinho</h2>

            <span>
              {totalItems}{" "}
              {totalItems === 1
                ? "item"
                : "itens"}
            </span>
          </div>

          <button
            className="close-button"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        {items.length > 0 ? (
          <>
            <div className="cart-items">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="cart-item"
                >
                  <div className="cart-item-info">
                    <h3>{item.nome}</h3>

                    <span className="cart-item-seller">
                      {item.vendedor.nome_empresa}
                    </span>

                    <p>
                      {formatCurrency(
                        item.preco
                      )}
                    </p>
                  </div>

                  <div className="cart-item-actions">
                    <button
                      onClick={() =>
                        onQty(item.id, -1)
                      }
                    >
                      -
                    </button>

                    <span>{item.qty}</span>

                    <button
                      onClick={() =>
                        onQty(item.id, 1)
                      }
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-footer">
              <div className="cart-total">
                <span>Total</span>

                <strong>
                  {formatCurrency(subtotal)}
                </strong>
              </div>

              <button
                className="checkout-button"
                onClick={onCheckout}
              >
                Finalizar pedido
              </button>
            </div>
          </>
        ) : (
          <div className="empty-cart">
            <h3>
              Seu carrinho está vazio
            </h3>

            <p>
              Adicione produtos para
              continuar.
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}