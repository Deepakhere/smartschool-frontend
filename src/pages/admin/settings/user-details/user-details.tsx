import { PlusIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

import NoRecordFound from "@/components/no-record-found";
import CustomSelectDropdown from "@/components/custom-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell, TableSkeleton } from "@/components/table";
import { CreateUpdateUserModal } from "./user-modal";
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog";
import Pager from "@/components/pager";
import useUserDetailsController from "./user-details-controller";

const UserDetails = () => {
  const {
    t,
    sortBy,
    form,
    isModalOpen,
    isEditingSelf,
    users,
    isEditUser,
    roleOptions,
    permissionOptions,
    roleOptionsDropDown,
    searchTerm,
    searchInput,
    isDeleteModalOpen,
    onSearchInputChange,
    page,
    setPage,
    pageSize,
    totalUsers,
    openAddUser,
    canEdit,
    canDelete,
    deleteUserId,
    isFetchingGetAllUserDetails,
    isLoadingUpdateUserDetail,
    isLoadingAddUserDetail,
    isLoadingGetAllUserDetails,
    isLoadingDeleteUser,
    onCancel,
    onRoleChange,

    handleSubmituserDetails,
    handlePermissionChange,
    handleDeleteUser,
    handleEditUserDetails,
    onClickDeleteUser,
    onCancelDeleteModal,
  } = useUserDetailsController();

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        {/* Search field */}
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search users..."
            value={searchInput}
            onChange={(e) => onSearchInputChange(e.target.value)}
            className="pl-10 leading-5"
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
              value={(() => {
                const match = roleOptionsDropDown.find((option) => option.value === sortBy);
                return match
                  ? { id: match.value, name: match.label, description: match.description, icon: match.icon }
                  : null;
              })()}
              onChange={(o) => onRoleChange(String(o.id))}
            />
          </div>

          {/* Add user  */}
          <Button onClick={openAddUser}>
            <PlusIcon className="h-5 w-5" />
            {t("labels.add_user")}
          </Button>
        </div>
      </div>

      {/* Table Section */}
      <Table>
        <TableHeader>
          <TableHead>{t("labels.username")}</TableHead>
          <TableHead className="text-center">{t("labels.email")}</TableHead>
          <TableHead className="text-center">{t("labels.role")}</TableHead>
          <TableHead className="text-center">{t("labels.actions")}</TableHead>
        </TableHeader>
        {isLoadingGetAllUserDetails || isFetchingGetAllUserDetails ? (
          <TableSkeleton columns={4} />
        ) : users && users.length > 0 ? (
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="text-gray-900">{user.name}</TableCell>
                  <TableCell className="text-center">{user.email}</TableCell>
                  <TableCell className="text-center">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === "admin" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="link"
                      className="mr-4"
                      disabled={!canEdit}
                      title={canEdit ? undefined : t("messages.you_dont_have_permission_to_edit_user")}
                      onClick={() => handleEditUserDetails(user.id, true)}
                    >
                      {t("labels.edit")}
                    </Button>
                    {canDelete(user.id) && (
                      <Button variant="link" className="text-red-600 hover:text-red-800" onClick={() => onClickDeleteUser(user.id)}>
                        Remove
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          ) : (
            <TableBody>
              <tr>
                <td colSpan={4}>
                  <NoRecordFound
                    t={t}
                    searchTerm={searchTerm}
                    clearFilters={() => {
                      onSearchInputChange("");
                      onRoleChange("all");
                    }}
                  />
                </td>
              </tr>
            </TableBody>
        )}
      </Table>
      <Pager page={page} pageSize={pageSize} total={totalUsers} onPageChange={setPage} />

      <CreateUpdateUserModal
        t={t}
        isOpen={isModalOpen}
        form={form}
        roleOptions={roleOptions}
        permissionOptions={permissionOptions}
        isEditUser={isEditUser}
        isEditingSelf={isEditingSelf}
        isLoadingAddUserDetail={isLoadingAddUserDetail}
        isLoadingUpdateUserDetail={isLoadingUpdateUserDetail}
        onClose={onCancel}
        onSubmit={handleSubmituserDetails}
        handlePermissionChange={handlePermissionChange}
      />

      <DeleteConfirmationDialog
        open={isDeleteModalOpen}
        title="Remove from this school?"
        description={
          <>
            <span className="font-medium italic text-gray-700">
              {users?.find((u) => u.id === deleteUserId)?.name || "This user"}
            </span>{" "}
            will lose access to this school. If they belong to no other school, their account is deleted too. This
            cannot be undone.
          </>
        }
        confirmLabel="Remove"
        isLoading={isLoadingDeleteUser}
        onClose={onCancelDeleteModal}
        onConfirm={handleDeleteUser}
      />
    </div>
  );
};

export default UserDetails;
