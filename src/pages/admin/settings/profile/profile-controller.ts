import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";

import { useAuth } from "../../../../context/auth-context";
import { useTheme } from "../../../../context/theme-context";
import { useUpdateUserPreferences } from "./service";

const useProfileController = () => {
  const { t, i18n } = useTranslation();
  const { user, updatePreferences } = useAuth();
  const { theme, setTheme } = useTheme();
  const updateServerPreferences = useUpdateUserPreferences();

  const [editMode, setEditMode] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // react-i18next already re-renders on language change, so i18n.language itself
  // is the current language — no need to mirror it into its own state
  const currentLanguage = i18n.language || "en";

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("i18nextLng", lng);
    Cookies.set("i18nextLng", lng, { expires: 365 });
    document.documentElement.lang = lng;

    if (lng === "en" || lng === "hi") {
      updatePreferences({ locale: lng });
      if (user) updateServerPreferences.mutate({ locale: lng });
    }
  };

  const changeTheme = (newTheme: "light" | "dark") => {
    setTheme(newTheme);
  };

  // derived straight from the shared user object — no local state to keep in sync,
  // defaulting true (matches the backend default) until the user is known
  const emailNotifications = user?.preferences?.emailNotifications ?? true;
  const smsNotifications = user?.preferences?.smsNotifications ?? true;

  const changeEmailNotifications = (checked: boolean) => {
    updatePreferences({ emailNotifications: checked });
    updateServerPreferences.mutate({ emailNotifications: checked });
  };

  const changeSmsNotifications = (checked: boolean) => {
    updatePreferences({ smsNotifications: checked });
    updateServerPreferences.mutate({ smsNotifications: checked });
  };

  return {
    t,
    user,
    editMode,
    imageUrl,
    currentLanguage,
    theme,
    setEditMode,
    handleAvatarChange,
    changeLanguage,
    changeTheme,
    emailNotifications,
    smsNotifications,
    changeEmailNotifications,
    changeSmsNotifications,
  };
};

export default useProfileController;
