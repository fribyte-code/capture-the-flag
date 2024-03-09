import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchLogin, fetchLogout, fetchMe } from "../api/backendComponents";
import { LoggedInUserDto } from "../api/backendSchemas";
import { create } from "zustand";

interface UserStoreState {
  user: LoggedInUserDto | null;
  isLoading: boolean;
  hasFetched: boolean;
  setUser: (user: LoggedInUserDto | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  fetched: () => void;
}
const useUserStore = create<UserStoreState>((set) => ({
  user: null,
  isLoading: false,
  hasFetched: false,
  setUser: (user) => set(() => ({ user })),
  setIsLoading: (isLoading) => set(() => ({ isLoading })),
  fetched: () => set(() => ({ hasFetched: true })),
}));

export function useAuth() {
  const navigate = useNavigate();
  const { user, setUser, isLoading, setIsLoading, hasFetched, fetched } =
    useUserStore();
  let [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!isLoading && !hasFetched) {
      setIsLoading(true);
      fetchMeFromApi();
    }
  }, []);

  async function fetchMeFromApi() {
    try {
      const meFromApi = await fetchMe({});
      setUser(meFromApi);
    } catch (error) {
      // Its okay to fail here, user is not logged in
      setUser(null);
    } finally {
      fetched();
      setIsLoading(false);
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
      setUser(null);
      deleteCookie(".AspNetCore.Identity.Application");
    } catch (error) {
      // Cookie is most probably not valid
    }
  }

  return {
    me: user,
    login,
    logout,
    errorMsg,
    fetchMeFromApi,
    isLoading,
    hasFetched,
  };
}

function deleteCookie(cookieName: string) {
  document.cookie = cookieName + ";expires=Thu, 01 Jan 1970 00:00:00 GMT";
}
