import "./Topbar.css";

export default function Topbar({ user, cartCount, onCart, onNav, onLogout, onProfile, isLanding }) {
  const isSeller = user?.tipo === "seller";
  const displayName = isSeller
    ? user?.nome_empresa?.split(" ")[0]
    : user?.nome?.split(" ")[0];

  /* Landing page: só botão Entrar */
  if (isLanding) {
    return (
      <header className="topbar">
        <div className="topbar-logo" onClick={() => onNav("landing")}>
          <span>FoodPoint</span>
          <span className="topbar-logo-dot" />
        </div>
        <div className="topbar-spacer" />
        <nav className="topbar-nav">
          <button className="topbar-login-btn" onClick={() => onNav("auth")}>
            Entrar
          </button>
        </nav>
      </header>
    );
  }

  return (
    <header className="topbar">
      <div className="topbar-logo" onClick={() => onNav(user ? (isSeller ? "seller-dashboard" : "home") : "landing")}>
        <span>FoodPoint</span>
        <span className="topbar-logo-dot" />
      </div>

      <div className="topbar-spacer" />

      <nav className="topbar-nav">
        {!isSeller && user && (
          <>
            <button className="topbar-nav-btn" onClick={() => onNav("home")}>Início</button>
            <button className="topbar-nav-btn" onClick={() => onNav("chat")}>Mensagens</button>
            <button className="topbar-nav-btn" onClick={() => onNav("my-orders")}>Meus Pedidos</button>
            <button className="topbar-cart-btn" onClick={onCart}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              Carrinho
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
          </>
        )}

        {isSeller && user && (
          <>
            <button className="topbar-nav-btn" onClick={() => onNav("seller-dashboard")}>Painel</button>
            <button className="topbar-nav-btn" onClick={() => onNav("chat")}>Mensagens</button>
          </>
        )}

        {!user ? (
          <button className="topbar-login-btn" onClick={() => onNav("auth")}>Entrar</button>
        ) : (
          <>
            <button className="topbar-user-chip" onClick={onProfile} title="Editar perfil">
              <div className="topbar-user-avatar">{displayName?.[0]?.toUpperCase() || "U"}</div>
              <span>{displayName}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
            <button className="topbar-logout-btn" onClick={onLogout}>Sair</button>
          </>
        )}
      </nav>
    </header>
  );
}
