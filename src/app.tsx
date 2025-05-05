import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { AuthProvider } from "./context/auth-context";
import { router } from "./routes";

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster />
    </AuthProvider>
  );
}

export default App;
