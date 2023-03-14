import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);

declare global {
  interface Window {
    env?: {
      APP_API_URL?: string;
      APP_BUILD?: string;
      APP_BUILD_DATE?: string;
      [key: string]: string | undefined | number | boolean;
    };
  }
}
