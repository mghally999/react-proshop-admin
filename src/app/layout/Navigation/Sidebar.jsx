import { NavLink } from "react-router-dom";
import { sidebarItems } from "./sidebar.config.js";
import s from "./Sidebar.module.css";

export default function Sidebar() {
  return (
    <aside className={s.sidebar}>
      <div className={s.brand}>
        <div className={s.brandDot} />
        <div>
          <div className={s.brandTitle}>ProShop</div>
          <div className={s.brandSub}>Admin</div>
        </div>
      </div>

      {/* ✅ this class enables our global anti-blink rules */}
      <nav className={`${s.nav} sidebarNav`}>
        {sidebarItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              isActive ? `${s.link} ${s.active}` : s.link
            }
            // ✅ kills first-click focus permanently
            onMouseDown={(e) => e.preventDefault()}
          >
            {({ isActive }) => (
              <>
                {isActive ? <span className={s.activeBar} /> : null}
                <span className={s.bullet} />
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
