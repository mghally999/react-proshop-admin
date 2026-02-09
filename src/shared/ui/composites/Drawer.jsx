import { createPortal } from "react-dom";
import styles from "./Drawer.module.css";
import Button from "../primitives/Button.jsx";

export function Drawer({ open, onClose, title, children }) {
  if (!open) return null;

  return createPortal(
    <div className={styles.backdrop} onClick={onClose}>
      <aside className={styles.drawer} onClick={(e) => e.stopPropagation()}>
        <header className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <Button variant="ghost" onClick={onClose}>
            ✕
          </Button>
        </header>

        <div className={styles.content}>{children}</div>
      </aside>
    </div>,
    document.body
  );
}
