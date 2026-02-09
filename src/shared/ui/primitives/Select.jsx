import styles from "./Select.module.css";

export default function Select({
  label,
  value,
  onChange,
  options = [],
  placeholder,
  disabled = false,
}) {
  return (
    <div className={styles.wrapper}>
      {label && <label className={styles.label}>{label}</label>}

      <select
        className={styles.select}
        value={value}
        onChange={onChange}
        disabled={disabled}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}

        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
