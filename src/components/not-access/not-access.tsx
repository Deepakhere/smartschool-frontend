import React from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { USER_ACCESS_KEY } from "../../utils";

const NotAccess: React.FC = () => {
  const navigate = useNavigate();
  const userRole = Cookies.get(USER_ACCESS_KEY.ROLE);

  const handleGoToDashboard = () => {
    if (userRole) {
      navigate(`/${userRole}/dashboard`);
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg text-center">
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Access Denied
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sorry, you don't have permission to access this page or the page
            doesn't exist.
          </p>
        </div>
        <div className="flex flex-col space-y-4">
          <button
            onClick={handleGoToDashboard}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotAccess;
