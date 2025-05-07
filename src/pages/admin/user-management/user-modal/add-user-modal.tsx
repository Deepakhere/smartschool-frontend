import { XMarkIcon } from "@heroicons/react/24/outline";

import { AddUserModalProps } from "../../../../types";
import ButtonSpinner from "../../../../icons/button-spinner";

const AddUserModal = ({
  isOpen,
  formData,
  isLoadingAddUserDetail,
  roleOptions,
  permissionOptions,
  onClose,
  setFormData,
  handleSubmit,
  handlePermissionChange,
}: AddUserModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div
            className="absolute inset-0 bg-gray-500 opacity-75"
            onClick={onClose}
          ></div>
        </div>

        <div className="inline-block transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-6">
                Add New User
              </h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="fullname"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullname"
                    placeholder="Enter full name"
                    value={formData.fullname}
                    onChange={(e) =>
                      setFormData({ ...formData, fullname: e.target.value })
                    }
                    className="mt-1 block w-full p-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="Enter email address"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="mt-1 block w-full p-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="role"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    User Role
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {roleOptions.map((role) => (
                      <div
                        key={role.value}
                        className={`relative rounded-lg border p-4 cursor-pointer ${
                          formData.role === role.value
                            ? "border-indigo-500 bg-indigo-50"
                            : "border-gray-300 hover:border-indigo-300"
                        }`}
                        onClick={() =>
                          setFormData({
                            ...formData,
                            role: role.value as "admin" | "parent",
                          })
                        }
                      >
                        <div className="flex items-center">
                          <div className="flex-shrink-0">{role.icon}</div>
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-gray-900">
                              {role.label}
                            </h3>
                            <p className="text-xs text-gray-500 mt-1">
                              {role.description}
                            </p>
                          </div>
                        </div>
                        {formData.role === role.value && (
                          <div className="absolute top-2 right-2">
                            <svg
                              className="h-5 w-5 text-indigo-500"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {formData.role !== "parent" ? (
                  <div className="bg-gray-50 p-4 rounded-md">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Permissions
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      {permissionOptions.map((permission) => (
                        <div
                          key={permission.id}
                          className={`flex items-start space-x-3 p-3 rounded-md border ${
                            formData.permissions[
                              permission.id as keyof typeof formData.permissions
                            ]
                              ? "border-indigo-500 bg-indigo-50"
                              : "border-gray-200 hover:border-indigo-300"
                          }`}
                        >
                          <div className="flex items-center h-5">
                            <input
                              type="checkbox"
                              id={permission.id}
                              checked={
                                formData.permissions[
                                  permission.id as keyof typeof formData.permissions
                                ]
                              }
                              onChange={() =>
                                handlePermissionChange(
                                  permission.id as keyof typeof formData.permissions
                                )
                              }
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                          </div>
                          <div className="flex flex-col">
                            <div className="flex items-center">
                              <div className="flex-shrink-0">
                                {permission.icon}
                              </div>
                              <label
                                htmlFor={permission.id}
                                className="ml-2 text-sm font-medium text-gray-900"
                              >
                                {permission.label}
                              </label>
                            </div>
                            <span className="text-xs text-gray-500 mt-1">
                              {permission.description}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-5 w-5 text-yellow-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800">
                          Parent Role Notice
                        </h3>
                        <div className="mt-2 text-sm text-yellow-700">
                          <p>
                            Parents have read-only access by default. They can
                            view content but cannot modify it.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-6 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={isLoadingAddUserDetail}
                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoadingAddUserDetail ? <ButtonSpinner /> : "Save User"}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUserModal;
