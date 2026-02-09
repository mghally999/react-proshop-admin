import s from "./placeholder.module.css";

export default function PlaceholderPage({ title, subtitle }) {
  return (
    <div className={s.wrap}>
      <h2 className={s.title}>{title}</h2>
      <p className={s.sub}>{subtitle}</p>
      <div className={s.card}>Coming next ✅</div>
    </div>
  );
}
