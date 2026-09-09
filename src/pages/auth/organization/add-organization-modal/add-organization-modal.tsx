import { XMarkIcon, BuildingOffice2Icon, ArrowUpTrayIcon } from "@heroicons/react/24/outline";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../../../components/ui/form";
import { Input } from "../../../../components/ui/input";
import { Textarea } from "../../../../components/ui/textarea";
import ButtonSpinner from "../../../../icons/button-spinner";
import useAddOrganizationModalController from "./add-organization-modal-controller";
import { IOrganization } from "../../../../types";

interface AddOrganizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
  organization?: IOrganization | null;
}

const AddOrganizationModal = ({ isOpen, onClose, onCreated, organization }: AddOrganizationModalProps) => {
  const { t, form, isEditMode, logoPreviewUrl, handleLogoFileChange, onSubmit, isLoading, isUploadingLogo } =
    useAddOrganizationModalController(isOpen, onClose, onCreated, organization);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
        </div>

        <div className="relative w-full max-h-[90vh] overflow-y-auto transform rounded-lg bg-white text-left shadow-xl transition-all sm:max-w-lg">
          <div className="absolute top-4 right-4">
            <button
              type="button"
              className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={onClose}
            >
              <span className="sr-only">{t("labels.close")}</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="p-4 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
              {isEditMode ? "Edit Organization" : t("labels.add_organization")}
            </h3>

            <Form {...form}>
              <form onSubmit={onSubmit} className="space-y-4 text-left" noValidate>
                <div className="flex justify-center">
                  <div className="w-24 h-24 relative">
                    {logoPreviewUrl ? (
                      <img
                        src={logoPreviewUrl}
                        alt="School logo"
                        className="w-full h-full rounded-lg object-contain border border-gray-200 bg-white"
                      />
                    ) : (
                      <div className="w-full h-full rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
                        <BuildingOffice2Icon className="h-10 w-10 text-gray-300" />
                      </div>
                    )}
                    <label
                      htmlFor="organization-logo-upload"
                      className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 shadow-md cursor-pointer hover:bg-gray-50"
                    >
                      {isUploadingLogo ? <ButtonSpinner /> : <ArrowUpTrayIcon className="h-4 w-4 text-gray-600" />}
                    </label>
                    <input
                      id="organization-logo-upload"
                      type="file"
                      className="hidden"
                      accept="image/png,image/jpeg"
                      disabled={isUploadingLogo}
                      onChange={handleLogoFileChange}
                    />
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("labels.organization_name")}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("labels.address")}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pincode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("labels.pincode")}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("labels.description")}</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={3} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    {t("buttons.cancel")}
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading && <ButtonSpinner />}
                    {t("buttons.save")}
                  </button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddOrganizationModal;
