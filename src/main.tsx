import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import "./app/i18n";
import App from "./app/app";
import ErrorScreen from "./shared/ui/error-screen";
import { reloadForNewVersion } from "./shared/lib/stale-build";
import { trackAppOpen } from "./shared/lib/analytics";
import "./app/styles/index.css";
import { queryClient } from "./shared/api/query-client";

trackAppOpen();

// a page's code file from before the latest deploy is gone: reload onto the new build instead of failing
window.addEventListener("vite:preloadError", (event) => {
  if (reloadForNewVersion()) event.preventDefault();
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary fallbackRender={({ error }) => <ErrorScreen error={error} />}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
