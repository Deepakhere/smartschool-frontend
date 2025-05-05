import { NavLink } from 'react-router-dom';

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard' },
  { name: 'Classes', href: '/admin/classes' },
  { name: 'Students', href: '/admin/students' },
  { name: 'Teachers', href: '/admin/teachers' },
  { name: 'Fees', href: '/admin/fees' },
  { name: 'Attendance', href: '/admin/attendance' },
  { name: 'Exams', href: '/admin/exams' },
  { name: 'Results', href: '/admin/results' },
  { name: 'Settings', href: '/admin/settings' },
];

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-800">
      <div className="flex flex-col h-full">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <nav className="flex-1 px-2 space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 