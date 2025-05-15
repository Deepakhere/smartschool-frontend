import React, { useState } from "react";
import { useAuth } from "../../../../context/auth-context";

const useProfileController = () => {
  const { user } = useAuth();

  const [editMode, setEditMode] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageUrl(event.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  return {
    user,
    editMode,
    imageUrl,
    setEditMode,
    handleAvatarChange,
  };
};

export default useProfileController;
