import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { AuthProvider } from "./context/auth-context";
import { ThemeProvider } from "./context/theme-context";
import Routes from "./routes";

function App() {
  const routes = Routes();

  return (
    <AuthProvider>
      <ThemeProvider>
        <RouterProvider router={routes} />
        <Toaster />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
