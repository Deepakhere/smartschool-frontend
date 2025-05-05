import { NavLink } from "react-router-dom";
import { useSidebarController } from "./sidebar-controller";

const Sidebar = () => {
  const { navigation } = useSidebarController();

  return (
    <div className="w-52 bg-white shadow-xl z-10">
      <div className="flex flex-col h-full">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <nav className="flex-1 px-2 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? "bg-gray-50 text-indigo-600"
                        : "text-gray-600 hover:bg-gray-50 hover:text-indigo-600"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={`mr-3 h-5 w-5 flex-shrink-0 ${
                          isActive
                            ? "text-indigo-600"
                            : "text-gray-400 group-hover:text-indigo-600"
                        }`}
                        aria-hidden="true"
                      />
                      {item.name}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
