import { useMemo, useState } from "react";

import "./PaymentPage.css";

import { formatCurrency } from "../../utils/formatters";

export default function PaymentPage({
  cart,
  onBack,
  onSuccess,
}) {
  const [paymentMethod, setPaymentMethod] =
    useState("pix");

  const [customerName, setCustomerName] =
    useState("");

  const [customerPhone, setCustomerPhone] =
    useState("");

  const [notes, setNotes] = useState("");

  const subtotal = useMemo(() => {
    return cart.reduce(
      (acc, item) =>
        acc + item.preco * item.qty,
      0
    );
  }, [cart]);

  const totalItems = useMemo(() => {
    return cart.reduce(
      (acc, item) => acc + item.qty,
      0
    );
  }, [cart]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!customerName.trim()) {
      alert("Informe seu nome.");
      return;
    }

    if (!customerPhone.trim()) {
      alert("Informe seu telefone.");
      return;
    }

    onSuccess();
  };

  return (
    <main className="payment-page">
      <button
        className="back-button"
        onClick={onBack}
      >
        Voltar
      </button>

      <div className="payment-container">
        <section className="payment-form-section">
          <div className="section-card">
            <h1>Finalizar pedido</h1>

            <p className="section-description">
              Revise os dados antes de
              confirmar sua compra.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nome completo</label>

                <input
                  type="text"
                  placeholder="Digite seu nome"
                  value={customerName}
                  onChange={(e) =>
                    setCustomerName(
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="form-group">
                <label>Telefone</label>

                <input
                  type="text"
                  placeholder="(00) 00000-0000"
                  value={customerPhone}
                  onChange={(e) =>
                    setCustomerPhone(
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="form-group">
                <label>
                  Observações do pedido
                </label>

                <textarea
                  rows="4"
                  placeholder="Ex: retirar sem cebola"
                  value={notes}
                  onChange={(e) =>
                    setNotes(e.target.value)
                  }
                />
              </div>

              <div className="form-group">
                <label>
                  Forma de pagamento
                </label>

                <div className="payment-options">
                  <button
                    type="button"
                    className={`payment-option ${
                      paymentMethod === "pix"
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      setPaymentMethod("pix")
                    }
                  >
                    PIX
                  </button>

                  <button
                    type="button"
                    className={`payment-option ${
                      paymentMethod ===
                      "dinheiro"
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      setPaymentMethod(
                        "dinheiro"
                      )
                    }
                  >
                    Dinheiro
                  </button>

                  <button
                    type="button"
                    className={`payment-option ${
                      paymentMethod ===
                      "cartao"
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      setPaymentMethod(
                        "cartao"
                      )
                    }
                  >
                    Cartão
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="confirm-button"
              >
                Confirmar pedido
              </button>
            </form>
          </div>
        </section>

        <aside className="summary-section">
          <div className="section-card">
            <h2>Resumo do pedido</h2>

            <div className="summary-items">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="summary-item"
                >
                  <div>
                    <h3>{item.nome}</h3>

                    <span>
                      {item.qty}x unidade
                    </span>
                  </div>

                  <strong>
                    {formatCurrency(
                      item.preco * item.qty
                    )}
                  </strong>
                </div>
              ))}
            </div>

            <div className="summary-divider" />

            <div className="summary-row">
              <span>Itens</span>

              <strong>{totalItems}</strong>
            </div>

            <div className="summary-row total">
              <span>Total</span>

              <strong>
                {formatCurrency(subtotal)}
              </strong>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}