export default function FieldError({ msg }) {
  if (!msg) return null;
  return (
    <span style={{
      display: "block",
      fontSize: 12,
      color: "var(--danger)",
      marginTop: 4,
      fontWeight: 500,
    }}>
      {msg}
    </span>
  );
}
