import { useState, useEffect, useRef } from "react";
import "./Topbar.css";
import { getConversations, getMessages } from "../../services/api";

// ── Sino de notificação ──────────────────────────────────────────────────────
function NotificationBell({ user, onNav }) {
  const [count,    setCount]    = useState(0);
  const [pulse,    setPulse]    = useState(false);
  const prevCount              = useRef(0);

  useEffect(() => {
    if (!user?.id || import.meta.env.VITE_USE_MOCK !== "false") return;

    const remetente_oposto = user.tipo === "seller" ? "cliente" : "vendedor";
    const id_field         = user.tipo === "seller" ? "vendedor_id" : "cliente_id";

    async function checkUnread() {
      try {
        const { data: convs } = await getConversations({ [id_field]: user.id });
        if (!convs?.length) return;

        let total = 0;
        await Promise.all(
          convs.map(async (c) => {
            const { data: msgs } = await getMessages(c.id);
            if (msgs) {
              total += msgs.filter(
                m => m.remetente_tipo === remetente_oposto && !m.lida
              ).length;
            }
          })
        );

        setCount(total);
        if (total > prevCount.current) {
          setPulse(true);
          setTimeout(() => setPulse(false), 600);
        }
        prevCount.current = total;
      } catch {
        // silencioso
      }
    }

    checkUnread();
    const interval = setInterval(checkUnread, 8000);
    return () => clearInterval(interval);
  }, [user?.id, user?.tipo]);

  return (
    <button
      className={`topbar-bell-btn ${pulse ? "pulse" : ""}`}
      onClick={() => onNav(user?.tipo === "seller" ? "seller-messages" : "chat")}
      title={count > 0 ? `${count} mensagem(ns) não lida(s)` : "Mensagens"}
      aria-label="Mensagens"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
        <path d="M13.73 21a2 2 0 01-3.46 0"/>
      </svg>
      {count > 0 && (
        <span className="topbar-bell-badge">{count > 9 ? "9+" : count}</span>
      )}
    </button>
  );
}

// ── Topbar principal ─────────────────────────────────────────────────────────
export default function Topbar({ user, cartCount, onCart, onNav, onLogout, onProfile, isLanding }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const isSeller   = user?.tipo === "seller";
  const displayName = isSeller
    ? user?.nome_empresa?.split(" ")[0]
    : user?.nome?.split(" ")[0];

  // Fecha menu ao clicar fora
  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const nav = (target) => { onNav(target); setMenuOpen(false); };

  if (isLanding) {
    return (
      <header className="topbar">
        <div className="topbar-logo" onClick={() => onNav("landing")}>
          <span>FoodPoint</span>
          <span className="topbar-logo-dot" />
        </div>
        <div className="topbar-spacer" />
        <nav className="topbar-nav">
          <button className="topbar-login-btn" onClick={() => onNav("auth")}>Entrar</button>
        </nav>
      </header>
    );
  }

  return (
    <header className="topbar">
      <div className="topbar-logo"
        onClick={() => nav(user ? (isSeller ? "seller-dashboard" : "home") : "landing")}>
        <span>FoodPoint</span>
        <span className="topbar-logo-dot" />
      </div>

      <div className="topbar-spacer" />

      {/* ── Desktop nav ── */}
      <nav className="topbar-nav topbar-nav--desktop">
        {!isSeller && user && (
          <>
            <button className="topbar-nav-btn" onClick={() => nav("home")}>Início</button>
            <button className="topbar-nav-btn" onClick={() => nav("my-orders")}>Meus Pedidos</button>
            <button className="topbar-cart-btn" onClick={onCart}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
          <button className="topbar-nav-btn" onClick={() => nav("seller-dashboard")}>Painel</button>
        )}
        {user && <NotificationBell user={user} onNav={nav} />}
        {!user ? (
          <button className="topbar-login-btn" onClick={() => nav("auth")}>Entrar</button>
        ) : (
          <>
            <button className="topbar-user-chip" onClick={onProfile} title="Editar perfil">
              <div className="topbar-user-avatar">{displayName?.[0]?.toUpperCase() || "U"}</div>
              <span className="topbar-user-name">{displayName}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
            <button className="topbar-logout-btn" onClick={onLogout}>Sair</button>
          </>
        )}
      </nav>

      {/* ── Mobile: sino + hamburguer ── */}
      <div className="topbar-mobile-actions">
        {user && <NotificationBell user={user} onNav={nav} />}
        {!isSeller && user && (
          <button className="topbar-cart-btn topbar-cart-btn--mobile" onClick={onCart}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
        )}
        <button
          className={`topbar-hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Menu"
        >
          <span /><span /><span />
        </button>
      </div>

      {/* ── Mobile dropdown menu ── */}
      {menuOpen && (
        <div className="topbar-mobile-menu" ref={menuRef}>
          {!user ? (
            <button className="topbar-mobile-item" onClick={() => nav("auth")}>Entrar</button>
          ) : (
            <>
              <div className="topbar-mobile-user">
                <div className="topbar-user-avatar">{displayName?.[0]?.toUpperCase() || "U"}</div>
                <span>{displayName}</span>
              </div>
              <div className="topbar-mobile-divider" />
              {!isSeller && (
                <>
                  <button className="topbar-mobile-item" onClick={() => nav("home")}>Início</button>
                  <button className="topbar-mobile-item" onClick={() => nav("chat")}>Mensagens</button>
                  <button className="topbar-mobile-item" onClick={() => nav("my-orders")}>Meus Pedidos</button>
                </>
              )}
              {isSeller && (
                <>
                  <button className="topbar-mobile-item" onClick={() => nav("seller-dashboard")}>Painel</button>
                  <button className="topbar-mobile-item" onClick={() => nav("seller-messages")}>Mensagens</button>
                </>
              )}
              <button className="topbar-mobile-item" onClick={() => { onProfile(); setMenuOpen(false); }}>
                Editar perfil
              </button>
              <div className="topbar-mobile-divider" />
              <button className="topbar-mobile-item topbar-mobile-item--danger" onClick={() => { onLogout(); setMenuOpen(false); }}>
                Sair
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
}
