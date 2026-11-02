import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";

import ErrorScreen from "@/shared/ui/error-screen";

const ContentError = ({ error }: FallbackProps) => <ErrorScreen error={error} inline />;

// a page that breaks shows its error beside the sidebar and under the header; opening another page clears it
const ContentErrorBoundary = ({ children }: { children: ReactNode }) => {
  const { pathname } = useLocation();
  return (
    <ErrorBoundary FallbackComponent={ContentError} resetKeys={[pathname]}>
      {children}
    </ErrorBoundary>
  );
};

export default ContentErrorBoundary;
