import { CheckCircleIcon, ExclamationTriangleIcon } from "@heroicons/react/20/solid";

import FormDialog from "@/components/form-dialog";
import { TextField } from "@/components/form-fields";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ICreateUpdateUserModalProps } from "@/types";

const CreateUpdateUserModal = ({
  t,
  isOpen,
  form,
  roleOptions,
  permissionOptions,
  isEditUser,
  isEditingSelf,
  isLoadingAddUserDetail,
  isLoadingUpdateUserDetail,
  onClose,
  onSubmit,
  handlePermissionChange,
}: ICreateUpdateUserModalProps) => {
  const isLoading = isEditUser ? isLoadingUpdateUserDetail : isLoadingAddUserDetail;
  const role = form.watch("role");
  const permissions = form.watch("permissions");

  return (
    <FormDialog
      form={form}
      open={isOpen}
      onClose={onClose}
      title={isEditUser ? t("labels.edit_user") : t("labels.add_user")}
      submitLabel={isEditUser ? t("buttons.update_user") : t("buttons.save_user")}
      isSubmitting={isLoading}
      onSubmit={onSubmit}
      className="max-w-2xl"
    >
      <TextField form={form} name="fullname" label={t("labels.fullname")} placeholder={t("messages.enter_your_full_name")} />
      <TextField
        form={form}
        name="email"
        type="email"
        label={t("labels.email_address")}
        placeholder={t("messages.enter_your_email")}
      />

      {isEditingSelf && (
        <div className="rounded-md border border-gray-200 bg-gray-50 p-3 text-sm text-gray-800">
          You can't change your own role or permissions. Ask another admin if this needs to change.
        </div>
      )}

      <div>
        <Label>{t("labels.user_role")}</Label>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {roleOptions.map((roleOption) => (
            <button
              type="button"
              key={roleOption.value}
              disabled={isEditingSelf}
              aria-pressed={role === roleOption.value}
              onClick={() => form.setValue("role", roleOption.value, { shouldDirty: true })}
              className={cn(
                "relative rounded-lg border p-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50",
                role === roleOption.value ? "border-primary-500 bg-primary-50" : "border-gray-300 hover:border-primary-300"
              )}
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">{roleOption.icon}</div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{roleOption.label}</p>
                  <p className="mt-1 text-xs text-gray-500">{roleOption.description}</p>
                </div>
              </div>
              {role === roleOption.value && (
                <CheckCircleIcon className="absolute right-2 top-2 h-5 w-5 text-primary-500" aria-hidden="true" />
              )}
            </button>
          ))}
        </div>
      </div>

      {role !== "parent" ? (
        <div className="rounded-md bg-gray-50 p-4">
          <Label className="mb-3">{t("labels.permissions")}</Label>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {permissionOptions.map((permission) => (
              <div
                key={permission.id}
                className={cn(
                  "flex items-start gap-3 rounded-md border p-3",
                  permissions[permission.id] ? "border-primary-500 bg-primary-50" : "border-gray-200 hover:border-primary-300"
                )}
              >
                <div className="flex h-5 items-center">
                  <Checkbox
                    id={permission.id}
                    disabled={isEditingSelf}
                    checked={!!permissions[permission.id]}
                    onChange={() => handlePermissionChange(permission.id)}
                  />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">{permission.icon}</div>
                    <label htmlFor={permission.id} className="ml-2 text-sm font-medium text-gray-900">
                      {permission.label}
                    </label>
                  </div>
                  <span className="mt-1 text-xs text-gray-500">{permission.description}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex rounded-md border border-yellow-200 bg-yellow-50 p-4">
          <ExclamationTriangleIcon className="h-5 w-5 flex-shrink-0 text-yellow-400" aria-hidden="true" />
          <div className="ml-3">
            <p className="text-sm font-medium text-yellow-800">{t("labels.parent_role_notice")}</p>
            <p className="mt-2 text-sm text-yellow-700">{t("messages.parent_role_notice")}</p>
          </div>
        </div>
      )}
    </FormDialog>
  );
};

export default CreateUpdateUserModal;
