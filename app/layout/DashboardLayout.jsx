import { Outlet } from "react-router-dom";
import Sidebar from "./Navigation/Sidebar.jsx";
import Topbar from "./Topbar/Topbar.jsx";

export default function DashboardLayout() {
  return (
    <div style={styles.shell}>
      <Sidebar />

      <div style={styles.main}>
        <Topbar />

        <main style={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

const styles = {
  shell: {
    minHeight: "100vh",
    display: "grid",
    gridTemplateColumns: "280px 1fr",
    background: "var(--bg)",
  },
  main: {
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
  },
  content: {
    padding: 20,
    minWidth: 0,
  },
};
