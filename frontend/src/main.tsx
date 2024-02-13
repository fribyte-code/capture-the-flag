import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import config from "./config";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
);

(() => {
  const colorScheme =
    import.meta.env.VITE_APP_COLOR_SCHEME || config.APP_COLOR_SCHEME;
  console.log(config);
  if (colorScheme) {
    const htmlRoot = document.getElementsByTagName("html")[0];
    htmlRoot.setAttribute("data-color-scheme", colorScheme);
  }
})();
