import { PlusIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

import PageLoader from "../../../../components/page-loader";
import NoRecordIcon from "../../../../icons/no-record-icon";
import CustomSelectDropdown from "../../../../components/custom-select";
import { CreateUpdateUserModal } from "./user-modal";
import DeleteConfirmationDialog from "../../../../components/delete-confirmation-dialog";
import useUserDetailsController from "./user-details-controller";

const UserDetails = () => {
  const {
    t,
    sortBy,
    formData,
    isModalOpen,
    isEditingSelf,
    users,
    isEditUser,
    roleOptions,
    permissionOptions,
    roleOptionsDropDown,
    searchTerm,
    isDeleteModalOpen,
    onSearchInputChange,
    deleteUserId,
    isFetchingGetAllUserDetails,
    isLoadingUpdateUserDetail,
    isLoadingAddUserDetail,
    isLoadingGetAllUserDetails,
    isLoadingDeleteUser,
    onCancel,
    onRoleChange,
    setSortBy,
    setFormData,
    setIsModalOpen,
    handleSubmituserDetails,
    handlePermissionChange,
    setSearchTerm,
    handleDeleteUser,
    handleEditUserDetails,
    onClickDeleteUser,
    onCancelDeleteModal,
  } = useUserDetailsController();

  return (
    <>
      {isLoadingGetAllUserDetails ? (
        <PageLoader />
      ) : (
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            {/* Search field */}
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search users..."
                onChange={(e) => {
                  e.preventDefault();
                  onSearchInputChange(e.target.value);
                }}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div className="flex items-center space-x-4">
              {/* Role filter dropdown */}
              <div className="w-56">
                <CustomSelectDropdown
                  options={roleOptionsDropDown.map((option) => ({
                    id: option.value,
                    name: option.label,
                    description: option.description,
                    icon: option.icon,
                  }))}
                  value={
                    (() => {
                      const match = roleOptionsDropDown.find((option) => option.value === sortBy);
                      return match ? { id: match.value, name: match.label, description: match.description, icon: match.icon } : null;
                    })()
                  }
                  onChange={(o) => onRoleChange(String(o.id))}
                />
              </div>

              {/* Add user  */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                {t("labels.add_user")}
              </button>
            </div>
          </div>

          {/* Table Section */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("labels.username")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("labels.email")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("labels.role")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("labels.actions")}
                  </th>
                </tr>
              </thead>
              {isFetchingGetAllUserDetails ? (
                <tbody>
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center">
                      <div className="flex justify-center items-center">
                        <div className="h-8 w-8 border-t-2 border-b-2 border-indigo-500 rounded-full animate-spin"></div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              ) : users && users.length > 0 ? (
                <tbody className="bg-white divide-y divide-gray-200">
                  {users?.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.role === "admin"
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          className={`text-indigo-600 mr-4 ${
                            user.permissions?.canUpdate
                              ? ""
                              : "cursor-not-allowed opacity-50"
                          }`}
                          title={t(
                            "messages.you_dont_have_permission_to_edit_user"
                          )}
                          onClick={() => handleEditUserDetails(user.id, true)}
                        >
                          {t("labels.edit")}
                        </button>
                        <button
                          className={`text-red-600 ${
                            user.permissions?.canDelete
                              ? ""
                              : "cursor-not-allowed opacity-50"
                          }`}
                          title={t(
                            "messages.you_dont_have_permission_to_delete_user"
                          )}
                          onClick={() => onClickDeleteUser(user.id)}
                        >
                          {t("labels.delete")}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              ) : (
                <tbody>
                  <tr>
                    <td colSpan={4}>
                      <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                        <div className="mb-4">
                          <NoRecordIcon />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">
                          {t("labels.no_records_found")}
                        </h3>
                        <p className="text-xs text-gray-500 mb-6 text-center max-w-md">
                          {searchTerm
                            ? `No users found matching "${searchTerm}". Try a different search term or clear the search.`
                            : `No users found with the selected filter. Try changing the filter or add a new user.`}
                        </p>
                        <button
                          onClick={() => {
                            setSearchTerm("");
                            setSortBy("all");
                          }}
                          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          {t("labels.clear_filters")}
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              )}
            </table>
          </div>

          <CreateUpdateUserModal
            t={t}
            isOpen={isModalOpen}
            formData={formData}
            roleOptions={roleOptions}
            permissionOptions={permissionOptions}
            isEditUser={isEditUser}
            isEditingSelf={isEditingSelf}
            isLoadingAddUserDetail={isLoadingAddUserDetail}
            isLoadingUpdateUserDetail={isLoadingUpdateUserDetail}
            setFormData={setFormData}
            onClose={onCancel}
            handleSubmit={(e) => handleSubmituserDetails(e)}
            handlePermissionChange={handlePermissionChange}
          />

          <DeleteConfirmationDialog
            open={isDeleteModalOpen}
            title="Delete User"
            description={
              <>
                Are you sure you want to delete{" "}
                <span className="font-medium italic text-gray-700">
                  {users?.find((u) => u.id === deleteUserId)?.name || "this user"}
                </span>
                ? This action cannot be undone.
              </>
            }
            isLoading={isLoadingDeleteUser}
            onClose={onCancelDeleteModal}
            onConfirm={handleDeleteUser}
          />
        </div>
      )}
    </>
  );
};

export default UserDetails;
