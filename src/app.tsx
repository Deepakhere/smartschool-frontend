import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { AuthProvider } from "./context/auth-context";
import Routes from "./routes";

function App() {
  const routes = Routes();

  return (
    <AuthProvider>
      <RouterProvider router={routes} />
      <Toaster />
    </AuthProvider>
  );
}

export default App;
