// import { ReactNode } from "react";
import { Outlet } from "react-router-dom";

import Header from "../header";
import Sidebar from "../sidebar";
// import Footer from "../footer";
import { useLayoutController } from "./layout-controller";

// interface LayoutProps {
//   children: ReactNode;
// }

// ... existing code ...
const Layout = () => {
  const { isSidebarOpen } = useLayoutController();

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {isSidebarOpen && <Sidebar />}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
// ... existing code ...

export default Layout;
