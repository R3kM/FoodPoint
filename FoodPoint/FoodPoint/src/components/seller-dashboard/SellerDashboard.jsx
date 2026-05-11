import "./SellerDashboard.css";

import ProductManager from "./ProductManager";
import OrdersPanel from "./OrdersPanel";
import MessagesPanel from "./MessagesPanel";
import SellerProfile from "./SellerProfile";

export default function SellerDashboard({
  seller,
  products,
  orders,
  messages,
  onAddProduct,
  onRemoveProduct,
  onEditProduct,
  onUpdateProfile,
  onDeleteAccount,
}) {
  return (
    <main className="seller-dashboard">
      <div className="dashboard-header">
        <h1>
          Painel do Empreendedor
        </h1>

        <p>
          Bem-vindo,{" "}
          {seller?.nome_empresa}
        </p>
      </div>

      <div className="dashboard-grid">
        <SellerProfile
          seller={seller}
          onUpdateProfile={
            onUpdateProfile
          }
          onDeleteAccount={
            onDeleteAccount
          }
        />

        <ProductManager
          products={products}
          onAddProduct={
            onAddProduct
          }
          onRemoveProduct={
            onRemoveProduct
          }
          onEditProduct={
            onEditProduct
          }
        />

        <OrdersPanel
          orders={orders}
        />

        <MessagesPanel
          messages={messages}
        />
      </div>
    </main>
  );
}