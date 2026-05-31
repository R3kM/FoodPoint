import { useMemo, useState, useEffect, useRef } from "react";
import "./PaymentPage.css";
import { formatCurrency } from "../../utils/formatters";
import FieldError from "../common/FieldError";
import { validatePayment, hasErrors } from "../../utils/validate";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";
const STRIPE_PK = import.meta.env.VITE_STRIPE_PUBLIC_KEY || "";

const METHODS = [
  { key: "pix",            label: "PIX" },
  { key: "dinheiro",       label: "Dinheiro" },
  { key: "cartao_credito", label: "Crédito" },
  { key: "cartao_debito",  label: "Débito" },
];

// ─── Hook: carrega o Stripe.js de forma segura ────────────────────────────────
function useStripe() {
  const [stripe, setStripe] = useState(null);

  useEffect(() => {
    if (!STRIPE_PK) return;
    if (window.Stripe) { setStripe(window.Stripe(STRIPE_PK)); return; }

    const existing = document.querySelector('script[src="https://js.stripe.com/v3/"]');
    if (existing) {
      existing.addEventListener("load", () => setStripe(window.Stripe(STRIPE_PK)));
      return;
    }

    const script = document.createElement("script");
    script.src = "https://js.stripe.com/v3/";
    script.async = true;
    script.onload = () => setStripe(window.Stripe(STRIPE_PK));
    document.head.appendChild(script);
  }, []);

  return stripe;
}

// ─── Formulário Stripe ────────────────────────────────────────────────────────
function StripeCardForm({ total, onSuccess, onError }) {
  const stripe        = useStripe();
  const [elements, setElements] = useState(null);
  const [ready,    setReady]    = useState(false);
  const [loading,  setLoading]  = useState(false);
  const mountedRef = useRef(false);

  useEffect(() => {
    if (!stripe || mountedRef.current) return;

    async function setup() {
      try {
        const res = await fetch(`${BASE_URL}/pagamentos/criar-intencao`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ total }),
        });

        if (!res.ok) { onError("Erro ao iniciar pagamento. Tente novamente."); return; }

        const { clientSecret } = await res.json();
        if (!clientSecret) { onError("Erro ao iniciar pagamento."); return; }

        const els = stripe.elements({ clientSecret, locale: "pt-BR" });
        const paymentEl = els.create("payment");
        paymentEl.mount("#stripe-payment-element");
        paymentEl.on("ready", () => setReady(true));
        setElements(els);
        mountedRef.current = true;
      } catch {
        onError("Erro de conexão com o servidor de pagamento.");
      }
    }

    setup();
  }, [stripe]);

  const handleConfirm = async () => {
    if (!stripe || !elements) return;
    setLoading(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: { return_url: window.location.href },
        redirect: "if_required",
      });

      if (error) {
        onError(error.message);
      } else if (paymentIntent?.status === "succeeded") {
        onSuccess();
      } else {
        onError("Pagamento não confirmado. Tente novamente.");
      }
    } catch {
      onError("Erro ao processar pagamento.");
    }

    setLoading(false);
  };

  if (!STRIPE_PK) {
    return (
      <div style={{
        padding: "14px 16px", borderRadius: 8,
        background: "#fff7ed", border: "1px solid #fed7aa",
        fontSize: 13, color: "#9a3412", lineHeight: 1.6,
      }}>
        ⚠️ Chave pública do Stripe não configurada.<br />
        Adicione <code>VITE_STRIPE_PUBLIC_KEY=pk_test_...</code> no arquivo <code>.env</code> do frontend e reinicie o Vite.
      </div>
    );
  }

  return (
    <div>
      <div
        id="stripe-payment-element"
        style={{ minHeight: 100 }}
      />
      {!ready && (
        <p style={{ fontSize: 13, color: "var(--text-3)", marginTop: 8 }}>
          Carregando formulário de pagamento…
        </p>
      )}
      {ready && (
        <button
          type="button"
          className="confirm-button"
          style={{ marginTop: 20 }}
          onClick={handleConfirm}
          disabled={loading}
        >
          {loading ? "Processando…" : `Pagar ${formatCurrency(total)} com cartão`}
        </button>
      )}
    </div>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────
export default function PaymentPage({ cart, user, onBack, onSuccess }) {
  const [paymentMethod,    setPaymentMethod]    = useState("pix");
  const [notes,            setNotes]            = useState("");
  const [horarioRetirada,  setHorarioRetirada]  = useState("");
  const [stripeError,      setStripeError]      = useState("");
  const [form,             setForm]             = useState({
    nome:     user?.nome     || "",
    telefone: user?.telefone || "",
  });
  const [errors, setErrors] = useState({});

  const setF = (k, v) => {
    setForm(p => ({ ...p, [k]: v }));
    setErrors(p => ({ ...p, [k]: "" }));
  };

  const subtotal   = useMemo(() => cart.reduce((a, i) => a + i.preco * i.qty, 0), [cart]);
  const totalItems = useMemo(() => cart.reduce((a, i) => a + i.qty, 0), [cart]);

  const isCard = paymentMethod === "cartao_credito" || paymentMethod === "cartao_debito";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isCard) return; // cartão é tratado pelo botão do Stripe
    const errs = validatePayment(form);
    if (hasErrors(errs)) { setErrors(errs); return; }
    onSuccess({
      tipo_entrega:      "retirada",
      metodo_pagamento:  paymentMethod,
      horario_retirada:  horarioRetirada,
      ...form,
      notes,
    });
  };

  const handleStripeSuccess = () => {
    onSuccess({
      tipo_entrega:     "retirada",
      metodo_pagamento: paymentMethod,
      horario_retirada: horarioRetirada,
      ...form,
      notes,
    });
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
              <input type="datetime-local" value={horarioRetirada}
                onChange={e => setHorarioRetirada(e.target.value)}
                style={{ fontSize: 14 }} />
              <p style={{ fontSize: 12, color: "var(--text-3)", marginTop: 4 }}>
                Opcional: informe um horário de preferência.
              </p>
            </div>

            <div className="form-group">
              <label>Forma de pagamento</label>
              <div className="payment-options" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
                {METHODS.map(m => (
                  <button key={m.key} type="button"
                    className={`payment-option ${paymentMethod === m.key ? "active" : ""}`}
                    onClick={() => { setPaymentMethod(m.key); setStripeError(""); }}>
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Stripe ── */}
            {isCard && (
              <div className="form-group">
                <label>Dados do cartão</label>
                <StripeCardForm
                  total={subtotal}
                  onSuccess={handleStripeSuccess}
                  onError={setStripeError}
                />
                {stripeError && (
                  <p style={{ color: "var(--danger)", fontSize: 13, marginTop: 8 }}>
                    {stripeError}
                  </p>
                )}
              </div>
            )}

            {/* ── PIX / Dinheiro ── */}
            {!isCard && (
              <>
                {paymentMethod === "pix" && (
                  <div className="form-group">
                    <div style={{
                      background: "var(--surface-2)", borderRadius: 8,
                      padding: "14px 16px", fontSize: 14, color: "var(--text-2)",
                    }}>
                      Após confirmar, o vendedor enviará a chave PIX no chat.
                    </div>
                  </div>
                )}
                <div className="form-group">
                  <label>Observações</label>
                  <textarea rows={3} placeholder="Ex: sem cebola, ponto da carne…"
                    value={notes} onChange={e => setNotes(e.target.value)} />
                </div>
                <button type="submit" className="confirm-button">
                  Confirmar pedido
                </button>
              </>
            )}
          </form>
        </section>

        {/* ── Resumo ── */}
        <aside className="section-card" style={{ position: "sticky", top: "calc(var(--topbar-h) + 20px)" }}>
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
