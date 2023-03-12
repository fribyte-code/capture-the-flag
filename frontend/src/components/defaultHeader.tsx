import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Example() {
  const navigate = useNavigate();
  const { logout } = useAuth();

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
