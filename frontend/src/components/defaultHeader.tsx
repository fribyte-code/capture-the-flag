import { useNavigate } from "react-router-dom";
import { fetchLogout } from "../api/backendComponents";

export default function Example() {
  const navigate = useNavigate();
  const logout = async () => {
    await fetchLogout({});
    navigate("/login");
  };
  return (
    <header>
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
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
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <a
            href="/leaderboard"
            onClick={(e) => {
              e.preventDefault();
              navigate("/leaderboard");
            }}
          >
            Leaderboard
          </a>
          <button
            role="button"
            aria-label="Logout"
            onClick={logout}
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            Logg ut
          </button>
        </div>
      </nav>
    </header>
  );
}
