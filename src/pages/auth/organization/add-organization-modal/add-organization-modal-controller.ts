import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

import { useCreateOrganization } from "../../service";
import { useUpdateOrganization, useUploadOrganizationLogo } from "../service";
import { useError } from "../../../../hooks";
import { IOrganization } from "../../../../types";

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

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [description, setDescription] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | undefined>(undefined);

  useError({ mutation: createOrganization });
  useError({ mutation: updateOrganization });

  useEffect(() => {
    if (isOpen) {
      setName(organization?.name || "");
      setAddress(organization?.address || "");
      setPincode(organization?.pincode || "");
      setDescription(organization?.description || "");
      setLogoFile(null);
      setLogoPreviewUrl(organization?.logo?.url);
    }
  }, [isOpen, organization]);

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setLogoPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !address.trim() || !pincode.trim()) {
      toast.error(t("messages.please_fill_all_required_fields"));
      return;
    }

    const finishUp = async (organizationId: string) => {
      if (logoFile) {
        await uploadLogo.mutateAsync({ organizationId, file: logoFile }).catch(() => {});
      }
      onSaved();
      onClose();
    };

    if (isEditMode && organization) {
      updateOrganization.mutate(
        { organizationId: organization.id, value: { name, address, pincode, description } },
        {
          onSuccess: async () => {
            toast.success("Organization updated successfully.");
            await finishUp(organization.id);
          },
        }
      );
    } else {
      createOrganization.mutate(
        { name, address, pincode, description },
        {
          onSuccess: async (created) => {
            toast.success(t("messages.organization_created_successfully"));
            await finishUp(created.id);
          },
        }
      );
    }
  };

  return {
    t,
    isEditMode,
    name,
    address,
    pincode,
    description,
    logoPreviewUrl,
    setName,
    setAddress,
    setPincode,
    setDescription,
    handleLogoFileChange,
    handleSubmit,
    isLoading: isEditMode ? updateOrganization.isLoading : createOrganization.isLoading,
    isUploadingLogo: uploadLogo.isLoading,
  };
};

export default useAddOrganizationModalController;
