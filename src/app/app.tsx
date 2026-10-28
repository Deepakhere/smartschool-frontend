import { RouterProvider } from "react-router-dom";

import { AuthProvider } from "../entities/session/model/auth-context";
import { ThemeProvider } from "../features/theme/theme-context";
import { TooltipProvider } from "../shared/ui/kit/tooltip";
import AppToaster from "../shared/ui/app-toaster";
import router from "./router";

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
