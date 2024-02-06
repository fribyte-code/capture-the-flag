import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../App";
import { useAuth } from "../hooks/useAuth";
import DarkIcon from "./icons/DarkIcon";
import LightIcon from "./icons/LightIcon";
import config from "../config";

export default function Header() {
  const navigate = useNavigate();
  const { logout, me } = useAuth();
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <header>
      <nav className="navbar container mx-auto" aria-label="Global">
        <div className="navbar-start">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
            }}
            className="flex items-center gap-2 -m-1.5 p-8"
          >
            <img
              className="h-16 w-auto float-left"
              src={config.brand_name ?? "images/fribyte-logo.png"}
              alt=""
            />
            <span className="ml-2 text-2xl">
              {config.brand_name ?? "friByte"}
            </span>
          </a>
        </div>
        <div className="navbar-end">
          <div className="flex">
            <LightIcon className="w-8" />
            <input
              type="checkbox"
              className="toggle m-auto mx-1"
              checked={theme === "dark"}
              onChange={() => toggleTheme()}
              aria-label="Toggle color theme"
            />
            <DarkIcon className="w-8" />
          </div>
          <a
            href="/leaderboard"
            onClick={(e) => {
              e.preventDefault();
              navigate("/leaderboard");
            }}
            className="btn btn-ghost"
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
              className="btn btn-ghost"
            >
              Admin
            </a>
          )}
          <button
            role="button"
            aria-label="Logout"
            onClick={logout}
            className="btn btn-ghost"
          >
            Logout
          </button>
        </div>
      </nav>
    </header>
  );
}
