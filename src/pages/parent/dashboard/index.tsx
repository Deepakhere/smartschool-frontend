import { Outlet } from 'react-router-dom';
import { useAuth } from '../../../context/auth-context';

const ParentDashboard = () => {
  const { logout } = useAuth();

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white">
        <div className="p-4">
          <h1 className="text-2xl font-bold">Parent Dashboard</h1>
        </div>
        <nav className="mt-4">
          <ul>
            <li className="p-2 hover:bg-gray-700">
              <a href="/parent/notices">Notices</a>
            </li>
            <li className="p-2 hover:bg-gray-700">
              <a href="/parent/homework">Homework</a>
            </li>
            <li className="p-2 hover:bg-gray-700">
              <a href="/parent/reports">Reports</a>
            </li>
            <li className="p-2 hover:bg-gray-700">
              <a href="/parent/fees">Fees</a>
            </li>
            <li className="p-2 hover:bg-gray-700">
              <button onClick={logout}>Logout</button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default ParentDashboard; 