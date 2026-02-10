import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "@shared/ui/primitives/Button.jsx";
import Input from "@shared/ui/primitives/Input.jsx";
import InlineError from "@shared/ui/feedback/InlineError.jsx";
import { toastError, toastSuccess } from "@shared/ui/feedback/Toast.jsx";
import { useAuth } from "@/app/providers/AuthProvider";
import styles from "./loginPage.module.css";

export default function LoginPage() {
  const nav = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const from = useMemo(
    () => location.state?.from || "/proshop/products",
    [location.state]
  );

  const [email, setEmail] = useState("admin@proshop.com");
  const [password, setPassword] = useState("123456");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      await login({ email, password });
      toastSuccess("Welcome back");
      nav(from, { replace: true });
    } catch (error) {
      const msg = error?.message || "Login failed";
      setErr(msg);
      toastError(msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={styles.shell}>
      <div className={styles.card}>
        <div className={styles.brand}>
          <div className={styles.dot} aria-hidden="true" />
          <div>
            <div className={styles.title}>ProShop</div>
            <div className={styles.sub}>Admin Login</div>
          </div>
        </div>

        <form className={styles.form} onSubmit={onSubmit}>
          <div className={styles.field}>
            <div className={styles.label}>Email</div>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
            />
          </div>

          <div className={styles.field}>
            <div className={styles.label}>Password</div>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              type="password"
            />
          </div>

          <InlineError message={err} />

          <Button type="submit" disabled={busy}>
            {busy ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <div className={styles.hint}>
          API placeholder: connect this form to{" "}
          <code>/shared/api/http/endpoints.js</code> later.
        </div>
      </div>
    </div>
  );
}
