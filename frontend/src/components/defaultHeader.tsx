import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import DarkIcon from "./icons/DarkIcon";
import LightIcon from "./icons/LightIcon";

export default function Example() {
  const navigate = useNavigate();
  const { logout, me } = useAuth();
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const darkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (darkMode) {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  }, []);

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  useEffect(() => {
    if (theme === "dark") {
      document
        .getElementsByTagName("html")[0]
        .setAttribute("data-theme", "dracula");
    } else {
      document
        .getElementsByTagName("html")[0]
        .setAttribute("data-theme", "light");
    }
  }, [theme]);

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
            className="-m-1.5 p-1.5"
          >
            <img
              className="h-8 w-auto float-left"
              src="/images/fribyte-logo.png"
              alt=""
            />
            <span>friByte CTF</span>
          </a>
        </div>
        <div className="navbar-end">
          <div className="flex">
            <LightIcon className="w-8" />
            <input
              type="checkbox"
              data-toggle-theme="dracula,light"
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
            Logut
          </button>
        </div>
      </nav>
    </header>
  );
}
