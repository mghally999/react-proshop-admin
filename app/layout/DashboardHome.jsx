export default function DashboardHome() {
  return (
    <div
      style={{
        border: "1px solid var(--border)",
        background: "var(--card)",
        borderRadius: 12,
        padding: 16,
      }}
    >
      <h2 style={{ margin: 0 }}>Dashboard</h2>
      <p style={{ marginTop: 8, color: "var(--muted)" }}>
        Welcome to ProShop Admin ✅
      </p>

      <div
        style={{
          marginTop: 12,
          display: "grid",
          gap: 10,
          gridTemplateColumns: "repeat(4, minmax(0,1fr))",
        }}
      >
        <Stat title="Products" value="—" />
        <Stat title="Low stock" value="—" />
        <Stat title="Rented" value="—" />
        <Stat title="Sales" value="—" />
      </div>
    </div>
  );
}

function Stat({ title, value }) {
  return (
    <div
      style={{
        border: "1px solid var(--border)",
        background: "rgba(255,255,255,0.03)",
        borderRadius: 12,
        padding: 12,
      }}
    >
      <div style={{ fontSize: 12, color: "var(--muted)" }}>{title}</div>
      <div style={{ marginTop: 6, fontSize: 18, fontWeight: 700 }}>{value}</div>
    </div>
  );
}
