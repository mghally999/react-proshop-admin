import styles from "./EmptyState.module.css";
import Button from "../primitives/Button.jsx";

export default function EmptyState({
  title = "Nothing here yet",
  description,
  actionLabel,
  onAction,
}) {
  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <div className={styles.icon} aria-hidden="true">
          ☐
        </div>

        <h3 className={styles.title}>{title}</h3>

        {description ? <p className={styles.desc}>{description}</p> : null}

        {actionLabel && typeof onAction === "function" ? (
          <div className={styles.actions}>
            <Button onClick={onAction}>{actionLabel}</Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
