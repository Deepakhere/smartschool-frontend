import Avatar from "../../../components/avatar";
import LogoSpinner from "../../../components/logo-spinner";
import { IOrganization } from "../../../types";
import useOrganizationController from "./organization-controller";

function Organization() {
  const { organization, isLoading, navigateHome, signOut } =
    useOrganizationController();
  return (
    <>
      {isLoading ? (
        <LogoSpinner />
      ) : (
        <div className="min-h-screen bg-gray-50 font-sans">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-2xl font-semibold text-base-400">
                  Organizations
                </h1>
                <p className="text-sm text-base-600 mt-1">
                  Select an organization to view and manage its information
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {}}
                  title="Add Organization"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
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
                  title="Sign Out"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-base-400 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <svg
                    className="h-5 w-5 mr-2 text-base-600"
                    xmlns="http://www.w3.org/2000/svg"
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
              {organization.map((workspace: IOrganization) => (
                <div
                  key={workspace.id}
                  onClick={() => navigateHome(workspace.id)}
                  className="bg-white shadow rounded-lg overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-200 hover:border-indigo-200"
                >
                  <div className="p-5 border-b border-gray-100">
                    <div className="flex items-center">
                      <Avatar name={workspace.name} />
                      <div className="ml-3">
                        <h3 className="text-lg font-medium text-base-400">
                          {workspace.name}
                        </h3>
                        {workspace.location && (
                          <p className="text-xs text-base-600">
                            {workspace.location}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="px-5 py-4">
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-base-600 uppercase font-medium">
                          Description
                        </p>
                        <p className="text-sm text-base-400">
                          {workspace.description || "No description provided"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-base-600 uppercase font-medium">
                          Code
                        </p>
                        <p className="text-sm text-base-400 font-mono">
                          {workspace.pincode}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 px-5 py-3 flex justify-between items-center">
                    <span className="text-xs text-base-600">
                      Click to manage
                    </span>
                    <div className="flex items-center">
                      <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {workspace.users.length} Users
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Organization;
