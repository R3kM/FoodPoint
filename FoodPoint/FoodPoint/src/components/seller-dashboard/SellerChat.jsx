export default function SellerChat({
  messages,
}) {
  return (
    <aside className="dashboard-card seller-chat">
      <div className="dashboard-section-header">
        <h2>Mensagens</h2>
      </div>

      <div className="seller-messages">
        {messages.map((message) => (
          <div
            className="seller-message"
            key={message.id}
          >
            <strong>
              {message.sender}
            </strong>

            <p>{message.text}</p>
          </div>
        ))}
      </div>
    </aside>
  );
}