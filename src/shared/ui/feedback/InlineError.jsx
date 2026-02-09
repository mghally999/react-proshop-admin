export default function InlineError({ message }) {
  if (!message) return null;

  return (
    <div
      role="alert"
      style={{
        padding: "8px 10px",
        borderRadius: 8,
        background: "rgba(255, 77, 79, 0.12)",
        color: "#ff4d4f",
        fontSize: 13,
        lineHeight: 1.4,
        border: "1px solid rgba(255, 77, 79, 0.25)",
      }}
    >
      {message}
    </div>
  );
}
