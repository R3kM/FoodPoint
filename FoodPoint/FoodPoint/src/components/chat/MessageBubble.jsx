import "./Chat.css";

export default function MessageBubble({
  message,
}) {
  return (
    <div
      className={`message-row ${
        message.sender === "user"
          ? "user"
          : "seller"
      }`}
    >
      <div className="message-bubble">
        <p>{message.text}</p>

        <span>
          {message.time}
        </span>
      </div>
    </div>
  );
}