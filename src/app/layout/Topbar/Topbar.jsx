import { useNavigate } from "react-router-dom";
import { useAuth } from "@/app/providers/AuthProvider.jsx";
import Button from "@shared/ui/primitives/Button.jsx";
import styles from "./topbar.module.css"; // create if you want

export default function Topbar() {
  const nav = useNavigate();
  const { user, logout } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <div className={styles.title}>Pro Shop — EPIC Admin</div>
      </div>

      <div className={styles.right}>
        <div className={styles.user}>
          <div className={styles.userName}>{user?.name || "Admin"}</div>
          <div className={styles.userEmail}>{user?.email || ""}</div>
        </div>

        <Button
          variant="ghost"
          onClick={() => {
            logout();
            nav("/login", { replace: true });
          }}
        >
          Logout
        </Button>
      </div>
    </header>
  );
}
