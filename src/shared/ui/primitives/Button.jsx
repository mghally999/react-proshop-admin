export default function Button({
  children,
  loading = false,
  disabled,
  ...props
}) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      data-loading={loading ? "true" : undefined}
      className={`btn ${loading ? "is-loading" : ""}`}
    >
      {loading ? "Please wait…" : children}
    </button>
  );
}
