import { Outlet } from "react-router-dom";
import Header from "../header";
import Sidebar from "../sidebar";
import Footer from "../footer";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
