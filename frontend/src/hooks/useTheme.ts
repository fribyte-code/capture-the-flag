import { useState, useEffect } from "react";

const useTheme = () => {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  useEffect(() => {
    if (theme) {
      return;
    }
    const darkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (darkMode) {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  }, []);

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

  return { theme, setTheme, toggleTheme };
};

export default useTheme;
