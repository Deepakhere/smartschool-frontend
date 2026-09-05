import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

import { useCreateOrganization } from "../../service";
import { useError } from "../../../../hooks";

const useAddOrganizationModalController = (
  isOpen: boolean,
  onClose: () => void,
  onCreated: () => void
) => {
  const { t } = useTranslation();
  const createOrganization = useCreateOrganization();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [description, setDescription] = useState("");

  useError({ mutation: createOrganization });

  useEffect(() => {
    if (!isOpen) {
      setName("");
      setAddress("");
      setPincode("");
      setDescription("");
    }
  }, [isOpen]);

  useEffect(() => {
    if (createOrganization.isSuccess) {
      toast.success(t("messages.organization_created_successfully"));
      onCreated();
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createOrganization.isSuccess]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !address.trim() || !pincode.trim()) {
      toast.error(t("messages.please_fill_all_required_fields"));
      return;
    }

    createOrganization.mutate({ name, address, pincode, description });
  };

  return {
    t,
    name,
    address,
    pincode,
    description,
    setName,
    setAddress,
    setPincode,
    setDescription,
    handleSubmit,
    isLoading: createOrganization.isLoading,
  };
};

export default useAddOrganizationModalController;
