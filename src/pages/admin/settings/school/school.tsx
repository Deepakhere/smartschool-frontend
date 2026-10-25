import { BuildingOffice2Icon } from "@heroicons/react/24/outline";

import { TextareaField, TextField } from "@/components/form-fields";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import LetterheadForm from "./components/letterhead-form";
import useSchoolSettingsController from "./school-controller";

// the school's name, logo and registration details, as printed on certificates
const SchoolSettings = () => {
  const c = useSchoolSettingsController();
  const { form } = c;

  return (
    <div className="space-y-6">
      <Card>
        <CardTitle className="font-medium">School details</CardTitle>
        <div className="mt-4 flex flex-col gap-6 sm:flex-row">
          <div className="flex shrink-0 flex-col items-center gap-2">
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
              {c.organization?.logo?.url ? (
                <img src={c.organization.logo.url} alt="School logo" className="h-full w-full object-contain" />
              ) : (
                <BuildingOffice2Icon className="h-10 w-10 text-gray-400" />
              )}
            </div>
            <input
              ref={c.logoInput}
              type="file"
              accept="image/png,image/jpeg"
              className="hidden"
              onChange={(e) => c.onLogoChosen(e.target.files?.[0])}
            />
            <Button variant="secondary" size="sm" loading={c.isUploadingLogo} onClick={c.pickLogo}>
              {c.organization?.logo?.url ? "Change logo" : "Upload logo"}
            </Button>
            <p className="text-xs text-gray-500">PNG or JPG</p>
          </div>
          <Form {...form}>
            <form onSubmit={c.onSubmit} noValidate className="flex-1 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <TextField form={form} name="name" label="School name" />
                <TextField form={form} name="pincode" label="Pincode" />
                <TextField form={form} name="address" label="Address" className="sm:col-span-2" />
                <TextareaField
                  form={form}
                  name="description"
                  label="About the school"
                  rows={2}
                  className="sm:col-span-2"
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit" loading={c.isSaving} disabled={!c.isDirty}>
                  Save
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </Card>

      <LetterheadForm organizationId={c.organizationId} letterhead={c.organization?.letterhead} />
    </div>
  );
};

export default SchoolSettings;
