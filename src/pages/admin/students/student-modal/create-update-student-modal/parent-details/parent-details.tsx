import { UseFormReturn } from "react-hook-form";

import { IStudentFormData } from "@/types";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface IParentDetailsFormProps {
  t: (key: string) => string;
  form: UseFormReturn<IStudentFormData>;
  isParentExist: boolean;
}

const ParentDetailsForm = ({ t, form, isParentExist }: IParentDetailsFormProps) => {
  return (
    <>
      <h3 className="text-md font-medium mb-4">{t("labels.parent_details")}</h3>
      <FormField
        control={form.control}
        name="parentEmail"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("labels.parent_email")}</FormLabel>
            <FormControl>
              <Input type="email" {...field} placeholder={t("messages.enter_parent_email")} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="parentName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("labels.parent_fullname")}</FormLabel>
            <FormControl>
              <Input {...field} placeholder={t("messages.enter_parent_full_name")} disabled={isParentExist} />
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
            <FormLabel>{t("labels.phone_number")}</FormLabel>
            <FormControl>
              <Input {...field} placeholder={t("messages.enter_phone_number")} disabled={isParentExist} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default ParentDetailsForm;
