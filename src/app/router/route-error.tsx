import { useRouteError } from "react-router-dom";

import ErrorScreen from "@/shared/ui/error-screen";

// an error outside the app layout (sign-in pages, the layout itself) lands here, not the router's bare default
const RouteError = () => <ErrorScreen error={useRouteError()} />;

export default RouteError;
