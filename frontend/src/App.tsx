import "./styles/index.css";
import { ReactNode, createContext, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Tasks from "./pages/Tasks";
import Login from "./pages/Login";
import Leaderboard from "./pages/Leaderboard";
import useTheme from "./hooks/useTheme";
import config from "./config";
import useDynamicHead from "./utils/useDynamicHead";
import Protected from "./components/protected";
import Admin from "./pages/Admin";
import AdminTeamManagement from "./pages/AdminTeamManagement";

export const ThemeContext = createContext<{
  theme: "light" | "dark";
  toggleTheme: () => void;
  setTheme: (theme: "light" | "dark") => void;
}>({
  theme: "dark",
  toggleTheme: () => {},
  setTheme: (theme) => {},
});

export const ToastContext = createContext<{
  toast: (toastComponent: ReactNode) => void;
  message: ReactNode;
}>({
  toast: (toastComponent) => {},
  message: null,
});

const App = () => {
  const { theme, setTheme, toggleTheme } = useTheme();
  const [toastMessage, setToastMessage] = useState<ReactNode>(null);

  useDynamicHead(
    config.APP_BRAND_TITLE ?? "friByte CTF",
    config.APP_BRAND_FAVICON ?? "/images/fribyte-favicon.ico",
  );

  return (
    <ToastContext.Provider
      value={{ message: toastMessage, toast: setToastMessage }}
    >
      <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route element={<Protected />}>
              <Route path="/" element={<Tasks />} />
            </Route>
            <Route element={<Protected scope="admin" />}>
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/teams" element={<AdminTeamManagement />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeContext.Provider>
    </ToastContext.Provider>
  );
};

export default App;
