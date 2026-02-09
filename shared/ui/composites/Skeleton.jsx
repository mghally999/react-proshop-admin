import styles from "./Skeleton.module.css";

export default function Skeleton({ rows = 5 }) {
  const count = Math.max(1, Number(rows) || 1);

  return (
    <div className={styles.wrapper} aria-busy="true" aria-live="polite">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={styles.row}>
          <div className={styles.block} />
          <div className={styles.block} />
          <div className={styles.block} />
          <div className={styles.block} />
        </div>
      ))}
    </div>
  );
}
