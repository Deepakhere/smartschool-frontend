import Avatar from "../../../components/avatar";
import LogoSpinner from "../../../components/logo-spinner";
import { IOrganization } from "../../../types";
import useOrganizationController from "./organization-controller";

function Organization() {
  const { workspaces, navigateHome, signOut, isLoading } =
    useOrganizationController();
  return (
    <>
      {isLoading ? (
        <LogoSpinner />
      ) : (
        <div className="min-h-screen bg-gray-50 p-6 font-sans">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mt-5">
                Organization
              </h1>
              <p className="text-gray-600">
                Selecting an organization allows you to view and manage its
                information efficiently.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {}}
                title="Add organization"
                className="bg-teal-600 hover:bg-teal-700 text-white font-montserrat font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:shadow-lg flex items-center gap-2"
              >
                {/* Plus icon SVG */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 5v14M5 12h14"></path>
                </svg>
                Add Organization
              </button>
              <button
                onClick={signOut}
                title="Add organization"
                className="bg-teal-600 hover:bg-teal-700 text-white font-montserrat font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:shadow-lg flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h6q.425 0 .713.288T12 4t-.288.713T11 5H5v14h6q.425 0 .713.288T12 20t-.288.713T11 21zm12.175-8H10q-.425 0-.712-.288T9 12t.288-.712T10 11h7.175L15.3 9.125q-.275-.275-.275-.675t.275-.7t.7-.313t.725.288L20.3 11.3q.3.3.3.7t-.3.7l-3.575 3.575q-.3.3-.712.288t-.713-.313q-.275-.3-.262-.712t.287-.688z"
                  />
                </svg>
                Sign Out
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {workspaces.map((workspace: IOrganization) => (
              <div
                key={workspace.id}
                title={`Click to manage ${workspace.name} Organization`}
                onClick={() => navigateHome(workspace.id)}
                className={`
                  cursor-pointer bg-white rounded-xl hover:shadow-xl shadow-sm border border-gray-200 overflow-hidden`}
              >
                <div className="p-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar name={workspace.name} />
                    <div>
                      <h3 className="font-medium text-gray-800">
                        {workspace.name}
                      </h3>
                      {workspace.location && (
                        <p className="text-xs text-gray-500">
                          Location: {workspace.location}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="px-4 py-2">
                  <p className="text-sm text-gray-600 mb-2">
                    Description: {workspace.description}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    Code: {workspace.pincode}
                  </p>
                </div>

                <div className="border-t border-gray-200 px-4 py-3 flex justify-end text-sm">
                  <div className="text-right">
                    <p className="font-medium text-gray-800">
                      {workspace.users.length}
                    </p>
                    <p className="text-gray-500">Total Users</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default Organization;
