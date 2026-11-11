import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import PageLoader from "@/shared/ui/page-loader";

import { Header } from "@/widgets/header";
import { Sidebar } from "@/widgets/sidebar";
import { BillingBanner } from "@/widgets/billing-banner";
import { NotificationProvider } from "@/entities/notification";
import { useLayoutController } from "./layout-controller";
import ContentErrorBoundary from "./content-error-boundary";

const Layout = () => {
  useLayoutController();

  return (
    <NotificationProvider>
      <div className="h-dvh flex flex-col">
        <Header />
        <BillingBanner />
        <div className="flex flex-1 overflow-hidden relative">
          <Sidebar />
          <main className="app-main-surface relative flex-1 overflow-y-auto bg-gray-50">
            <div className="p-4 sm:p-6">
              <ContentErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <Outlet />
                </Suspense>
              </ContentErrorBoundary>
            </div>
          </main>
        </div>
      </div>
    </NotificationProvider>
  );
};

export default Layout;
