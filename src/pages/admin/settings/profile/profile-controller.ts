import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import i18n from "../../../../i18n";
import Cookies from "js-cookie";

import { useAuth } from "../../../../context/auth-context";
import { useTheme } from "../../../../context/theme-context";

const useProfileController = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();

  const [editMode, setEditMode] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || "en");

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
    setCurrentLanguage(lng);

    localStorage.setItem("i18nextLng", lng);
    Cookies.set("i18nextLng", lng, { expires: 365 });

    // Force reload translations
    document.documentElement.lang = lng;
  };

  const changeTheme = (newTheme: "light" | "dark") => {
    setTheme(newTheme);
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem("i18nextLng") || "en";
    if (savedLanguage && i18n.language !== savedLanguage) {
      i18n.changeLanguage(savedLanguage);
      setCurrentLanguage(savedLanguage);
    }
  }, []);

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
  };
};

export default useProfileController;
