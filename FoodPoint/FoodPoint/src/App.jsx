import { useState } from "react";

import "./styles/global.css";

import { MOCK_SELLERS } from "./data/mockSellers";

import Topbar from "./components/common/Topbar";
import Toast from "./components/common/Toast";

import HomePage from "./components/home/HomePage";

import AuthScreen from "./components/auth/AuthScreen";

import SellerPage from "./components/seller/SellerPage";

import CartSidebar from "./components/cart/CartSidebar";

import PaymentPage from "./components/payment/PaymentPage";

import ChatSidebar from "./components/chat/ChatSidebar";
import ChatWindow from "./components/chat/ChatWindow";

import SellerDashboard from "./components/seller-dashboard/SellerDashboard";

export default function App() {
  /* ========================================
     STATES
  ======================================== */

  const [page, setPage] =
    useState("home");

  const [user, setUser] =
    useState(null);

  const [selectedSeller,
    setSelectedSeller] =
    useState(null);

  const [selectedChat,
    setSelectedChat] =
    useState(null);

  const [cartOpen, setCartOpen] =
    useState(false);

  const [toast, setToast] =
    useState("");

  const [cart, setCart] =
    useState([]);

  const [messages, setMessages] =
    useState([]);

  const [orders, setOrders] =
    useState([]);

  const [sellerProducts,
    setSellerProducts] =
    useState([]);

  /* ========================================
     TOAST
  ======================================== */

  const showToast = (message) => {
    setToast(message);
  };

  /* ========================================
     AUTH
  ======================================== */

  const handleLogin = (
    loggedUser
  ) => {
    setUser(loggedUser);

    if (
      loggedUser.tipo === "seller"
    ) {
      setPage("seller-dashboard");
    } else {
      setPage("home");
    }

    showToast(
      "Login realizado com sucesso!"
    );
  };

  const handleRegister = (
    newUser
  ) => {
    setUser(newUser);

    if (
      newUser.tipo === "seller"
    ) {
      setPage("seller-dashboard");
    } else {
      setPage("home");
    }

    showToast(
      "Conta criada com sucesso!"
    );
  };

  const handleLogout = () => {
    setUser(null);

    setCart([]);

    setSelectedSeller(null);

    setSelectedChat(null);

    setPage("home");

    showToast(
      "Logout realizado."
    );
  };

  /* ========================================
     SELLERS
  ======================================== */

  const handleSellerClick = (
    seller
  ) => {
    setSelectedSeller(seller);

    setPage("seller");
  };

  /* ========================================
     CART
  ======================================== */

  const addToCart = (
    product,
    seller
  ) => {
    setCart((prev) => {
      const existingItem =
        prev.find(
          (item) =>
            item.id === product.id
        );

      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id
            ? {
                ...item,
                qty:
                  item.qty + 1,
              }
            : item
        );
      }

      return [
        ...prev,
        {
          ...product,
          vendedor: seller,
          qty: 1,
        },
      ];
    });

    showToast(
      "Produto adicionado ao carrinho!"
    );
  };

  const updateQuantity = (
    id,
    amount
  ) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? {
                ...item,
                qty:
                  item.qty +
                  amount,
              }
            : item
        )
        .filter(
          (item) => item.qty > 0
        )
    );
  };

  const handleCheckout = () => {
    if (!user) {
      setPage("auth");

      showToast(
        "Faça login para continuar."
      );

      return;
    }

    setCartOpen(false);

    setPage("payment");
  };

  /* ========================================
     PAYMENT
  ======================================== */

  const handlePaymentSuccess =
    () => {
      const total = cart.reduce(
        (acc, item) =>
          acc +
          item.preco * item.qty,
        0
      );

      const newOrder = {
        id: Date.now(),

        customer:
          user?.nome ||
          "Cliente",

        total,

        status: "pendente",
      };

      setOrders((prev) => [
        ...prev,
        newOrder,
      ]);

      setCart([]);

      setPage("home");

      showToast(
        "Pedido realizado com sucesso!"
      );
    };

  /* ========================================
     CHAT
  ======================================== */

  const handleSendMessage = (
    text
  ) => {
    const newMessage = {
      id: Date.now(),

      text,

      sender:
        user?.tipo === "seller"
          ? "Empreendedor"
          : "Cliente",

      time:
        new Date().toLocaleTimeString(
          "pt-BR",
          {
            hour: "2-digit",
            minute:
              "2-digit",
          }
        ),
    };

    setMessages((prev) => [
      ...prev,
      newMessage,
    ]);

    showToast(
      "Mensagem enviada!"
    );
  };

  /* ========================================
     PRODUCTS
  ======================================== */

  const handleAddProduct = (
    product
  ) => {
    setSellerProducts((prev) => [
      ...prev,
      product,
    ]);

    showToast(
      "Produto criado com sucesso!"
    );
  };

  const handleRemoveProduct = (
    id
  ) => {
    setSellerProducts((prev) =>
      prev.filter(
        (product) =>
          product.id !== id
      )
    );

    showToast(
      "Produto removido."
    );
  };

  const handleEditProduct = (
    updatedProduct
  ) => {
    setSellerProducts((prev) =>
      prev.map((product) =>
        product.id ===
        updatedProduct.id
          ? updatedProduct
          : product
      )
    );

    showToast(
      "Produto atualizado!"
    );
  };

  /* ========================================
     PROFILE
  ======================================== */

  const handleUpdateProfile = (
    updatedData
  ) => {
    setUser(updatedData);

    showToast(
      "Perfil atualizado!"
    );
  };

  const handleDeleteAccount =
    () => {
      setUser(null);

      setPage("home");

      showToast(
        "Conta removida."
      );
    };

  /* ========================================
     RENDER
  ======================================== */

  return (
    <div className="app">
      <Topbar
        user={user}
        cartCount={cart.length}
        onCart={() =>
          setCartOpen(true)
        }
        onNav={setPage}
        onLogout={handleLogout}
      />

      {/* HOME */}

      {page === "home" && (
        <HomePage
          user={user}
          onSellerClick={
            handleSellerClick
          }
        />
      )}

      {/* AUTH */}

      {page === "auth" && (
        <AuthScreen
          onLogin={handleLogin}
          onRegister={
            handleRegister
          }
        />
      )}

      {/* SELLER PAGE */}

      {page === "seller" &&
        selectedSeller && (
          <SellerPage
            seller={
              selectedSeller
            }
            user={user}
            onAddToCart={
              addToCart
            }
            showToast={
              showToast
            }
            onBack={() =>
              setPage("home")
            }
          />
        )}

      {/* CHAT */}

      {page === "chat" && (
        <div className="chat-layout">
          <ChatSidebar
            sellers={
              MOCK_SELLERS
            }
            selectedChat={
              selectedChat
            }
            onSelect={
              setSelectedChat
            }
          />

          <ChatWindow
            selectedChat={
              selectedChat
            }
            messages={messages}
            onSendMessage={
              handleSendMessage
            }
          />
        </div>
      )}

      {/* PAYMENT */}

      {page === "payment" && (
        <PaymentPage
          cart={cart}
          onBack={() =>
            setPage("home")
          }
          onSuccess={
            handlePaymentSuccess
          }
        />
      )}

      {/* SELLER DASHBOARD */}

      {page ===
        "seller-dashboard" &&
        user?.tipo ===
          "seller" && (
          <SellerDashboard
            seller={user}
            products={
              sellerProducts
            }
            orders={orders}
            messages={messages}
            onAddProduct={
              handleAddProduct
            }
            onRemoveProduct={
              handleRemoveProduct
            }
            onEditProduct={
              handleEditProduct
            }
            onUpdateProfile={
              handleUpdateProfile
            }
            onDeleteAccount={
              handleDeleteAccount
            }
          />
        )}

      {/* CART */}

      {cartOpen &&
        user?.tipo !==
          "seller" && (
          <CartSidebar
            items={cart}
            onClose={() =>
              setCartOpen(false)
            }
            onQty={
              updateQuantity
            }
            onCheckout={
              handleCheckout
            }
          />
        )}

      {/* TOAST */}

      {toast && (
        <Toast
          msg={toast}
          onClose={() =>
            setToast("")
          }
        />
      )}
    </div>
  );
}