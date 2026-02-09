import styles from "./Badge.module.css";

export default function Badge({ children, tone = "neutral", size = "md" }) {
  const toneClass = styles[tone] || styles.neutral;
  const sizeClass = styles[size] || styles.md;

  return (
    <span className={`${styles.badge} ${toneClass} ${sizeClass}`}>
      {children}
    </span>
  );
}
