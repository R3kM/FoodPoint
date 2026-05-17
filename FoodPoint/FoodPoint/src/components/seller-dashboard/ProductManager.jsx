import { useState } from "react";

import ProductForm from "./ProductForm";

export default function ProductManager({
  products,
  onAddProduct,
  onRemoveProduct,
  onEditProduct,
}) {
  const [showForm, setShowForm] =
    useState(false);

  const [editingProduct,
    setEditingProduct] =
    useState(null);

  return (
    <section className="dashboard-card">
      <div className="dashboard-section-header">
        <h2>Produtos</h2>

        <button
          className="primary-button"
          onClick={() =>
            setShowForm(!showForm)
          }
        >
          Novo Produto
        </button>
      </div>

      {showForm && (
        <ProductForm
          editingProduct={
            editingProduct
          }
          onAddProduct={
            onAddProduct
          }
          onEditProduct={
            onEditProduct
          }
        />
      )}

      <div className="dashboard-products">
        {products.map((product) => (
          <div
            className="dashboard-product"
            key={product.id}
          >
            <div>
              <h3>
                {product.nome}
              </h3>

              <p>
                R$ {product.preco}
              </p>
            </div>

            <div
              style={{
                display: "flex",
                gap: "10px",
              }}
            >
              <button
                className="secondary-button"
                onClick={() => {
                  setEditingProduct(
                    product
                  );

                  setShowForm(true);
                }}
              >
                Editar
              </button>

              <button
                className="danger-button"
                onClick={() =>
                  onRemoveProduct(
                    product.id
                  )
                }
              >
                Remover
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}