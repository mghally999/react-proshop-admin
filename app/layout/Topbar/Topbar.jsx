import { useTheme } from "../../providers/ThemeProvider.jsx";

export default function Topbar() {
  const { theme, toggle } = useTheme();

  return (
    <header style={styles.header}>
      <div>
        <div style={styles.title}>Enterprise Admin Dashboard</div>
      </div>

      <button style={styles.btn} onClick={toggle}>
        Theme: {theme === "dark" ? "Dark" : "Light"}
      </button>
    </header>
  );
}

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 20px",
    borderBottom: "1px solid var(--border)",
    background: "var(--panel)",
  },
  title: { fontWeight: 800 },
  sub: { fontSize: 12, color: "var(--muted)", marginTop: 4 },
  btn: {
    border: "1px solid var(--border)",
    background: "var(--card)",
    color: "var(--text)",
    padding: "10px 12px",
    borderRadius: 10,
    cursor: "pointer",
  },
};
