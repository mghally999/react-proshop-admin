import styles from "./Input.module.css";

export default function Input({ label, error, ...props }) {
  return (
    <div className={styles.field}>
      {label && <label className={styles.label}>{label}</label>}

      <input className={styles.input} {...props} />

      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
}
