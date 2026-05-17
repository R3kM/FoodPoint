import "./Chat.css";

export default function MessageBubble({ message }) {
  const isMe = message.sender === "Cliente";

  return (
    <div className={`message-bubble ${isMe ? "me" : "other"}`}>
      <div>{message.text}</div>
      <div className="message-meta">{message.time}</div>
    </div>
  );
}
