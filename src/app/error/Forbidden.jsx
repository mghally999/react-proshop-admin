import Button from "../../shared/ui/primitives/Button";
import { useNavigate } from "react-router-dom";

export default function Forbidden() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg)",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: 420 }}>
        <h1 style={{ fontSize: 48, marginBottom: 8 }}>403</h1>
        <h2 style={{ marginBottom: 12 }}>Access Denied</h2>
        <p style={{ opacity: 0.75, marginBottom: 24 }}>
          You don’t have permission to access this page.
        </p>

        <Button onClick={() => navigate("/proshop")}>Back to Dashboard</Button>
      </div>
    </div>
  );
}
