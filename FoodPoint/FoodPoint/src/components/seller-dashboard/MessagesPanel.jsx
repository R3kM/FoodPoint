export default function MessagesPanel({
  messages,
}) {
  return (
    <section className="dashboard-card">
      <h2>Mensagens</h2>

      {messages.length === 0 ? (
        <p>
          Nenhuma mensagem.
        </p>
      ) : (
        messages.map((message) => (
          <div
            key={message.id}
            style={{
              marginBottom: "16px",
            }}
          >
            <strong>
              {message.sender}
            </strong>

            <p>{message.text}</p>

            <small>
              {message.time}
            </small>
          </div>
        ))
      )}
    </section>
  );
}