import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

import { useCreateOrganization } from "@/pages/auth/service";
import { useUpdateOrganization, useUploadOrganizationLogo } from "../service";
import { useError } from "@/hooks";
import { IOrganization } from "@/types";
import { organizationFormSchema, OrganizationFormValues } from "./add-organization-modal.schema";

// `organization` present = edit an existing school; absent = create a new one.
// Both modes share one form and one logo control — logo upload always needs a
// real organization id, so in create mode it fires right after the create
// succeeds, using the id the server just handed back.
const useAddOrganizationModalController = (
  isOpen: boolean,
  onClose: () => void,
  onSaved: () => void,
  organization?: IOrganization | null
) => {
  const { t } = useTranslation();
  const isEditMode = !!organization;
  const createOrganization = useCreateOrganization();
  const updateOrganization = useUpdateOrganization();
  const uploadLogo = useUploadOrganizationLogo();

  const form = useForm<OrganizationFormValues>({
    resolver: zodResolver(organizationFormSchema),
    defaultValues: { name: "", address: "", pincode: "", description: "" },
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | undefined>(undefined);

  useError({ mutation: createOrganization });
  useError({ mutation: updateOrganization });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: organization?.name || "",
        address: organization?.address || "",
        pincode: organization?.pincode || "",
        description: organization?.description || "",
      });
      setLogoFile(null);
      setLogoPreviewUrl(organization?.logo?.url);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, organization]);

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setLogoPreviewUrl(URL.createObjectURL(file));
    }
  };

  const onSubmit = form.handleSubmit((values) => {
    const finishUp = async (organizationId: string) => {
      if (logoFile) {
        // the organization itself is already saved at this point — a logo failure
        // shouldn't block the modal from closing, but the user still needs to know
        await uploadLogo.mutateAsync({ organizationId, file: logoFile }).catch(() => {
          toast.error(t("messages.organization_logo_upload_failed", "Logo upload failed. You can try again from the school settings."));
        });
      }
      onSaved();
      onClose();
    };

    if (isEditMode && organization) {
      updateOrganization.mutate(
        { organizationId: organization.id, value: values },
        {
          onSuccess: async () => {
            toast.success("Organization updated successfully.");
            await finishUp(organization.id);
          },
        }
      );
    } else {
      createOrganization.mutate(values, {
        onSuccess: async (created) => {
          toast.success(t("messages.organization_created_successfully"));
          await finishUp(created.id);
        },
      });
    }
  });

  return {
    t,
    form,
    isEditMode,
    logoPreviewUrl,
    handleLogoFileChange,
    onSubmit,
    isLoading: isEditMode ? updateOrganization.isPending : createOrganization.isPending,
    isUploadingLogo: uploadLogo.isPending,
  };
};

export default useAddOrganizationModalController;
