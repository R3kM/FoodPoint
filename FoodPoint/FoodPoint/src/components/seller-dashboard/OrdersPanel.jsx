export default function OrdersPanel({
  orders,
}) {
  return (
    <section className="dashboard-card">
      <div className="dashboard-section-header">
        <h2>Pedidos</h2>
      </div>

      <div className="orders-list">
        {orders.length === 0 ? (
          <p>Nenhum pedido.</p>
        ) : (
          orders.map((order) => (
            <div
              className="order-card"
              key={order.id}
            >
              <strong>
                Pedido #{order.id}
              </strong>

              <span>
                {order.customer}
              </span>

              <p>
                Total: R$ {order.total}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}