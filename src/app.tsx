import { RouterProvider } from "react-router-dom";

import { AuthProvider } from "./context/auth-context";
import { ThemeProvider } from "./context/theme-context";
import { TooltipProvider } from "./components/ui/tooltip";
import AppToaster from "./components/app-toaster";
import router from "./routes";

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <TooltipProvider delayDuration={150} disableHoverableContent>
          <RouterProvider router={router} />
        </TooltipProvider>
        <AppToaster />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
