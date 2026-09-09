import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { XMarkIcon } from "@heroicons/react/24/outline";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../../../../components/ui/form";
import { Input } from "../../../../../components/ui/input";
import { IAddGuardianValue, SelectOption } from "../../../../../types";
import ButtonSpinner from "../../../../../icons/button-spinner";
import CustomSelectDropdown from "../../../../../components/custom-select";
import { guardianFormSchema, defaultGuardianFormValues, GuardianFormValues } from "./guardian-modal.schema";

const relationshipOptions: SelectOption[] = [
  { id: "FATHER", name: "Father" },
  { id: "MOTHER", name: "Mother" },
  { id: "GUARDIAN", name: "Guardian" },
  { id: "OTHER", name: "Other" },
];

interface GuardianModalProps {
  isOpen: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (value: IAddGuardianValue) => void;
}

const GuardianModal = ({ isOpen, isSubmitting, onClose, onSubmit }: GuardianModalProps) => {
  const form = useForm<GuardianFormValues>({
    resolver: zodResolver(guardianFormSchema),
    defaultValues: defaultGuardianFormValues,
  });

  if (!isOpen) return null;

  const handleFormSubmit = form.handleSubmit((values) => {
    onSubmit(values);
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        <div className="fixed inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>

        <div className="relative w-full max-h-[90vh] overflow-y-auto transform rounded-lg bg-white text-left shadow-xl transition-all sm:max-w-lg">
          <div className="absolute top-4 right-4">
            <button type="button" className="text-gray-400 hover:text-gray-500" onClick={onClose}>
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="p-4 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add Guardian</h3>

            <Form {...form}>
              <form onSubmit={handleFormSubmit} className="space-y-4 text-left" noValidate>
                <FormField
                  control={form.control}
                  name="parentEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="parentName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="relationshipType"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <CustomSelectDropdown
                          label="Relationship"
                          options={relationshipOptions}
                          value={relationshipOptions.find((o) => o.id === field.value) || null}
                          onChange={(o) => field.onChange(String(o.id))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-6">
                  <FormField
                    control={form.control}
                    name="isPrimaryGuardian"
                    render={({ field }) => (
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                        Primary guardian
                      </label>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="isEmergencyContact"
                    render={({ field }) => (
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                        Emergency contact
                      </label>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="canPickup"
                    render={({ field }) => (
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                        Can pick up
                      </label>
                    )}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {isSubmitting && <ButtonSpinner />}
                    Save
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

export default GuardianModal;
