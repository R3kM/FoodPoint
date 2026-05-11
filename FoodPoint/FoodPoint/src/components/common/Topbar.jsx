import "./Topbar.css";

export default function Topbar({
  user,
  cartCount,
  onCart,
  onNav,
  onLogout,
}) {
  const isSeller =
    user?.tipo === "seller";

  return (
    <header className="topbar">
      <div
        className="topbar-logo"
        onClick={() => onNav("home")}
      >
        FoodPoint
      </div>

      <nav className="topbar-nav">
        {!isSeller && (
          <button
            onClick={() =>
              onNav("home")
            }
          >
            Home
          </button>
        )}

        <button
          onClick={() =>
            onNav("chat")
          }
        >
          Chat
        </button>

        {isSeller && (
          <button
            onClick={() =>
              onNav(
                "seller-dashboard"
              )
            }
          >
            Dashboard
          </button>
        )}

        {!isSeller && (
          <button onClick={onCart}>
            Carrinho (
            {cartCount})
          </button>
        )}

        {!user ? (
          <button
            onClick={() =>
              onNav("auth")
            }
          >
            Entrar
          </button>
        ) : (
          <button onClick={onLogout}>
            Sair
          </button>
        )}
      </nav>
    </header>
  );
}