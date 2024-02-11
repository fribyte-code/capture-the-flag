import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../App";
import { useAuth } from "../hooks/useAuth";
import DarkIcon from "./icons/DarkIcon";
import LightIcon from "./icons/LightIcon";
import config from "../config";
import style from "./header.module.css";
import Toggle from "./toggle";
import classNames from "classnames";

export default function Header() {
  const navigate = useNavigate();
  const { logout, me } = useAuth();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [sideMenuVisible, setSideMenuVisible] = useState(false);

  const toggleSideMenu = () => {
    setSideMenuVisible(!sideMenuVisible);
  };

  const menuItems = (
    <>
      <div className={`${style.navItem} ${style.toggle}`}>
        <LightIcon />
        <Toggle
          checked={theme === "dark"}
          onChange={() => toggleTheme()}
          label="Toggle color theme"
        />
        <DarkIcon />
      </div>
      <a
        href="/leaderboard"
        onClick={(e) => {
          e.preventDefault();
          navigate("/leaderboard");
        }}
        className={style.navItem}
      >
        Leaderboard
      </a>
      {me && me.isAdmin && (
        <a
          href="/admin"
          onClick={(e) => {
            e.preventDefault();
            navigate("/admin");
          }}
          className={style.navItem}
        >
          Admin
        </a>
      )}
      <hr className={style.divider} />
      <button
        role="button"
        aria-label="Logout"
        onClick={logout}
        className={classNames(style.logout, "button")}
        title="Logout"
      >
        <span className="material-symbols-outlined">logout</span>
      </button>
    </>
  );

  return (
    <header>
      <nav className={style.header} aria-label="Global">
        <div className={style.burger}>
          <button className="button" onClick={toggleSideMenu}>
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
        <div className={style.logo}>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
            }}
          >
            <img src={config.BRAND_LOGO ?? "/images/fribyte-logo.png"} alt="" />
            <span className={style.brandName}>
              {config.BRAND_NAME ?? "friByte"}
            </span>
          </a>
        </div>
        <div className={style.navItems}>{menuItems}</div>
      </nav>

      <div
        className={classNames(style.sideMenu, {
          [style.sideMenuOpen]: sideMenuVisible,
        })}
      >
        <button className="button" onClick={toggleSideMenu}>
          <span className="material-symbols-outlined">menu</span>
        </button>
        {menuItems}
      </div>
      <div
        className={classNames(style.menuBackground, {
          [style.sideMenuOpen]: sideMenuVisible,
        })}
        onClick={toggleSideMenu}
      ></div>
    </header>
  );
}
