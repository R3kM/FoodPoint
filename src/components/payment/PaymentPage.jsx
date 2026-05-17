import { useMemo, useState } from "react";
import "./PaymentPage.css";
import { formatCurrency } from "../../utils/formatters";
import FieldError from "../common/FieldError";
import { validatePayment, hasErrors } from "../../utils/validate";

const METHODS = [
  { key: "pix",             label: "PIX" },
  { key: "dinheiro",        label: "Dinheiro" },
  { key: "cartao_credito",  label: "Crédito" },
  { key: "cartao_debito",   label: "Débito" },
];

export default function PaymentPage({ cart, user, onBack, onSuccess }) {
  const [paymentMethod, setPaymentMethod] = useState("pix");
  const [notes,         setNotes]         = useState("");
  const [horarioRetirada, setHorarioRetirada] = useState("");
  const [form,          setForm]          = useState({
    nome:     user?.nome     || "",
    telefone: user?.telefone || "",
  });
  const [errors, setErrors] = useState({});

  const setF = (k, v) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: "" })); };

  const subtotal   = useMemo(() => cart.reduce((a, i) => a + i.preco * i.qty, 0), [cart]);
  const totalItems = useMemo(() => cart.reduce((a, i) => a + i.qty, 0), [cart]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validatePayment(form);
    if (hasErrors(errs)) { setErrors(errs); return; }
    onSuccess({ tipo_entrega: "retirada", metodo_pagamento: paymentMethod, horario_retirada: horarioRetirada, ...form, notes });
  };

  return (
    <main className="payment-page">
      <button className="back-button" onClick={onBack}>← Voltar</button>

      <div className="payment-container">
        <section className="section-card">
          <h1>Finalizar pedido</h1>
          <p className="section-description">Revise os dados antes de confirmar.</p>

          <form className="payment-form" onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label>Nome completo *</label>
              <input type="text" placeholder="Digite seu nome" value={form.nome}
                onChange={e => setF("nome", e.target.value)}
                className={errors.nome ? "input-error" : ""} />
              <FieldError msg={errors.nome} />
            </div>
            <div className="form-group">
              <label>Telefone *</label>
              <input type="text" placeholder="(00) 00000-0000" value={form.telefone}
                onChange={e => setF("telefone", e.target.value)}
                className={errors.telefone ? "input-error" : ""} />
              <FieldError msg={errors.telefone} />
            </div>

            <div className="form-group">
              <label>Retirada no local</label>
              <p style={{ fontSize: 13, color: "var(--text-3)", marginBottom: 8 }}>
                Todos os pedidos são retirados diretamente no estabelecimento do vendedor.
              </p>
              <input
                type="datetime-local"
                value={horarioRetirada}
                onChange={e => setHorarioRetirada(e.target.value)}
                style={{ fontSize: 14 }}
              />
              <p style={{ fontSize: 12, color: "var(--text-3)", marginTop: 4 }}>
                Opcional: informe um horário de preferência para a retirada.
              </p>
            </div>

            <div className="form-group">
              <label>Forma de pagamento</label>
              <div className="payment-options" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
                {METHODS.map(m => (
                  <button key={m.key} type="button"
                    className={`payment-option ${paymentMethod === m.key ? "active" : ""}`}
                    onClick={() => setPaymentMethod(m.key)}>
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Observações</label>
              <textarea rows={3} placeholder="Ex: sem cebola, ponto da carne…"
                value={notes} onChange={e => setNotes(e.target.value)} />
            </div>

            <button type="submit" className="confirm-button">Confirmar pedido</button>
          </form>
        </section>

        <aside className="section-card" style={{ position:"sticky", top:"calc(var(--topbar-h) + 20px)" }}>
          <h2>Resumo</h2>
          <div className="summary-items">
            {cart.map(item => (
              <div key={item.id} className="summary-item">
                <div>
                  <h3>{item.nome}</h3>
                  <span>{item.qty}x — {item.vendedor?.nome_empresa}</span>
                </div>
                <strong>{formatCurrency(item.preco * item.qty)}</strong>
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
            <strong>{formatCurrency(subtotal)}</strong>
          </div>
        </aside>
      </div>
    </main>
  );
}
