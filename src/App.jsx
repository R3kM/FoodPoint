import { useState, useCallback } from "react";
import Topbar from "./components/common/Topbar";
import LandingPage from "./components/home/LandingPage";
import AuthScreen from "./components/auth/AuthScreen";
import HomePage from "./components/home/HomePage";
import SellerPage from "./components/seller/SellerPage";
import CartSidebar from "./components/cart/CartSidebar";
import PaymentPage from "./components/payment/PaymentPage";
import MyOrders from "./components/client/MyOrders";
import SellerDashboard from "./components/seller-dashboard/SellerDashboard";
import SellerProfileModal from "./components/seller-dashboard/SellerProfileModal";
import ClientProfileModal from "./components/client/ClientProfileModal";
import ChatPage from "./components/chat/ChatPage";
import Toast from "./components/common/Toast";
import { useAuth } from "./hooks/useAuth";
import { useCart } from "./hooks/useCart";
import { useOrders } from "./hooks/useOrders";
import { useProducts } from "./hooks/useProducts";
import { createOrder, updateOrderStatus } from "./services/api";

export default function App() {
  const { user, loading: authLoading, login, register, logout, updateUser } = useAuth();
  const { cart, addItem, updateQty, clear: clearCart, totalItems } = useCart();
  const { orders, addOrder, updateStatus } = useOrders(user);
  const { products, addProduct, editProduct, removeProduct } = useProducts(
    user?.tipo === "seller" ? user.id : null
  );

  const [page,           setPage]           = useState(user ? (user.tipo === "seller" ? "seller-dashboard" : "home") : "landing");
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [cartOpen,       setCartOpen]       = useState(false);
  const [profileOpen,    setProfileOpen]    = useState(false);
  const [toast,          setToast]          = useState(null);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  // ── Auth ───────────────────────────────────────────────────────────────────
  const handleLogin = useCallback(async (credentials) => {
    const u = await login(credentials);
    if (u) setPage(u.tipo === "seller" ? "seller-dashboard" : "home");
  }, [login]);

  const handleRegister = useCallback(async (formData) => {
    const u = await register(formData);
    if (u) setPage(u.tipo === "seller" ? "seller-dashboard" : "home");
  }, [register]);

  const handleLogout = useCallback(() => {
    logout();
    clearCart();
    setPage("landing");
  }, [logout, clearCart]);

  // ── Navegação ──────────────────────────────────────────────────────────────
  const handleNav = useCallback((target) => {
    setPage(target);
    setCartOpen(false);
  }, []);

  const handleSellerSelect = useCallback((seller) => {
    setSelectedSeller(seller);
    setPage("seller");
  }, []);

  // ── Carrinho ───────────────────────────────────────────────────────────────
  const handleAddToCart = useCallback((product, seller) => {
    return addItem(product, seller);
  }, [addItem]);

  // ── Pedido ─────────────────────────────────────────────────────────────────
  const handlePaymentSuccess = useCallback(async (details) => {
    const vendedor = cart[0]?.vendedor;
    const itens = cart.map(i => ({
      produto_id:     i.id,
      nome:           i.nome,
      quantidade:     i.qty,
      qty:            i.qty,
      preco_unitario: i.preco,
      preco:          i.preco,
    }));

    const orderPayload = {
      cliente_id:       user?.id,
      vendedor_id:      vendedor?.id,
      tipo_entrega:     "retirada",
      horario_retirada: details.horario_retirada || null,
      total:            cart.reduce((s, i) => s + i.preco * i.qty, 0),
      metodo_pagamento: details.metodo_pagamento,
      observacoes:      details.notes || null,
      itens,
    };

    // Tenta criar no backend
    const { data: apiOrder } = await createOrder(orderPayload);

    const newOrder = {
      ...(apiOrder || {}),
      id:               apiOrder?.id || Date.now(),
      cliente_id:       user?.id,
      vendedor_id:      vendedor?.id,
      customer:         details.nome || user?.nome,
      vendedor:         vendedor?.nome_empresa || "Vendedor",
      items:            itens,
      total:            orderPayload.total,
      status:           apiOrder?.status || "pendente",
      tipo_entrega:     "retirada",
      horario_retirada: details.horario_retirada || null,
      metodo_pagamento: details.metodo_pagamento,
      observacoes:      details.notes || null,
      criado_em:        new Date().toLocaleString("pt-BR"),
    };

    addOrder(newOrder);
    clearCart();
    setPage("my-orders");
    showToast("Pedido realizado com sucesso! 🎉");
  }, [cart, user, addOrder, clearCart, showToast]);

  // ── Status do pedido (vendedor) ────────────────────────────────────────────
  const handleUpdateOrderStatus = useCallback(async (orderId, status) => {
    await updateStatus(orderId, status);
    showToast("Status atualizado.");
  }, [updateStatus, showToast]);

  // ── Perfil ─────────────────────────────────────────────────────────────────
  const handleUpdateProfile = useCallback((updated) => {
    updateUser(updated);
    setProfileOpen(false);
    showToast("Perfil atualizado!");
  }, [updateUser, showToast]);

  const handleDeleteAccount = useCallback(() => {
    handleLogout();
    showToast("Conta encerrada.");
  }, [handleLogout, showToast]);

  // ── Produtos (vendedor) ────────────────────────────────────────────────────
  const handleAddProduct    = useCallback((p) => { addProduct(p);    showToast("Produto adicionado!");  }, [addProduct,    showToast]);
  const handleEditProduct   = useCallback((p) => { editProduct(p);   showToast("Produto atualizado!"); }, [editProduct,   showToast]);
  const handleRemoveProduct = useCallback((id) => { removeProduct(id); showToast("Produto removido."); }, [removeProduct, showToast]);

  // ── Renderização ───────────────────────────────────────────────────────────
  const isSeller  = user?.tipo === "seller";
  const isLanding = page === "landing" || page === "auth";

  return (
    <>
      <Topbar
        user={user}
        cartCount={totalItems}
        onCart={() => setCartOpen(true)}
        onNav={handleNav}
        onLogout={handleLogout}
        onProfile={() => setProfileOpen(true)}
        isLanding={isLanding}
      />

      <div style={{ paddingTop: isLanding ? 0 : 64 }}>
        {page === "landing" && (
          <LandingPage
            onExplore={() => setPage("auth")}
            onNav={handleNav}
          />
        )}

        {page === "auth" && (
          <AuthScreen
            onLogin={handleLogin}
            onRegister={handleRegister}
            loading={authLoading}
          />
        )}

        {page === "home" && !isSeller && (
          <HomePage
            user={user}
            onSellerClick={handleSellerSelect}
          />
        )}

        {page === "seller" && selectedSeller && (
          <SellerPage
            seller={selectedSeller}
            user={user}
            onAddToCart={handleAddToCart}
            showToast={showToast}
            onBack={() => setPage("home")}
          />
        )}

        {page === "my-orders" && !isSeller && (
          <MyOrders
            orders={orders}
            onBack={() => setPage("home")}
          />
        )}

        {page === "chat" && (
          <ChatPage user={user} />
        )}

        {page === "seller-dashboard" && isSeller && (
          <SellerDashboard
            seller={user}
            products={products}
            orders={orders}
            messages={[]}
            onAddProduct={handleAddProduct}
            onEditProduct={handleEditProduct}
            onRemoveProduct={handleRemoveProduct}
            onUpdateProfile={handleUpdateProfile}
            onDeleteAccount={handleDeleteAccount}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        )}
      </div>

      {cartOpen && !isSeller && (
        <CartSidebar
          items={cart}
          onQty={updateQty}
          onClose={() => setCartOpen(false)}
          onCheckout={() => { setCartOpen(false); setPage("payment"); }}
        />
      )}

      {page === "payment" && !isSeller && (
        <PaymentPage
          cart={cart}
          user={user}
          onBack={() => setPage("home")}
          onSuccess={handlePaymentSuccess}
        />
      )}

      {profileOpen && user && (
        isSeller ? (
          <SellerProfileModal
            seller={user}
            onSave={handleUpdateProfile}
            onDelete={handleDeleteAccount}
            onClose={() => setProfileOpen(false)}
          />
        ) : (
          <ClientProfileModal
            client={user}
            onSave={handleUpdateProfile}
            onDelete={handleDeleteAccount}
            onClose={() => setProfileOpen(false)}
          />
        )
      )}

      {toast && <Toast message={toast} />}
    </>
  );
}
