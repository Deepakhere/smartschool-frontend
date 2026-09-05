import { Outlet } from "react-router-dom";

import Header from "../header";
import Sidebar from "../sidebar";
import { PageHeaderProvider } from "../../context/page-header-context";
import { useLayoutController } from "./layout-controller";

const Layout = () => {
  const { isSidebarOpen, toggleSidebar, isCollapsed, toggleCollapse } = useLayoutController();

  return (
    <PageHeaderProvider>
      <div className="h-screen flex flex-col">
        <Header onToggleSidebar={toggleSidebar} isCollapsed={isCollapsed} onToggleCollapse={toggleCollapse} />
        <div className="flex flex-1 overflow-hidden">
          {isSidebarOpen && <Sidebar isCollapsed={isCollapsed} />}
          <main className="relative flex-1 overflow-y-auto bg-gray-50">
            <div className="p-6">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </PageHeaderProvider>
  );
};

export default Layout;
