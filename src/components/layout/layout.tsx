import { Outlet } from "react-router-dom";

import Header from "../header";
import Sidebar from "../sidebar";
import { useLayoutController } from "./layout-controller";

const Layout = () => {
  const { isSidebarOpen, toggleSidebar, isCollapsed, toggleCollapse } = useLayoutController();

  return (
    <div className="h-screen flex flex-col">
      <Header onToggleSidebar={toggleSidebar} />
      <div className="flex flex-1 overflow-hidden">
        {isSidebarOpen && <Sidebar isCollapsed={isCollapsed} onToggleCollapse={toggleCollapse} />}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
