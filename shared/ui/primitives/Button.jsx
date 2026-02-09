import s from "./button.module.css";

export default function Button({
  variant = "primary",
  disabled,
  children,
  ...props
}) {
  return (
    <button
      type="button"
      className={`${s.btn} ${s[variant]} ${disabled ? s.disabled : ""}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
