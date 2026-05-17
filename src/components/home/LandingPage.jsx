import "./LandingPage.css";

const HOW_STEPS = [
  {
    num: "01",
    title: "Crie sua conta",
    desc: "Cadastre-se gratuitamente como cliente ou empreendedor. O processo leva menos de dois minutos.",
  },
  {
    num: "02",
    title: "Descubra vendedores",
    desc: "Explore vendedores locais perto de você, filtre por categoria e leia avaliações reais.",
  },
  {
    num: "03",
    title: "Faça seu pedido",
    desc: "Adicione produtos ao carrinho, escolha a forma de pagamento e confirme seu pedido.",
  },
  {
    num: "04",
    title: "Retire no local",
    desc: "Acompanhe o status do pedido em tempo real e retire diretamente no estabelecimento do vendedor.",
  },
];

const FOR_SELLERS = [
  { title: "Cadastro gratuito", desc: "Crie sua loja sem custo e comece a vender imediatamente." },
  { title: "Painel completo", desc: "Gerencie produtos, pedidos e clientes em um só lugar." },
  { title: "Pagamentos flexíveis", desc: "Aceite PIX, dinheiro, crédito ou débito — o cliente paga na retirada ou via chave PIX." },
  { title: "Chat integrado", desc: "Converse diretamente com seus clientes sem sair da plataforma." },
];

export default function LandingPage({ onExplore, onNav }) {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <main className="landing-page">

      {/* Hero */}
      <section className="lp-hero">
        <div className="lp-hero-inner">
          <div className="lp-hero-content">
            <span className="lp-badge">Melhores empreendedores locais</span>

            <h1 className="lp-hero-title">
              Comida boa,<br />
              <span className="lp-accent">perto de você</span>
            </h1>

            <p className="lp-hero-desc">
              Descubra vendedores locais, comidas artesanais e produtos
              frescos preparados com cuidado e carinho.
            </p>

            <div className="lp-cta-row">
              <button className="lp-btn-primary" onClick={onExplore}>
                Explorar vendedores
              </button>
              <button className="lp-btn-ghost" onClick={() => scrollTo("como-funciona")}>
                Como funciona
              </button>
            </div>

            <div className="lp-stats">
              <div className="lp-stat">
                <span className="lp-stat-val">6+</span>
                <span className="lp-stat-label">Vendedores ativos</span>
              </div>
              <div className="lp-stat-divider" />
              <div className="lp-stat">
                <span className="lp-stat-val">18+</span>
                <span className="lp-stat-label">Produtos disponíveis</span>
              </div>
              <div className="lp-stat-divider" />
              <div className="lp-stat">
                <span className="lp-stat-val">4.7</span>
                <span className="lp-stat-label">Avaliação média</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="lp-section" id="como-funciona">
        <div className="lp-section-inner">
          <div className="lp-section-header">
            <p className="lp-section-eyebrow">Simples e rápido</p>
            <h2 className="lp-section-title">Como funciona</h2>
            <p className="lp-section-sub">
              Do descobrimento ao pedido, tudo em poucos passos.
            </p>
          </div>

          <div className="lp-steps">
            {HOW_STEPS.map((s) => (
              <div className="lp-step" key={s.num}>
                <div className="lp-step-num">{s.num}</div>
                <h3 className="lp-step-title">{s.title}</h3>
                <p className="lp-step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Para vendedores */}
      <section className="lp-section lp-section-dark">
        <div className="lp-section-inner">
          <div className="lp-section-header">
            <p className="lp-section-eyebrow" style={{ color: "rgba(255,255,255,0.5)" }}>Para empreendedores</p>
            <h2 className="lp-section-title" style={{ color: "white" }}>Venda mais, com menos esforço</h2>
            <p className="lp-section-sub" style={{ color: "rgba(255,255,255,0.6)" }}>
              Ferramentas pensadas para quem vende comida de verdade.
            </p>
          </div>

          <div className="lp-features">
            {FOR_SELLERS.map((f) => (
              <div className="lp-feature-card" key={f.title}>
                <h3 className="lp-feature-title">{f.title}</h3>
                <p className="lp-feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="lp-section lp-cta-section">
        <div className="lp-section-inner lp-cta-inner">
          <h2 className="lp-section-title">Pronto para começar?</h2>
          <p className="lp-section-sub">
            Crie sua conta gratuitamente e comece agora.
          </p>
          <div className="lp-cta-row" style={{ justifyContent: "center", marginTop: 32 }}>
            <button className="lp-btn-primary" onClick={onExplore}>
              Criar conta grátis
            </button>
            <button className="lp-btn-outline" onClick={() => onNav("auth")}>
              Já tenho conta
            </button>
          </div>
        </div>
      </section>

    </main>
  );
}
