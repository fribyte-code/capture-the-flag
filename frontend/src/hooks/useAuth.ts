import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchLogin, fetchLogout, fetchMe } from "../api/backendComponents";
import { LoggedInUserDto } from "../api/backendSchemas";

export function useAuth() {
  const navigate = useNavigate();
  const location = useLocation();
  const [me, setMe] = useState<LoggedInUserDto | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  let [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetchMeFromApi();
  }, []);

  /**
   * List of paths that are allowed to be accessed without being logged in
   */
  const allowedUnauthorizedPaths = ["/leaderboard"];

  useEffect(() => {
    if (
      !me &&
      isLoaded &&
      !allowedUnauthorizedPaths.includes(location.pathname)
    ) {
      logout();
    } else if (!!me && isLoaded && location.pathname == "/login") {
      navigate("/");
    }
  }, [me, isLoaded]);

  async function fetchMeFromApi() {
    try {
      const meFromApi = await fetchMe({});
      setMe(meFromApi);
    } catch (error) {
      // Its okay to fail here, user is not logged in
      setMe(null);
    } finally {
      setIsLoaded(true);
    }
  }

  async function login(username: string, password: string) {
    try {
      await fetchLogin({
        body: {
          username: username,
          password: password,
        },
      });
      console.debug("Logged in");
      await fetchMeFromApi();
      setErrorMsg("");
      navigate("/");
    } catch (error) {
      setErrorMsg("Wrong username or password!");
      console.debug("Wrong password");
    }
  }

  async function logout() {
    try {
      console.debug("logout");
      await fetchLogout({});
      navigate("/login");
      setMe(null);
      deleteCookie(".AspNetCore.Identity.Application");
    } catch (error) {
      // Cookie is most probably not valid
    }
  }

  return { me, login, logout, errorMsg, fetchMeFromApi };
}

function deleteCookie(cookieName: string) {
  document.cookie = cookieName + ";expires=Thu, 01 Jan 1970 00:00:00 GMT";
}
